// React Query hook for A-chain AI compute providers.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { AIProvider } from './types';

import { fetchProviders } from './client';

const PROVIDERS_STALE_TIME_MS = 60_000;
const PROVIDERS_QUERY_KEY = 'achain:providers' as const;
const EMPTY_PROVIDERS: ReadonlyArray<AIProvider> = [];

export function useProviders() {
  const query = useQuery({
    queryKey: [ PROVIDERS_QUERY_KEY ],
    queryFn: fetchProviders,
    staleTime: PROVIDERS_STALE_TIME_MS,
  });

  const providers = React.useMemo(
    () => query.data ?? EMPTY_PROVIDERS,
    [ query.data ],
  );

  return {
    providers,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
