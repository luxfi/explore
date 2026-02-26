// React Query hook for A-chain AI attestations.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { AIAttestation } from './types';

import { fetchAttestations } from './client';

const ATTESTATIONS_STALE_TIME_MS = 30_000;
const ATTESTATIONS_QUERY_KEY = 'achain:attestations' as const;
const EMPTY_ATTESTATIONS: ReadonlyArray<AIAttestation> = [];

export function useAttestations() {
  const query = useQuery({
    queryKey: [ ATTESTATIONS_QUERY_KEY ],
    queryFn: fetchAttestations,
    staleTime: ATTESTATIONS_STALE_TIME_MS,
  });

  const attestations = React.useMemo(
    () => query.data ?? EMPTY_ATTESTATIONS,
    [ query.data ],
  );

  return {
    attestations,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
