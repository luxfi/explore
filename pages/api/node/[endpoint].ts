// Pass-through to our own node, for reads the browser cannot make directly: the
// gateway answers 404 to the OPTIONS preflight for /v1/chain/*, so a
// cross-origin request fails before it is sent. Forwarding from the server side
// has no preflight.
//
//   GET  /v1/node/p-chain?op=<op>  the P-Chain's typed reads, GET /v1/chain/P/ops/<op>
//                                  on the P-Chain that secures this host's chain
//   POST /v1/node/<endpoint>       JSON-RPC to the node's info API or a primary-network chain
//
// Every endpoint, op and query parameter is resolved against a fixed table and
// never used as a URL. An arbitrary value here would make this an open request
// forwarder for anything the server can reach.

import type { NextApiRequest, NextApiResponse } from 'next';

import { requestHost } from 'nextjs/getServerSideProps/guards';

import { getPChain } from 'configs/app/chainRegistry';
import { PRIMARY_VMS } from 'configs/app/primaryChains';
import { getEnvValue } from 'configs/app/utils';

const TIMEOUT_MS = 10_000;

// op -> the query parameters it may carry. The contract is the node's OpenAPI
// document at /v1/chain/P/ops/.well-known/openapi.json. luxd serves no P-Chain
// JSON-RPC, so the P-Chain has no entry in PATHS below.
const P_CHAIN_OPS: Readonly<Record<string, ReadonlyArray<string>>> = {
  validators: [ 'nodeIDs' ],
  blockchains: [],
  height: [],
};

// A NodeID is "NodeID-" and base58, which carries nothing a URL would read as syntax.
const NODE_ID = /^NodeID-[1-9A-HJ-NP-Za-km-z]+$/;

// endpoint -> JSON-RPC path on the node. `info` is the node's own API; every
// other entry is a primary-network chain, addressed by its single-letter alias.
// EVM chains answer under /rpc, the rest at the bare chain path.
const PATHS: Readonly<Record<string, string>> = {
  info: '/v1/info',
  ...Object.fromEntries(PRIMARY_VMS.filter((vm) => vm.view !== 'platform').map((vm) => [
    vm.slug,
    `/v1/chain/${ vm.slug.charAt(0).toUpperCase() }${ vm.view === 'evm' || vm.view === 'dex' ? '/rpc' : '' }`,
  ])),
};

const pChain = async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const op = String(req.query.op ?? '');
  const allowed = P_CHAIN_OPS[op];
  if (!allowed) {
    res.status(404).json({ error: `Unknown P-Chain op "${ op }"` });
    return;
  }

  const source = getPChain(requestHost(req));
  if (!source) {
    res.status(404).json({ error: 'No P-Chain secures this chain' });
    return;
  }

  const query = new URLSearchParams();
  for (const name of allowed) {
    const value = req.query[name];
    if (value === undefined) {
      continue;
    }
    if (typeof value !== 'string' || !NODE_ID.test(value)) {
      res.status(400).json({ error: `${ name } must be one NodeID` });
      return;
    }
    query.set(name, value);
  }

  try {
    const qs = query.toString();
    const response = await fetch(`${ source.url }/v1/chain/P/ops/${ op }${ qs ? `?${ qs }` : '' }`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const raw = await response.text();
    try {
      res.status(response.status).json(JSON.parse(raw));
    } catch {
      // A gateway that does not route the op answers with a page, not JSON.
      res.status(502).json({ error: 'unreadable', message: `/v1/chain/P/ops/${ op } answered HTTP ${ response.status } without JSON` });
    }
  } catch (error) {
    res.status(502).json({
      error: 'unreachable',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// The node's API origin, derived from the chain RPC URL. That URL points at a
// specific EVM chain (canonical `…/v1/chain/C/rpc`), so it must be reduced to
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
  if (req.query.endpoint === 'p-chain') {
    return pChain(req, res);
  }

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

  const base = getApiBase();
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
