// Server-side proxy for P-chain JSON-RPC calls.
// Bypasses CORS issues with the KrakenD gateway which returns 404 on OPTIONS preflight for /ext/bc/P.

import type { NextApiRequest, NextApiResponse } from 'next';

import { getEnvValue } from 'configs/app/utils';

const TIMEOUT_MS = 10_000;

// Derive the node's API origin from the chain RPC URL. The RPC URL points at a
// specific EVM chain (e.g. `…/ext/bc/C/rpc` or `…/ext/bc/hanzo/rpc`); the P-chain
// lives at `<origin>/ext/bc/P`, so we must reduce to the scheme+host origin and
// never naively concatenate onto the full RPC path (which produced a malformed
// URL → HTML 404 → "Unexpected non-whitespace character after JSON" for every
// non-C-chain brand).
function getApiBase(): string {
  const rpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') ?? '';
  if (!rpcUrl) {
    return '';
  }
  try {
    return new URL(rpcUrl).origin;
  } catch {
    return '';
  }
}

const handler = async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const base = getApiBase();
  if (!base) {
    res.status(500).json({ error: 'NEXT_PUBLIC_NETWORK_RPC_URL not configured' });
    return;
  }

  try {
    const response = await fetch(`${ base }/ext/bc/P`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // The node returns JSON for valid P-chain RPC; a wrong URL or gateway
    // error yields HTML. Read as text and parse defensively so the client gets a
    // clear error rather than an opaque "non-whitespace character" parse crash.
    const raw = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      res.status(502).json({
        error: 'P-chain request failed',
        message: `Upstream returned non-JSON (HTTP ${ response.status }) from ${ base }/ext/bc/P`,
      });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({
      error: 'P-chain request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;
