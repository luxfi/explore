import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Socket } from './sse';

// Controllable EventSource stand-in. Drives the adapter the way the Lux
// explorer backend would: open the stream, push `{event,chain,data}`
// envelopes, raise errors.
class FakeEventSource {
  static last: FakeEventSource | undefined;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSED = 2;

  url: string;
  withCredentials: boolean;
  readyState = 0;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  private listeners = new Map<string, Set<() => void>>();

  constructor(url: string, init?: { withCredentials?: boolean }) {
    this.url = url;
    this.withCredentials = init?.withCredentials ?? false;
    FakeEventSource.last = this;
  }

  addEventListener(type: string, cb: () => void) {
    const set = this.listeners.get(type) ?? new Set();
    set.add(cb);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, cb: () => void) {
    this.listeners.get(type)?.delete(cb);
  }

  close() {
    this.readyState = this.CLOSED;
  }

  // Test drivers ----------------------------------------------------------
  emitOpen() {
    this.readyState = this.OPEN;
    this.onopen?.();
    this.listeners.get('CONNECT')?.forEach((cb) => cb());
  }

  emitMessage(envelope: object) {
    this.onmessage?.({ data: JSON.stringify(envelope) });
  }

  emitError(closed = false) {
    if (closed) {
      this.readyState = this.CLOSED;
    }
    this.onerror?.();
  }
}

function lastEs(): FakeEventSource {
  if (!FakeEventSource.last) {
    throw new Error('EventSource was not constructed');
  }
  return FakeEventSource.last;
}

beforeEach(() => {
  FakeEventSource.last = undefined;
  vi.stubGlobal('EventSource', FakeEventSource);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SSE Socket — URL normalisation', () => {
  it('rewrites a Phoenix socket URL to the backend SSE endpoint', () => {
    new Socket('wss://api-explore.lux.network/socket/v2').connect();
    expect(lastEs().url).toBe('https://api-explore.lux.network/v1/base/realtime');
  });

  it('rewrites a bare ws host (test harness shape)', () => {
    new Socket('ws://localhost:3200').connect();
    expect(lastEs().url).toBe('http://localhost:3200/v1/base/realtime');
  });

  it('passes withCredentials through to EventSource', () => {
    new Socket('wss://api-explore.lux.network', { withCredentials: true }).connect();
    expect(lastEs().withCredentials).toBe(true);
  });
});

describe('SSE Socket — envelope routing', () => {
  it('maps the backend "blocks" broadcast onto blocks:new_block / new_block', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    const channel = socket.channel('blocks:new_block');
    const handler = vi.fn();
    channel.on('new_block', handler);

    lastEs().emitOpen();
    lastEs().emitMessage({ event: 'blocks', chain: 'cchain', data: { number: 42, hash: '0xabc' } });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ block: { number: 42, hash: '0xabc' } });
  });

  it('routes a topic-scoped envelope straight to that channel + event', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    const channel = socket.channel('addresses:0xabc');
    const handler = vi.fn();
    channel.on('token_transfer', handler);

    lastEs().emitOpen();
    const payload = { token_transfers: [ { tx_hash: '0xdead' } ] };
    lastEs().emitMessage({ event: 'token_transfer', topic: 'addresses:0xabc', data: payload });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(payload);
  });

  it('drops events with no matching channel or translation without throwing', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    lastEs().emitOpen();
    expect(() => lastEs().emitMessage({ event: 'nonexistent', data: {} })).not.toThrow();
  });

  it('stops delivering to a handler after off()', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    const channel = socket.channel('blocks:new_block');
    const handler = vi.fn();
    const ref = channel.on('new_block', handler);
    lastEs().emitOpen();

    channel.off('new_block', ref);
    lastEs().emitMessage({ event: 'blocks', data: { number: 1 } });

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('SSE Socket — channel join', () => {
  it('resolves join "ok" once the stream opens', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    const channel = socket.channel('blocks:new_block');
    const onOk = vi.fn();

    channel.join().receive('ok', onOk);
    expect(onOk).not.toHaveBeenCalled();

    lastEs().emitOpen();
    expect(onOk).toHaveBeenCalledTimes(1);
  });

  it('resolves join "ok" immediately when the stream is already open', async() => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    lastEs().emitOpen();

    const channel = socket.channel('blocks:new_block');
    const onOk = vi.fn();
    channel.join().receive('ok', onOk);

    await Promise.resolve();
    expect(onOk).toHaveBeenCalledTimes(1);
  });
});

describe('SSE Socket — connection state', () => {
  it('fires onError handlers when the stream errors', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    const onError = vi.fn();
    socket.onError(onError);

    lastEs().emitError();
    expect(onError).toHaveBeenCalled();
  });

  it('stops firing a state handler after off()', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    const onError = vi.fn();
    const ref = socket.onError(onError);

    socket.off([ ref ]);
    lastEs().emitError();
    expect(onError).not.toHaveBeenCalled();
  });

  it('closes the EventSource on disconnect', () => {
    const socket = new Socket('wss://api-explore.lux.network');
    socket.connect();
    const es = lastEs();
    socket.disconnect();
    expect(es.readyState).toBe(es.CLOSED);
  });
});
