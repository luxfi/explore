// Low-level P-chain JSON-RPC client.
// Derives the P-chain URL from NEXT_PUBLIC_NETWORK_RPC_URL by replacing the
// C-chain path (/ext/bc/C/rpc) with the P-chain path (/ext/bc/P).

import type { JsonRpcRequest, JsonRpcResponse } from './types';

import { getEnvValue } from 'configs/app/utils';

const PCHAIN_PATH = '/ext/bc/P';
const CCHAIN_PATH_PATTERN = /\/ext\/bc\/C\/rpc$/;

let requestId = 0;

function getPChainUrl(): string {
  const rpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL');

  if (!rpcUrl) {
    throw new Error('NEXT_PUBLIC_NETWORK_RPC_URL is not configured');
  }

  // Replace C-chain path with P-chain path
  if (CCHAIN_PATH_PATTERN.test(rpcUrl)) {
    return rpcUrl.replace(CCHAIN_PATH_PATTERN, PCHAIN_PATH);
  }

  // Fallback: strip trailing slash and append P-chain path
  const base = rpcUrl.replace(/\/+$/, '');
  try {
    const url = new URL(base);
    return `${ url.origin }${ PCHAIN_PATH }`;
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_NETWORK_RPC_URL: ${ rpcUrl }`);
  }
}

export async function pchainRpc<TResult>(
  method: string,
  params?: Record<string, unknown>,
): Promise<TResult> {
  const url = getPChainUrl();
  requestId += 1;

  const body: JsonRpcRequest = {
    jsonrpc: '2.0',
    id: requestId,
    method,
    ...(params !== undefined ? { params } : {}),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`P-chain RPC error: HTTP ${ response.status }`);
  }

  const json = await response.json() as JsonRpcResponse<TResult>;

  if (json.error) {
    throw new Error(`P-chain RPC error: ${ json.error.message } (code ${ json.error.code })`);
  }

  if (json.result === undefined) {
    throw new Error('P-chain RPC error: missing result in response');
  }

  return json.result;
}

export { getPChainUrl };
