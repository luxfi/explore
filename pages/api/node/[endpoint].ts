// JSON-RPC pass-through to one endpoint on our own node.
//
// The browser cannot call the node directly: the gateway answers 404 to the
// OPTIONS preflight for /v1/bc/*, so a cross-origin RPC fails before it is
// sent. Forwarding from the server side has no preflight.
//
// `endpoint` is resolved against a fixed table and never used as a URL. An
// arbitrary value here would make this an open request forwarder for anything
// the server can reach.
//
// Replaces /v1/pchain, which hardcoded /v1/bc/P. The P-Chain is not the only
// chain a page needs to ask about — every primary-network chain has its own
// identity and its own liveness, and reading them was the whole reason each
// chain page showed the same network-wide validator count.

import type { NextApiRequest, NextApiResponse } from 'next';

import { CHAINS, getCurrentChain } from 'configs/app/chainRegistry';
import { PRIMARY_VMS } from 'configs/app/primaryChains';
import { getEnvValue } from 'configs/app/utils';

const TIMEOUT_MS = 10_000;

// endpoint -> path on the node. `info` is the node's own API; every other
// entry is a primary-network chain, addressed by its single-letter alias.
// EVM chains answer under /rpc, the rest at the bare chain path.
const PATHS: Readonly<Record<string, string>> = {
  info: '/v1/info',
  ...Object.fromEntries(PRIMARY_VMS.map((vm) => [
    vm.slug,
    `/v1/bc/${ vm.slug.charAt(0).toUpperCase() }${ vm.view === 'evm' || vm.view === 'dex' ? '/rpc' : '' }`,
  ])),
};

// `?chain=<name>` reads another network's node — every sovereign L1 runs its
// own. The name is resolved against the registry, never used as a URL.
function getChainBase(name: string): string | undefined {
  const { network } = getCurrentChain();
  return CHAINS.find((c) => c.name === name && c.network === network)?.nodeApiUrl;
}

// The node's API origin, derived from the chain RPC URL. That URL points at a
// specific EVM chain (canonical `…/v1/bc/C/rpc`), so it must be reduced to
// scheme+host — concatenating onto the full RPC path produced a malformed URL,
// an HTML 404, and "Unexpected non-whitespace character after JSON" on every
// non-C-chain brand.
function getApiBase(): string {
  const rpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') ?? '';
  try {
    return rpcUrl ? new URL(rpcUrl).origin : '';
  } catch {
    return '';
  }
}

const handler = async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const endpoint = String(req.query.endpoint ?? '').toLowerCase();
  const path = PATHS[endpoint];
  if (!path) {
    res.status(404).json({ error: `Unknown node endpoint "${ endpoint }"` });
    return;
  }

  const chain = req.query.chain;
  if (typeof chain === 'string' && !getChainBase(chain)) {
    res.status(404).json({ error: `No node API is registered for chain "${ chain }"` });
    return;
  }

  const base = typeof chain === 'string' ? getChainBase(chain) : getApiBase();
  if (!base) {
    res.status(500).json({ error: 'NEXT_PUBLIC_NETWORK_RPC_URL not configured' });
    return;
  }

  try {
    const response = await fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // Valid RPC yields JSON; a chain the gateway does not route yields its HTML
    // 404. Most primary chains are registered on the P-Chain and bootstrapped
    // on the node but unreachable, so that is a normal answer about the network,
    // not a failure of this request — it comes back 200 carrying a JSON-RPC
    // error, the way JSON-RPC reports an unavailable method. Answering 502
    // instead put a red failed request in the console of eight of the ten
    // chain pages and claimed something was broken when nothing was.
    const raw = await response.text();
    try {
      res.status(200).json(JSON.parse(raw));
    } catch {
      res.status(200).json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32601,
          message: `${ path } is not routed by the gateway (HTTP ${ response.status })`,
        },
      });
    }
  } catch (error) {
    // A timeout or a DNS failure IS a transport fault, and stays one.
    res.status(502).json({
      error: 'unreachable',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;
