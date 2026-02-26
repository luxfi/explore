// React Query hook for A-chain AI models.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { AIModel } from './types';

import { fetchModels } from './client';

const MODELS_STALE_TIME_MS = 60_000;
const MODELS_QUERY_KEY = 'achain:models' as const;
const EMPTY_MODELS: ReadonlyArray<AIModel> = [];

export function useModels() {
  const query = useQuery({
    queryKey: [ MODELS_QUERY_KEY ],
    queryFn: fetchModels,
    staleTime: MODELS_STALE_TIME_MS,
  });

  const models = React.useMemo(
    () => query.data ?? EMPTY_MODELS,
    [ query.data ],
  );

  return {
    models,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
