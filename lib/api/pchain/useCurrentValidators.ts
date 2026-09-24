// The P-Chain's current validators and their aggregate statistics:
// GET /v1/chain/P/ops/validators. The list carries each validator's
// delegatorCount and delegatorWeight; the delegator records themselves come
// only from a read naming that one validator, so those are fetched for the
// validators that have delegators, and for no others.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type {
  GetCurrentValidatorsResponse,
  PChainValidator,
  ValidatorStats,
} from './types';

import { getPChain } from 'configs/app/chainRegistry';

import { read } from './read';

const VALIDATORS_STALE_TIME_MS = 60_000;
const VALIDATORS_QUERY_KEY = 'pchain:currentValidators' as const;
const ZERO = BigInt(0);

function computeValidatorStats(
  validators: ReadonlyArray<PChainValidator>,
): ValidatorStats {
  let totalStake = ZERO;
  let totalDelegatedStake = ZERO;
  let connectedCount = 0;
  let delegatorCount = 0;
  let uptimeSum = 0;

  for (const v of validators) {
    const delegated = BigInt(v.delegatorWeight ?? '0');
    totalStake += BigInt(v.weight) + delegated;
    totalDelegatedStake += delegated;
    delegatorCount += Number(v.delegatorCount ?? '0');

    // connected field may be absent in some node configurations;
    // infer connectivity from uptime > 0 when missing
    if (v.connected ?? (parseFloat(v.uptime) > 0)) {
      connectedCount += 1;
    }

    uptimeSum += parseFloat(v.uptime);
  }

  // uptime values from the API are already in percentage (0–100); no scaling needed
  const averageUptime = validators.length > 0 ?
    uptimeSum / validators.length :
    0;

  return {
    totalStake,
    validatorCount: validators.length,
    connectedCount,
    delegatorCount,
    totalDelegatedStake,
    averageUptime,
  };
}

export interface UseCurrentValidatorsResult {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly stats: ValidatorStats;
}

// The node lists delegators only when one validator is named (service.go:
// `numNodeIDs == 1`), so each validator with delegators is read on its own.
async function withDelegators(v: PChainValidator): Promise<PChainValidator> {
  if (Number(v.delegatorCount ?? '0') === 0) {
    return v;
  }
  const { validators } = await read<GetCurrentValidatorsResponse>('validators', { nodeIDs: v.nodeID });
  return { ...v, delegators: validators[0]?.delegators ?? [] };
}

async function fetchCurrentValidators(): Promise<UseCurrentValidatorsResult> {
  const listed = (await read<GetCurrentValidatorsResponse>('validators')).validators ?? [];
  const validators = await Promise.all(listed.map(withDelegators));
  return { validators, stats: computeValidatorStats(validators) };
}

export function useCurrentValidators() {
  const query = useQuery({
    queryKey: [ VALIDATORS_QUERY_KEY ],
    queryFn: fetchCurrentValidators,
    staleTime: VALIDATORS_STALE_TIME_MS,
    retry: 2,
    enabled: Boolean(getPChain()),
  });

  const validators = React.useMemo(
    () => query.data?.validators ?? [],
    [ query.data?.validators ],
  );

  const stats = React.useMemo(
    () => query.data?.stats ?? {
      totalStake: ZERO,
      validatorCount: 0,
      connectedCount: 0,
      delegatorCount: 0,
      totalDelegatedStake: ZERO,
      averageUptime: 0,
    },
    [ query.data?.stats ],
  );

  return {
    validators,
    stats,
    // Did the read actually answer? A failed read leaves `stats` zeroed, and a
    // zeroed stat is indistinguishable from a chain with no validators — which
    // is how this explorer came to print "0 validators / 0 LUX staked" about a
    // network running five with 2,500,000,000 LUX bonded. Every surface asks
    // this before rendering a validator figure, and renders an em dash when it
    // is false. Deciding it HERE means the four surfaces cannot drift apart.
    isKnown: !query.isError && stats.validatorCount > 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
