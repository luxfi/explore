// Validator counts across every network in the registry, not just the one this
// explorer is pointed at.
//
// Lux, Hanzo, Zoo and Pars are each a sovereign L1 with its OWN P-Chain and its
// own validator set, so "how many validators" is a sum over chains and there is
// one read per chain. Chains with no publicly reachable node (SPC, Osage — see
// ChainEntry.nodeApiUrl) cannot be read at all, and are reported as unknown
// rather than folded in as zero.
//
// Stake is deliberately NOT summed: each chain bonds its own currency, so
// adding nLUX to nZOO would produce a number that means nothing.

import { useQueries } from '@tanstack/react-query';
import React from 'react';

import type { PChainValidator } from './types';

import { CHAINS, getCurrentChain } from 'configs/app/chainRegistry';

const STALE_TIME_MS = 60_000;
const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';

export interface NetworkValidators {
  readonly name: string;
  readonly chainId: number;

  /** Undefined when the chain did not answer — never 0 standing in for it. */
  readonly validatorCount: number | undefined;
  readonly isLoading: boolean;

  /**
   * Why the count is undefined. 'unavailable' = no publicly reachable node, so
   * it was never asked; 'unknown' = it was asked and did not answer. Callers
   * render the difference, because one is a deployment fact and the other is an
   * outage.
   */
  readonly status: 'live' | 'unknown' | 'unavailable';
}

async function fetchCount(chainName: string): Promise<number> {
  const res = await fetch(`/v1/pchain?chain=${ encodeURIComponent(chainName) }`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'platform.getCurrentValidators',
      params: { netID: PRIMARY_NETWORK_ID },
      id: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`P-chain proxy returned ${ res.status } for ${ chainName }`);
  }

  const json = await res.json() as { result?: { validators?: ReadonlyArray<PChainValidator> } };
  const validators = json.result?.validators;
  if (!validators) {
    throw new Error(`${ chainName } did not return a validator set`);
  }
  return validators.length;
}

export function useNetworkValidators() {
  // Same network as this deployment: a mainnet explorer must not count testnet
  // validators.
  const { all, readable } = React.useMemo(() => {
    const { network } = getCurrentChain();
    const chains = CHAINS.filter((c) => c.network === network);
    return { all: chains, readable: chains.filter((c) => c.nodeApiUrl) };
  }, []);

  const results = useQueries({
    queries: readable.map((chain) => ({
      queryKey: [ 'pchain:validatorCount', chain.name ],
      queryFn: () => fetchCount(chain.name),
      staleTime: STALE_TIME_MS,
      retry: 1,
    })),
  });

  // Every chain is listed, including the ones that cannot be read: a chain
  // missing from the list would read as a chain with no validators.
  const networks: ReadonlyArray<NetworkValidators> = all.map((chain) => {
    const i = readable.indexOf(chain);
    if (i < 0) {
      return { name: chain.name, chainId: chain.chainId, validatorCount: undefined, isLoading: false, status: 'unavailable' };
    }
    const result = results[i];
    return {
      name: chain.name,
      chainId: chain.chainId,
      validatorCount: result.data,
      isLoading: result.isLoading,
      status: result.data !== undefined ? 'live' : 'unknown',
    };
  });

  const answered = networks.filter((n) => n.validatorCount !== undefined);

  return {
    networks,
    total: answered.reduce((sum, n) => sum + (n.validatorCount ?? 0), 0),

    /** How many of the queried chains answered — the total means little without it. */
    answeredCount: answered.length,
    queriedCount: readable.length,

    /** A partial total is still a real number, but zero answers is not a zero. */
    isKnown: answered.length > 0,
    isLoading: results.some((r) => r.isLoading),
  };
}
