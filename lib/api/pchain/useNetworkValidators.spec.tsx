// @vitest-environment jsdom

// Pins the honesty contract of the cross-network validator count.
//
// The failure this guards against is arithmetic, not visual: a chain that
// cannot be read contributing 0 to a sum is indistinguishable from a chain
// running no validators, and the explorer has already shipped that bug once
// (see useCurrentValidators, "0 validators / 0 LUX staked" on a live network).

import type * as ReactQuery from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';

import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest/lib';

import { useNetworkValidators } from './useNetworkValidators';

vi.mock('@tanstack/react-query', async(importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQueries: vi.fn(),
}));

// Mirrors the mainnet registry: four chains carry a public node, SPC and Osage
// do not. Measured 2026-08-06 against api.{lux,zoo,hanzo,pars}.network/v1/bc/P.
vi.mock('configs/app/chainRegistry', () => ({
  getCurrentChain: () => ({ network: 'mainnet' }),
  CHAINS: [
    { name: 'C-Chain', chainId: 96369, network: 'mainnet', nodeApiUrl: 'https://api.lux.network' },
    { name: 'Zoo', chainId: 200200, network: 'mainnet', nodeApiUrl: 'https://api.zoo.network' },
    { name: 'Hanzo', chainId: 36963, network: 'mainnet', nodeApiUrl: 'https://api.hanzo.network' },
    { name: 'SPC', chainId: 36911, network: 'mainnet' },
    { name: 'Pars', chainId: 494949, network: 'mainnet', nodeApiUrl: 'https://api.pars.network' },
    { name: 'Osage', chainId: 1872, network: 'mainnet' },
    { name: 'C-Chain', chainId: 96368, network: 'testnet', nodeApiUrl: 'https://api.lux-test.network' },
  ],
}));

const mockUseQueries = useQueries as Mock<typeof useQueries>;

// renderHook comes from an untyped test helper, so the result is annotated here
// once rather than every call site having to assert it.
function withResults(results: Array<{ data?: number; isLoading?: boolean }>): ReturnType<typeof useNetworkValidators> {
  mockUseQueries.mockReturnValue(results.map((r) => ({ data: r.data, isLoading: r.isLoading ?? false })) as never);
  return renderHook(() => useNetworkValidators()).result.current as ReturnType<typeof useNetworkValidators>;
}

const ALL_FIVE = [ { data: 5 }, { data: 5 }, { data: 5 }, { data: 5 } ];

describe('useNetworkValidators', () => {
  it('queries only the chains that have a node, and only on this network', () => {
    withResults(ALL_FIVE);

    const queries = mockUseQueries.mock.calls.at(-1)?.[0].queries as Array<{ queryKey: Array<string> }>;
    // Four mainnet chains with a node — never SPC/Osage, never the testnet row.
    expect(queries.map((q) => q.queryKey[1])).toEqual([ 'C-Chain', 'Zoo', 'Hanzo', 'Pars' ]);
  });

  it('sums the validator sets of every L1, not just the primary network', () => {
    const result = withResults(ALL_FIVE);

    // Lux 5 + Zoo 5 + Hanzo 5 + Pars 5. The page showed 5 before this existed.
    expect(result.total).toBe(20);
    expect(result.isKnown).toBe(true);
    expect(result.answeredCount).toBe(4);
    expect(result.queriedCount).toBe(4);
  });

  it('lists a chain with no public node as unavailable rather than zero', () => {
    const byName = Object.fromEntries(withResults(ALL_FIVE).networks.map((n) => [ n.name, n ]));

    expect(byName.SPC.status).toBe('unavailable');
    expect(byName.SPC.validatorCount).toBeUndefined();
    expect(byName.Osage.status).toBe('unavailable');
    // Pars runs its own P-Chain and answers — it is not an absent chain.
    expect(byName.Pars).toMatchObject({ status: 'live', validatorCount: 5 });
  });

  it('separates a chain that did not answer from one that was never asked', () => {
    const byName = Object.fromEntries(
      withResults([ { data: 5 }, { data: undefined }, { data: 5 }, { data: 5 } ]).networks.map((n) => [ n.name, n ]),
    );

    expect(byName.Zoo.status).toBe('unknown');
    expect(byName.SPC.status).toBe('unavailable');
  });

  it('reports a partial total instead of pretending the missing chain has none', () => {
    const result = withResults([ { data: 5 }, { data: undefined }, { data: 5 }, { data: 5 } ]);

    expect(result.total).toBe(15);
    expect(result.answeredCount).toBe(3);
    expect(result.queriedCount).toBe(4);
    // The caller compares these two to decide whether to label the tile partial.
    expect(result.answeredCount).not.toBe(result.queriedCount);
  });

  it('is not known when nothing answered, so the caller renders a dash', () => {
    const result = withResults([ {}, {}, {}, {} ]);

    expect(result.isKnown).toBe(false);
    // 0 is what the sum degenerates to; isKnown is what stops it being shown.
    expect(result.total).toBe(0);
  });
});
