// @vitest-environment jsdom

// The P-Chain hooks read GET /v1/node/p-chain?op=<op> (the typed ops API) and
// only where a P-Chain secures this chain. Hanzo has none, so its explorer sends
// nothing; which hosts have one is pinned in configs/app/chainRegistry.spec.ts.

import type * as ChainRegistry from 'configs/app/chainRegistry';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor, wrapper } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';

const host = vi.hoisted(() => ({ pChain: true }));

vi.mock('configs/app/chainRegistry', async(importOriginal) => ({
  ...(await importOriginal<typeof ChainRegistry>()),
  getPChain: () => host.pChain ? { url: 'https://api.lux.network', name: 'Lux primary network', symbol: 'LUX' } : undefined,
}));

import type { PChainValidator } from '.';
import { useBlockchains, useChainHeights, useCurrentValidators } from '.';

const HOOKS = Object.entries({ useBlockchains, useChainHeights, useCurrentValidators });

function nodeCalls(): Array<[ string, RequestInit | undefined ]> {
  return fetchMock.mock.calls
    .map(([ input, init ]) => [ String(input), init ] as [ string, RequestInit | undefined ])
    .filter(([ url ]) => url.startsWith('/v1/node/'));
}

const validator = (nodeID: string, delegatorCount: string, delegatorWeight: string) => ({
  txID: 'tx', startTime: '0', endTime: '1797088011', weight: '500000000000000000', nodeID,
  delegationFee: '2.0000', uptime: '99.9', delegatorCount, delegatorWeight,
});

describe('P-Chain hooks', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ validators: [], blockchains: [], height: '0' }));
  });

  it.each(HOOKS)('%s sends nothing where no P-Chain secures the chain', async(_, hook) => {
    host.pChain = false;
    renderHook(() => hook(), { wrapper });
    await flushPromises();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(HOOKS)('%s reads the P-Chain with a typed GET, never JSON-RPC', async(_, hook) => {
    host.pChain = true;
    renderHook(() => hook(), { wrapper });
    await waitFor(() => expect(nodeCalls()).not.toHaveLength(0));
    for (const [ url, init ] of nodeCalls()) {
      expect(url).toMatch(/^\/v1\/node\/p-chain\?op=(validators|blockchains|height)(&|$)/);
      expect(init?.method ?? 'GET').toBe('GET');
      expect(init?.body).toBeUndefined();
    }
  });

  it('reads a P-Chain at genesis as height 0, not as unknown', async() => {
    host.pChain = true;
    fetchMock.mockResponse((req) => Promise.resolve(req.url.includes('p-chain') ?
      JSON.stringify({ height: '0' }) :
      JSON.stringify({ result: '0x10' })));
    const { result } = renderHook(() => useChainHeights(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.pChainHeight).toBe(0);
  });

  it('fetches delegator records for exactly the validators that have delegators', async() => {
    host.pChain = true;
    const a = 'NodeID-DwsrqSkPoE3pXWrUt9nkJ5yBycwRQ246X';
    const b = 'NodeID-8mY2fhUehN27v3LCU84BnnKEoeRfd2weC';
    const delegator = { txID: 'd', startTime: '0', endTime: '1', weight: '25000000000', nodeID: b };
    fetchMock.mockResponse((req) => Promise.resolve(JSON.stringify(req.url.includes('nodeIDs') ?
      { validators: [ { ...validator(b, '1', '25000000000'), delegators: [ delegator ] } ] } :
      { validators: [ validator(a, '0', '0'), validator(b, '1', '25000000000') ] })));

    const { result } = renderHook(() => useCurrentValidators(), { wrapper });
    await waitFor(() => expect(result.current.isKnown).toBe(true));

    expect(nodeCalls().map(([ url ]) => url)).toEqual([
      '/v1/node/p-chain?op=validators',
      `/v1/node/p-chain?op=validators&nodeIDs=${ b }`,
    ]);
    expect(result.current.validators.find((v: PChainValidator) => v.nodeID === b)?.delegators).toEqual([ delegator ]);
    expect(result.current.stats.delegatorCount).toBe(1);
    expect(result.current.stats.totalDelegatedStake).toBe(BigInt('25000000000'));
    expect(result.current.stats.totalStake).toBe(BigInt('1000000025000000000'));
  });
});
