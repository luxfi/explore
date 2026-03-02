// Server-side proxy for P-chain JSON-RPC calls.
// Bypasses CORS issues with the KrakenD gateway which returns 404 on OPTIONS preflight for /ext/bc/P.

import type { NextApiRequest, NextApiResponse } from 'next';

import { getEnvValue } from 'configs/app/utils';

const CCHAIN_RPC_PATTERN = /\/ext\/bc\/C\/rpc$/;
const TIMEOUT_MS = 10_000;

function getApiBase(): string {
  const rpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') ?? '';
  return rpcUrl.replace(CCHAIN_RPC_PATTERN, '');
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

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({
      error: 'P-chain request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;
