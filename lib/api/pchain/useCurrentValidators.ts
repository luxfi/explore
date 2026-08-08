// React Query hook for platform.getCurrentValidators.
// Returns the validator list and aggregated network statistics.
// Uses the server-side /v1/node/p-chain proxy to bypass CORS.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type {
  PChainValidator,
  ValidatorStats,
} from './types';

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
    totalStake += BigInt(v.stakeAmount ?? v.weight);

    // connected field may be absent in some node configurations;
    // infer connectivity from uptime > 0 when missing
    if (v.connected ?? (parseFloat(v.uptime) > 0)) {
      connectedCount += 1;
    }

    uptimeSum += parseFloat(v.uptime);

    if (v.delegators) {
      delegatorCount += v.delegators.length;
      for (const d of v.delegators) {
        totalDelegatedStake += BigInt(d.stakeAmount);
      }
    }
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

async function fetchCurrentValidators(): Promise<UseCurrentValidatorsResult> {
  const res = await fetch('/v1/node/p-chain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'platform.getCurrentValidators',
      params: { netID: '11111111111111111111111111111111LpoYY' },
      id: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`P-chain proxy returned ${ res.status }`);
  }

  const json = await res.json() as { result?: { validators?: ReadonlyArray<PChainValidator> } };
  const validators = json.result?.validators ?? [];
  const stats = computeValidatorStats(validators);

  return { validators, stats };
}

export function useCurrentValidators() {
  const query = useQuery({
    queryKey: [ VALIDATORS_QUERY_KEY ],
    queryFn: fetchCurrentValidators,
    staleTime: VALIDATORS_STALE_TIME_MS,
    retry: 2,
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
