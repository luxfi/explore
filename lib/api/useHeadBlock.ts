import { useQuery } from '@tanstack/react-query';

import { getApiBase } from 'lib/api/subgraph';

const STATS_PATH = '/v1/stats';
const POLL_INTERVAL_MS = 30_000;

// The chain head, read straight off the API host the same way the subgraphs
// are, so it resolves identically in dev and in production. `null` means we
// could not read it, and callers must report that rather than guess a height.
async function fetchHeadBlock(): Promise<number | null> {
  const base = getApiBase();

  if (!base) {
    return null;
  }

  try {
    const res = await fetch(base + STATS_PATH);

    if (!res.ok) {
      return null;
    }

    const json = await res.json() as { head_block?: number } | null;
    return typeof json?.head_block === 'number' ? json.head_block : null;
  } catch {
    return null;
  }
}

export function useHeadBlock(): number | null {
  const { data } = useQuery({
    queryKey: [ 'headBlock', getApiBase() ],
    queryFn: fetchHeadBlock,
    refetchInterval: POLL_INTERVAL_MS,
  });

  return data ?? null;
}
