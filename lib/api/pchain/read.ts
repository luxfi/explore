// One typed P-Chain read, GET /v1/chain/P/ops/<op> on the P-Chain that secures
// this explorer's chain, through the same-origin proxy (pages/api/node/[endpoint].ts).
// The contract is the node's OpenAPI document at ops/.well-known/openapi.json.

export type PChainOp = 'validators' | 'blockchains' | 'height';

export async function read<T>(op: PChainOp, query: Readonly<Record<string, string>> = {}): Promise<T> {
  const res = await fetch(`/v1/node/p-chain?${ new URLSearchParams({ op, ...query }) }`);
  if (!res.ok) {
    throw new Error(`P-Chain ${ op } answered ${ res.status }`);
  }
  return await res.json() as T;
}
