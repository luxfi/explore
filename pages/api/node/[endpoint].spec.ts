// The node proxy forwards a P-Chain read to the P-Chain that secures the
// requesting host's chain, and to nothing else: Zoo reads Lux's, never its own
// node's; Hanzo, which no P-Chain secures, is refused. Every op and parameter
// comes from a fixed table.

import type { NextApiRequest, NextApiResponse } from 'next';

import { beforeEach, describe, expect, it } from 'vitest';

import handler from './[endpoint]';

interface Answer {
  status?: number;
  body?: unknown;
}

async function call(host: string, query: Record<string, string>, method = 'GET'): Promise<Answer> {
  const answer: Answer = {};
  const res = {
    status(code: number) {
      answer.status = code;
      return res;
    },
    json(body: unknown) {
      answer.body = body;
      return res;
    },
  };
  const req = { method, query: { endpoint: 'p-chain', ...query }, headers: { host }, body: undefined };
  await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
  return answer;
}

function forwarded(): Array<string> {
  return fetchMock.mock.calls.map(([ input ]) => String(input));
}

describe('GET /v1/node/p-chain', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ height: '0' }));
  });

  it.each([
    [ 'explore.lux.network', 'https://api.lux.network' ],
    [ 'explore.zoo.network', 'https://api.lux.network' ],
    [ 'explore.zoo.ngo', 'https://api.lux.network' ],
    [ 'explore.lux-test.network', 'https://api.lux-test.network' ],
    [ 'explore.zoo-test.network', 'https://api.lux-test.network' ],
  ])('%s reads the P-Chain at %s', async(host, origin) => {
    const answer = await call(host, { op: 'height' });
    expect(answer).toEqual({ status: 200, body: { height: '0' } });
    expect(forwarded()).toEqual([ `${ origin }/v1/chain/P/ops/height` ]);
  });

  it('never reads a Zoo node\'s own P-Chain', async() => {
    await call('explore.zoo.network', { op: 'validators' });
    expect(forwarded().join(' ')).not.toContain('zoo');
  });

  it.each([ 'explore.hanzo.network', 'explore.hanzo.ai' ])('%s has no P-Chain and forwards nothing', async(host) => {
    const answer = await call(host, { op: 'validators' });
    expect(answer.status).toBe(404);
    expect(forwarded()).toEqual([]);
  });

  it('forwards one NodeID and drops every parameter the op does not take', async() => {
    const nodeID = 'NodeID-DwsrqSkPoE3pXWrUt9nkJ5yBycwRQ246X';
    await call('explore.lux.network', { op: 'validators', nodeIDs: nodeID, netID: 'x', url: 'https://evil.example' });
    expect(forwarded()).toEqual([ `https://api.lux.network/v1/chain/P/ops/validators?nodeIDs=${ nodeID }` ]);
  });

  it.each([ 'NodeID-../../info', 'https://evil.example', 'NodeID-0OIl' ])('refuses nodeIDs=%s', async(nodeIDs) => {
    const answer = await call('explore.lux.network', { op: 'validators', nodeIDs });
    expect(answer.status).toBe(400);
    expect(forwarded()).toEqual([]);
  });

  it.each([ 'balance', 'tx', '../info', '' ])('refuses op=%s', async(op) => {
    const answer = await call('explore.lux.network', { op });
    expect(answer.status).toBe(404);
    expect(forwarded()).toEqual([]);
  });

  it('refuses JSON-RPC: the P-Chain answers GETs only', async() => {
    const answer = await call('explore.lux.network', { op: 'height' }, 'POST');
    expect(answer.status).toBe(405);
    expect(forwarded()).toEqual([]);
  });

  it('passes the node\'s status and problem document through', async() => {
    fetchMock.mockResponse(JSON.stringify({ type: 'about:blank', status: 503, detail: 'bootstrapping' }), { status: 503 });
    const answer = await call('explore.lux.network', { op: 'height' });
    expect(answer).toEqual({ status: 503, body: { type: 'about:blank', status: 503, detail: 'bootstrapping' } });
  });

  it('reports a gateway page that is not JSON as unreadable', async() => {
    fetchMock.mockResponse('404 page not found', { status: 404 });
    const answer = await call('explore.lux.network', { op: 'height' });
    expect(answer.status).toBe(502);
  });
});
