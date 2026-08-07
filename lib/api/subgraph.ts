// One way to reach the chain subgraphs the explorer serves under
// `${config.apis.general.endpoint}/v1/graph/cchain/<name>/graphql`. The network
// is selected exactly like every other resource — by deployment, via
// NEXT_PUBLIC_API_HOST.
//
// `null` means the endpoint did not answer. That is NOT the same as an answer
// carrying no rows, and callers must keep the two apart: one is an outage, the
// other is a fact about the venue.

import config from 'configs/app';

export function getApiBase(): string | undefined {
  return config.apis.general?.endpoint;
}

export async function fetchSubgraph<T>(path: string, query: string): Promise<T | null> {
  const base = getApiBase();

  if (!base) {
    return null;
  }

  try {
    const res = await fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json() as { data?: T } | null;
    return json?.data ?? null;
  } catch {
    return null;
  }
}
