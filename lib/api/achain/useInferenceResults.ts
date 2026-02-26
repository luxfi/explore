// React Query hook for A-chain AI inference results.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { AIInferenceResult } from './types';

import { fetchInferenceResults } from './client';

const INFERENCE_STALE_TIME_MS = 30_000;
const INFERENCE_QUERY_KEY = 'achain:inferenceResults' as const;
const EMPTY_RESULTS: ReadonlyArray<AIInferenceResult> = [];

export function useInferenceResults() {
  const query = useQuery({
    queryKey: [ INFERENCE_QUERY_KEY ],
    queryFn: fetchInferenceResults,
    staleTime: INFERENCE_STALE_TIME_MS,
  });

  const results = React.useMemo(
    () => query.data ?? EMPTY_RESULTS,
    [ query.data ],
  );

  return {
    results,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
