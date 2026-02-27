import Lux from 'luxnet';

import { getEnvValue } from 'configs/app/utils';

const CCHAIN_RPC_PATTERN = /\/ext\/bc\/C\/rpc$/;
const HTTPS_PORT = 443;
const HTTP_PORT = 80;

function parseRpcUrl(): { host: string; port: number; protocol: string } {
  const rpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL');
  if (!rpcUrl) {
    throw new Error('NEXT_PUBLIC_NETWORK_RPC_URL is not configured');
  }

  const base = rpcUrl.replace(CCHAIN_RPC_PATTERN, '');
  const url = new URL(base);
  const defaultPort = url.protocol === 'https:' ? HTTPS_PORT : HTTP_PORT;

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : defaultPort,
    protocol: url.protocol.replace(':', ''),
  };
}

let instance: Lux | undefined;

export function getLux(): Lux {
  if (!instance) {
    const { host, port, protocol } = parseRpcUrl();
    instance = new Lux(host, port, protocol);
  }
  return instance;
}
