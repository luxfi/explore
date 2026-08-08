// What is true about ONE primary-network chain, read from that chain.
//
// Every /chains/<slug> page used to print the same four numbers — the
// network-wide validator count, total stake, chain count and threshold — so
// Q-Chain and Z-Chain and K-Chain were the same page with the title swapped.
// None of it was about the chain you opened.
//
// Three facts are per-chain and real:
//   * the blockchain ID, from the P-Chain registry — unique, and the thing that
//     actually distinguishes one chain from another
//   * whether the node has bootstrapped it, from info.isBootstrapped, which the
//     gateway routes for every chain
//   * its head, from its own RPC, in whatever dialect it speaks
//
// The last one is only available where the gateway routes the chain. Today that
// is P, X and C on all three networks; the rest are registered and bootstrapped
// but answer 404 from the browser's only reachable origin. That is reported as
// `unreachable`, never as a height of zero — a chain whose head we cannot read and
// a chain sitting at genesis are different states and must not render alike.

import { useQuery } from '@tanstack/react-query';

import type { PrimaryVm } from 'configs/app/primaryChains';

const STALE_MS = 15_000;

export type Head =
  { readonly kind: 'height'; readonly height: number } |
  { readonly kind: 'unreachable' } |
  { readonly kind: 'unknown' };

export interface ChainFacts {
  readonly blockchainId: string | null;
  readonly bootstrapped: boolean | null;
  readonly head: Head;
  readonly chainId: number | null;
}

async function rpc(endpoint: string, method: string, params: unknown): Promise<unknown> {
  const res = await fetch(`/v1/node/${ endpoint }`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) {
    return null;
  }
  const body = await res.json() as { result?: unknown };
  return body.result ?? null;
}

// Each dialect names its head differently, and asking the wrong one gets a
// "can't find service" error rather than an answer — X speaks xvm, not avm, and
// not platform.
async function readHead(vm: PrimaryVm): Promise<Head> {
  try {
    if (vm.view === 'evm' || vm.view === 'dex') {
      const hex = await rpc(vm.slug, 'eth_blockNumber', []) as string | null;
      return hex ? { kind: 'height', height: parseInt(hex, 16) } : { kind: 'unreachable' };
    }
    const method = vm.view === 'platform' ? 'platform.getHeight' : 'xvm.getHeight';
    const out = await rpc(vm.slug, method, {}) as { height?: string } | null;
    return out?.height !== undefined ?
      { kind: 'height', height: Number(out.height) } :
      { kind: 'unreachable' };
  } catch {
    return { kind: 'unreachable' };
  }
}

async function readChainId(vm: PrimaryVm): Promise<number | null> {
  if (vm.view !== 'evm' && vm.view !== 'dex') {
    return null;
  }
  const hex = await rpc(vm.slug, 'eth_chainId', []) as string | null;
  return hex ? parseInt(hex, 16) : null;
}

export function useChainFacts(vm: PrimaryVm | undefined, blockchainId: string | null): {
  readonly facts: ChainFacts;
  readonly isLoading: boolean;
} {
  const query = useQuery({
    queryKey: [ 'chain:facts', vm?.slug ],
    enabled: Boolean(vm),
    staleTime: STALE_MS,
    refetchInterval: STALE_MS,
    queryFn: async(): Promise<Omit<ChainFacts, 'blockchainId'>> => {
      if (!vm) {
        return { bootstrapped: null, head: { kind: 'unknown' }, chainId: null };
      }
      const alias = vm.slug.charAt(0).toUpperCase();
      const [ boot, head, chainId ] = await Promise.all([
        rpc('info', 'info.isBootstrapped', { chain: alias }) as Promise<{ isBootstrapped?: boolean } | null>,
        readHead(vm),
        readChainId(vm),
      ]);
      return { bootstrapped: boot?.isBootstrapped ?? null, head, chainId };
    },
  });

  return {
    facts: {
      blockchainId,
      bootstrapped: query.data?.bootstrapped ?? null,
      head: query.data?.head ?? { kind: 'unknown' },
      chainId: query.data?.chainId ?? vm?.chainId ?? null,
    },
    isLoading: query.isLoading,
  };
}
