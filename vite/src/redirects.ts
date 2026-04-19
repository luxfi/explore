// Client-side redirect table. Port of nextjs/redirects.js.
//
// Next.js did these server-side via next.config.js `redirects`. The SPA does
// them in the router at mount time — first match wins. `:param` placeholders
// carry forward into the destination. Query params survive as-is.

export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

const OLD_UI_URLS: Array<Omit<Redirect, 'permanent'>> = [
  // ACCOUNT
  { source: '/account/tag_address', destination: '/account/tag-address' },
  { source: '/account/tag_address/new', destination: '/account/tag-address' },
  { source: '/account/tag_transaction', destination: '/account/tag-address?tab=tx' },
  { source: '/account/tag_transaction/new', destination: '/account/tag-address?tab=tx' },
  { source: '/account/watchlist_address/:id/edit', destination: '/account/watchlist' },
  { source: '/account/watchlist_address/new', destination: '/account/watchlist' },
  { source: '/account/api_key', destination: '/account/api-key' },
  { source: '/account/api_key/:id/edit', destination: '/account/api-key' },
  { source: '/account/api_key/new', destination: '/account/api-key' },
  { source: '/account/custom_abi', destination: '/account/custom-abi' },
  { source: '/account/custom_abi/:id/edit', destination: '/account/custom-abi' },
  { source: '/account/custom_abi/new', destination: '/account/custom-abi' },
  { source: '/account/public-tags-request', destination: '/public-tags/submit' },
  { source: '/account/rewards', destination: '/account/merits' },

  // TRANSACTIONS
  { source: '/pending-transactions', destination: '/txs?tab=pending' },
  { source: '/tx/:hash/internal-transactions', destination: '/tx/:hash?tab=internal' },
  { source: '/tx/:hash/logs', destination: '/tx/:hash?tab=logs' },
  { source: '/tx/:hash/raw-trace', destination: '/tx/:hash?tab=raw_trace' },
  { source: '/tx/:hash/state', destination: '/tx/:hash?tab=state' },
  { source: '/tx/:hash/token-transfers', destination: '/tx/:hash?tab=token_transfers' },

  // BLOCKS
  { source: '/blocks/:height', destination: '/block/:height' },
  { source: '/uncles', destination: '/blocks?tab=uncles' },
  { source: '/reorgs', destination: '/blocks?tab=reorgs' },
  { source: '/block/:height/transactions', destination: '/block/:height?tab=txs' },
  { source: '/block/:height/withdrawals', destination: '/block/:height?tab=withdrawals' },

  // ADDRESS
  { source: '/address/:hash/transactions', destination: '/address/:hash' },
  { source: '/address/:hash/token-transfers', destination: '/address/:hash?tab=token_transfers' },
  { source: '/address/:hash/tokens', destination: '/address/:hash?tab=tokens' },
  { source: '/address/:hash/internal-transactions', destination: '/address/:hash?tab=internal_txns' },
  { source: '/address/:hash/coin-balances', destination: '/address/:hash?tab=coin_balance_history' },
  { source: '/address/:hash/logs', destination: '/address/:hash?tab=logs' },
  { source: '/address/:hash/validations', destination: '/address/:hash?tab=blocks_validated' },
  { source: '/address/:hash/contracts', destination: '/address/:hash?tab=contract' },
  { source: '/address/:hash/read-contract', destination: '/address/:hash?tab=read_contract' },
  { source: '/address/:hash/read-proxy', destination: '/address/:hash?tab=read_proxy' },
  { source: '/address/:hash/write-contract', destination: '/address/:hash?tab=write_contract' },
  { source: '/address/:hash/write-proxy', destination: '/address/:hash?tab=write_proxy' },

  // TOKENS
  { source: '/bridged-tokens', destination: '/tokens?tab=bridged' },
  { source: '/bridged-tokens/:chain_name', destination: '/tokens?tab=bridged' },
  { source: '/token/:hash/token-transfers', destination: '/token/:hash?tab=token_transfers' },
  { source: '/token/:hash/token-holders', destination: '/token/:hash?tab=holders' },
  { source: '/token/:hash/inventory', destination: '/token/:hash?tab=inventory' },
  { source: '/token/:hash/instance/:id/token-transfers', destination: '/token/:hash/instance/:id' },
  { source: '/token/:hash/instance/:id/token-holders', destination: '/token/:hash/instance/:id?tab=holders' },
  { source: '/token/:hash/instance/:id/metadata', destination: '/token/:hash/instance/:id?tab=metadata' },
  { source: '/token/:hash/read-contract', destination: '/token/:hash?tab=read_contract' },
  { source: '/token/:hash/read-proxy', destination: '/token/:hash?tab=read_proxy' },
  { source: '/token/:hash/write-contract', destination: '/token/:hash?tab=write_contract' },
  { source: '/token/:hash/write-proxy', destination: '/token/:hash?tab=write_proxy' },

  // ROLLUPS
  { source: '/l2-txn-batches', destination: '/batches' },
  { source: '/zkevm-l2-txn-batches', destination: '/batches' },
  { source: '/l2-deposits', destination: '/deposits' },
  { source: '/l2-withdrawals', destination: '/withdrawals' },
  { source: '/l2-output-roots', destination: '/output-roots' },
];

const ETHERSCAN_URLS: Array<Omit<Redirect, 'permanent'>> = [
  { source: '/txsAA', destination: '/ops' },
  { source: '/blocks_forked', destination: '/blocks?tab=reorgs' },
  { source: '/contractsVerified', destination: '/verified-contracts' },
  { source: '/tokentxns', destination: '/token-transfers' },
  { source: '/nft/:hash/:id', destination: '/token/:hash/instance/:id' },
  { source: '/charts', destination: '/stats' },
  { source: '/name-lookup-search', destination: '/name-domains' },
  { source: '/txsExit', destination: '/withdrawals' },
  { source: '/txsEnqueued', destination: '/deposits' },
  { source: '/cc/txs', destination: '/txs?tab=cctx' },
];

const DEPRECATED_ROUTES: Array<Redirect> = [
  { source: '/graphiql', destination: '/api-docs?tab=graphql_api', permanent: true },
  { source: '/name-domains', destination: '/name-services', permanent: true },
  { source: '/name-domains/:name', destination: '/name-services/domains/:name', permanent: true },
];

export const redirects: Array<Redirect> = [
  ...OLD_UI_URLS.map((r) => ({ ...r, permanent: false })),
  ...ETHERSCAN_URLS.map((r) => ({ ...r, permanent: true })),
  ...DEPRECATED_ROUTES,
];

// Match a path against `:param` placeholders and substitute into destination.
// Returns the destination path+query, or null if no match.
export function matchRedirect(pathname: string): string | null {
  for (const r of redirects) {
    const params = matchPath(r.source, pathname);
    if (params) return substitute(r.destination, params);
  }
  return null;
}

function matchPath(source: string, pathname: string): Record<string, string> | null {
  const sParts = source.split('/').filter(Boolean);
  const pParts = pathname.split('/').filter(Boolean);
  if (sParts.length !== pParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < sParts.length; i++) {
    const s = sParts[i];
    const p = pParts[i];
    if (s.startsWith(':')) {
      params[s.slice(1)] = decodeURIComponent(p);
    } else if (s !== p) {
      return null;
    }
  }
  return params;
}

function substitute(dest: string, params: Record<string, string>): string {
  return dest.replace(/:([a-z_]+)/gi, (_, k) => params[k] ?? `:${ k }`);
}
