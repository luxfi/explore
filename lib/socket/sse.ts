// EventSource-backed, Phoenix-Channels-compatible realtime transport.
//
// The Lux explorer Go backend (luxfi/explorer) serves realtime over
// Server-Sent Events at `<socketEndpoint>/v1/base/realtime` — a single
// multiplexed stream that wraps every hub broadcast in a JSON envelope:
//
//     event: CONNECT          (once, on open)
//     data: {}
//
//     data: {"event":"<hubChannel>","chain":"<slug>","data":<payload>}
//
//     : ping                  (keep-alive every 30s)
//
// There is NO Phoenix WebSocket endpoint (the legacy FE opened
// `wss://.../socket/v2/websocket` and got a 404, which surfaced as
// "Live updates temporarily delayed"). Rather than rewrite all 27
// realtime consumers, this module reimplements the slice of the Phoenix
// `Socket`/`Channel` API those consumers use, backed by one EventSource.
// The seam (`SocketProvider` / `useSocketChannel` / `useSocketMessage`)
// stays; only the transport underneath changes.

export type MessageRef = string;

type Payload = unknown;
// The transport hands consumers the raw wire payload; each consumer re-types
// it for its specific message (see useSocketMessage). This single `any`
// boundary mirrors the Phoenix `Channel.on` signature this replaces.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WirePayload = any;
type EventHandler = (payload?: WirePayload) => void;
type StateHandler = () => void;
type StateKind = 'open' | 'close' | 'error';
type PushStatus = 'ok' | 'error' | 'timeout';

// Options accepted by SocketProvider. Phoenix took a large connect-option
// bag; EventSource only meaningfully honours credentialed requests.
export interface SocketOptions {
  withCredentials?: boolean;
}

// The multiplexed SSE envelope the backend emits. `topic` is optional:
//   - present -> the payload is delivered straight to that Phoenix topic,
//     firing `event` handlers (used by chain/address/token-scoped pushes
//     and by the component-test harness).
//   - absent  -> the backend hub channel in `event` is mapped to a
//     Blockscout-style (topic, event) pair via TRANSLATIONS below.
interface Envelope {
  event: string;
  chain?: string;
  data?: Payload;
  topic?: string;
}

interface Translation {
  topic: string;
  event: string;
  transform?: (data: Payload, chain?: string) => Payload;
}

// The single place that maps the backend's hub-channel broadcasts to the
// Blockscout-style Phoenix (topic, event) pairs the UI subscribes to.
// Today the indexer broadcasts only "blocks" (luxfi/indexer
// evm/indexer.go `BroadcastBlock`). Extend here as the backend grows new
// GLOBAL broadcast types; SCOPED events (addresses:*, tokens:*, …) arrive
// with an explicit `topic` and need no entry.
const TRANSLATIONS: Record<string, Array<Translation>> = {
  blocks: [
    { topic: 'blocks:new_block', event: 'new_block', transform: (block) => ({ block }) },
  ],
};

// Normalize any realtime URL the app hands us into the backend's SSE
// endpoint. Callers pass a Phoenix-style URL (getSocketUrl appends
// `/socket/v2`, the multichain-stats API appends `/socket`, the test
// harness passes `ws://host:port`); all collapse to one shape here so the
// transport has exactly one way to reach the server.
function toSSEUrl(raw: string): string {
  let u = raw.replace(/^wss:/i, 'https:').replace(/^ws:/i, 'http:');
  u = u.replace(/\/+$/, '');
  u = u.replace(/\/socket(?:\/v\d+)?(?:\/websocket)?$/i, '');
  return `${ u }/v1/base/realtime`;
}

// Push mirrors the chainable `channel.join().receive('ok', …).receive('error', …)`
// shape. SSE has no per-topic handshake, so a join resolves 'ok' as soon
// as the stream is open; it never resolves 'error' (transport errors are
// surfaced at the socket level instead).
class Push {
  private handlers: Partial<Record<PushStatus, Array<(resp?: Payload) => void>>> = {};
  private status: PushStatus | undefined;
  private response: Payload;

  receive(status: PushStatus, callback: (resp?: Payload) => void): this {
    if (this.status === status) {
      callback(this.response);
      return this;
    }
    const list = this.handlers[status] ?? [];
    list.push(callback);
    this.handlers[status] = list;
    return this;
  }

  resolve(status: PushStatus, response?: Payload) {
    if (this.status !== undefined) {
      return;
    }
    this.status = status;
    this.response = response;
    this.handlers[status]?.forEach((cb) => cb(response));
  }
}

export class Channel {
  readonly topic: string;
  private socket: Socket;
  private handlers = new Map<string, Map<number, EventHandler>>();
  private refSeq = 0;
  private joinPush: Push | undefined;
  private joined = false;

  constructor(topic: string, socket: Socket) {
    this.topic = topic;
    this.socket = socket;
  }

  join(): Push {
    if (!this.joinPush) {
      this.joinPush = new Push();
      this.joined = false;
    }
    if (this.socket.isOpen()) {
      // Already streaming — resolve after the synchronous `.receive(...)`
      // chain has registered its callbacks.
      queueMicrotask(() => this.resolveJoin());
    }
    // Otherwise Socket fires resolveJoin() via notifyOpen() on open.
    return this.joinPush;
  }

  leave(): Push {
    this.handlers.clear();
    this.joinPush = undefined;
    this.joined = false;
    this.socket.removeChannel(this.topic);
    const push = new Push();
    queueMicrotask(() => push.resolve('ok', {}));
    return push;
  }

  on(event: string, callback: EventHandler): number {
    const ref = ++this.refSeq;
    let map = this.handlers.get(event);
    if (!map) {
      map = new Map();
      this.handlers.set(event, map);
    }
    map.set(ref, callback);
    return ref;
  }

  off(event: string, ref?: number) {
    const map = this.handlers.get(event);
    if (!map) {
      return;
    }
    if (ref === undefined) {
      this.handlers.delete(event);
      return;
    }
    map.delete(ref);
    if (map.size === 0) {
      this.handlers.delete(event);
    }
  }

  // Internal — deliver an inbound event to every handler registered for it.
  receive(event: string, payload?: Payload) {
    this.handlers.get(event)?.forEach((cb) => cb(payload));
  }

  // Internal — the stream (re)opened; complete a pending join exactly once.
  notifyOpen() {
    this.resolveJoin();
  }

  private resolveJoin() {
    if (this.joined || !this.joinPush) {
      return;
    }
    this.joined = true;
    this.joinPush.resolve('ok', {});
  }
}

export class Socket {
  private url: string;
  private withCredentials: boolean;
  private es: EventSource | undefined;
  private channels = new Map<string, Channel>();
  private stateHandlers = new Map<MessageRef, { kind: StateKind; cb: StateHandler }>();
  private refSeq = 0;

  constructor(url: string, options?: SocketOptions) {
    this.url = toSSEUrl(url);
    this.withCredentials = options?.withCredentials ?? false;
  }

  connect() {
    if (this.es || typeof EventSource === 'undefined') {
      return;
    }
    const es = new EventSource(this.url, { withCredentials: this.withCredentials });
    this.es = es;

    const handleOpen = () => {
      this.fire('open');
      this.channels.forEach((ch) => ch.notifyOpen());
    };

    es.onopen = handleOpen;
    // The backend sends an initial typed `CONNECT` frame; treat it as an
    // open acknowledgement too (covers proxies that swallow onopen).
    es.addEventListener('CONNECT', handleOpen);
    es.onmessage = (event: MessageEvent) => this.dispatch(event.data);
    es.onerror = () => {
      // EventSource auto-reconnects while readyState === CONNECTING. Surface
      // the error to consumers (matches Phoenix onError/onClose semantics);
      // a healthy endpoint never reaches here under normal operation, so the
      // "Live updates" alert stays cleared.
      this.fire('error');
      if (es.readyState === es.CLOSED) {
        this.fire('close');
      }
    };
  }

  disconnect(callback?: () => void) {
    if (this.es) {
      this.es.close();
      this.es = undefined;
    }
    this.channels.clear();
    callback?.();
  }

  channel(topic: string): Channel {
    let ch = this.channels.get(topic);
    if (!ch) {
      ch = new Channel(topic, this);
      this.channels.set(topic, ch);
    }
    return ch;
  }

  onOpen(callback: StateHandler): MessageRef {
    return this.addState('open', callback);
  }

  onClose(callback: StateHandler): MessageRef {
    return this.addState('close', callback);
  }

  onError(callback: StateHandler): MessageRef {
    return this.addState('error', callback);
  }

  off(refs: Array<MessageRef>) {
    refs.forEach((ref) => this.stateHandlers.delete(ref));
  }

  // Internal — true once the underlying stream is open.
  isOpen() {
    return this.es !== undefined && this.es.readyState === this.es.OPEN;
  }

  // Internal — drop a channel once its last subscriber leaves.
  removeChannel(topic: string) {
    this.channels.delete(topic);
  }

  private addState(kind: StateKind, cb: StateHandler): MessageRef {
    const ref = String(++this.refSeq);
    this.stateHandlers.set(ref, { kind, cb });
    return ref;
  }

  private fire(kind: StateKind) {
    this.stateHandlers.forEach((handler) => {
      if (handler.kind === kind) {
        handler.cb();
      }
    });
  }

  private dispatch(raw: string) {
    let envelope: Envelope;
    try {
      envelope = JSON.parse(raw) as Envelope;
    } catch {
      return;
    }
    if (!envelope || typeof envelope.event !== 'string') {
      return;
    }

    if (envelope.topic) {
      this.channels.get(envelope.topic)?.receive(envelope.event, envelope.data);
      return;
    }

    const routes = TRANSLATIONS[envelope.event];
    if (!routes) {
      return;
    }
    for (const route of routes) {
      const ch = this.channels.get(route.topic);
      if (!ch) {
        continue;
      }
      ch.receive(route.event, route.transform ? route.transform(envelope.data, envelope.chain) : envelope.data);
    }
  }
}
