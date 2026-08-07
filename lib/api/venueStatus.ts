// How much we actually know about a trading venue. Every word already carries
// this meaning elsewhere in the codebase (lib/api/pchain/useNetworkValidators,
// lib/api/cchain/useFeeSplit) and keeps it here:
//
//   'unavailable' — the indexer never answered, so we learned nothing at all.
//   'unknown'     — it answered, but the chain head is unreadable, so we cannot
//                   judge how recent its newest trade is.
//   'empty'       — it answered and has never recorded a single trade.
//   'idle'        — it has history, but nothing inside the recent window.
//   'live'        — its newest trade is inside the recent window.
//
// There is deliberately no 'stale'. Telling a stalled indexer apart from a
// quiet venue needs the indexer's own head block, which this API does not
// serve, so claiming that distinction would be a guess.
export type VenueStatus = 'live' | 'idle' | 'empty' | 'unavailable' | 'unknown';

// ~30 minutes at the ~9s cadence C-Chain actually runs.
export const RECENT_WINDOW_BLOCKS = 200;

export function deriveVenueStatus(
  latestBlock: number | null,
  headBlock: number | null,
  reachable: boolean,
): VenueStatus {
  if (!reachable) {
    return 'unavailable';
  }

  if (latestBlock === null) {
    return 'empty';
  }

  if (headBlock === null) {
    return 'unknown';
  }

  return headBlock - latestBlock <= RECENT_WINDOW_BLOCKS ? 'live' : 'idle';
}
