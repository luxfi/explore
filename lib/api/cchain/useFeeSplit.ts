// The transaction-fee 50/50 split, read straight from the chain — one balance.
//
// luxfi/evm core/fee_split.go `creditTxFee`, while the split is active, credits
// rewardShare = floor(fee/2) to extras.FeeRewardVault and leaves
// burnShare = fee - rewardShare credited to NO account. Uncredited means the wei
// is in no account at all, so the sum of all balances — the supply — falls. That
// is a true burn, mechanically identical to the EIP-1559 base-fee burn, not a
// transfer to a dead address (which would leave supply unchanged).
//
// The vault has no code and no key, so its balance only ever grows, and it is
// therefore BOTH counters at once:
//
//   rewards accrued = vault balance                          (exact)
//   supply burned   = vault balance + one wei per odd fee     (>= vault balance)
//
// One eth_getBalance answers both. No indexer, no event log, no receipts.

import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import config from 'configs/app';

// extras.FeeRewardVault — the protocol-owned account creditTxFee pays
// rewardShare into, to be exported to the P-Chain staking-reward pool.
export const FEE_REWARD_VAULT = '0x0100000000000000000000000000000000000002';

// The C-Chain block coinbase: the blackhole that receives the WHOLE fee while
// the split is inactive. It too has no code and no key, so that balance is
// stranded — NOT burned. Supply is unchanged by it.
export const FEE_COINBASE = '0x0100000000000000000000000000000000000000';

const QUERY_KEY = 'cchain:feeSplit' as const;
const POLL_INTERVAL_MS = 30_000;
const SERIES_LIMIT = 240;

export type FeeSplitStatus = 'active' | 'scheduled' | 'inactive' | 'unknown';

// The two fields of the EVM chain config that decide where a fee goes. `null`
// for the whole object means the node does not answer eth_getChainConfig, which
// is 'unknown' — never guess.
export interface FeeSplitChainConfig {
  readonly feeSplitTimestamp?: number;
  readonly allowFeeRecipients?: boolean;
}

export interface FeeSplitReading {
  readonly status: FeeSplitStatus;
  // Vault balance in wei: rewards accrued exactly, supply burned to within one
  // wei per transaction.
  readonly vaultWei: string;
  // Coinbase balance in wei. Only meaningful while the split is inactive.
  readonly coinbaseWei: string;
  readonly blockNumber: number;
  // Head block timestamp in seconds — the value the activation gate reads.
  readonly blockTime: number;
  // feeSplitTimestamp, or null when the config does not set it (nil = never).
  readonly activatesAt: number | null;
  readonly allowFeeRecipients: boolean;
}

export interface FeeSplitSample {
  readonly blockNumber: number;
  readonly blockTime: number;
  readonly vaultWei: string;
}

export interface FeeSplitData {
  readonly reading: FeeSplitReading;
  readonly series: ReadonlyArray<FeeSplitSample>;
}

// ── Activation gate ──

// Mirrors extras.ChainConfig.IsFeeSplit(time): a nil timestamp is never, and
// otherwise the split is on once time >= timestamp.
//
// The gate is evaluated against the HEAD BLOCK's timestamp, not the wall clock,
// because block time is what the node passes to IsFeeSplit. A chain whose
// activation timestamp has passed in wall-clock terms but which has not built a
// block since has not split a single fee, and must not be reported as active.
export function deriveStatus(chainConfig: FeeSplitChainConfig | null, blockTime: number): FeeSplitStatus {
  if (chainConfig === null) {
    return 'unknown';
  }
  const activatesAt = chainConfig.feeSplitTimestamp;
  if (activatesAt === undefined || activatesAt === null) {
    return 'inactive';
  }
  return blockTime >= activatesAt ? 'active' : 'scheduled';
}

// Supply burned, in wei.
//
// While the split is active this IS the vault balance: creditTxFee destroys
// ceil(fee/2) and banks floor(fee/2), so burn >= vault by at most one wei per
// transaction, and reporting the vault figure floors the burn rather than
// inflating it.
//
// Before activation it is provably ZERO — creditTxFee has not destroyed a single
// wei — so the vault balance must not be read as a burn. The vault is a plain
// account; anyone can transfer into it, and calling that "burned" would invent
// exactly the deflation this panel exists to report honestly.
//
// Undefined when the activation state could not be verified. A dash is the
// correct answer to a question we did not get to ask.
export function burnedWei(reading: FeeSplitReading | undefined): string | undefined {
  if (!reading || reading.status === 'unknown') {
    return undefined;
  }
  return reading.status === 'active' ? reading.vaultWei : '0';
}

// ── Series ──

// One observation per head block, kept for the browsing session.
//
// Historical state is not available on the fleet — a balance query even one
// block back answers "missing trie node" — and the indexer that would otherwise
// hold coin-balance history is not serving. So the only honest series is what
// this session observes. Module scope, not component state, so it survives
// navigating away and back inside the SPA; deduplicated on block number because
// the balance cannot change without a new block.
const observations: Array<FeeSplitSample> = [];

export function recordSample(
  reading: FeeSplitReading,
  into: Array<FeeSplitSample> = observations,
): ReadonlyArray<FeeSplitSample> {
  const last = into[into.length - 1];
  if (!last || last.blockNumber !== reading.blockNumber) {
    into.push({
      blockNumber: reading.blockNumber,
      blockTime: reading.blockTime,
      vaultWei: reading.vaultWei,
    });
    if (into.length > SERIES_LIMIT) {
      into.shift();
    }
  }
  // A fresh array every call: the chart re-renders on identity, and the caller
  // must never be handed the buffer itself.
  return into.slice();
}

// Wei -> whole coin, for plotting.
//
// THE DIVISOR IS 10^18, NOT 10^9. nLUX (10^9) is the P-Chain staking
// denomination; this is a C-Chain EVM account balance from eth_getBalance, which
// is wei. config.chain.currency.decimals is the one place that number lives —
// read it, never hard-code. Proof from live mainnet: the fee coinbase holds
// 3867543864740765677447 wei = 3,867.54 LUX. At 10^9 it would read 3.87 trillion
// LUX, roughly double the entire supply.
export function toCoinSeries(series: ReadonlyArray<FeeSplitSample>): Array<{ date: Date; value: number }> {
  const divisor = new BigNumber(10).pow(config.chain.currency.decimals);
  return series.map((sample) => ({
    date: new Date(sample.blockTime * 1000),
    value: new BigNumber(sample.vaultWei).div(divisor).toNumber(),
  }));
}

// ── Wire ──

export interface RpcEnvelope {
  readonly id?: number;
  readonly result?: unknown;
  readonly error?: { readonly message?: string };
}

const ID_VAULT = 1;
const ID_COINBASE = 2;
const ID_HEAD = 3;
const ID_CHAIN_CONFIG = 4;

const RPC_BATCH = [
  { jsonrpc: '2.0', id: ID_VAULT, method: 'eth_getBalance', params: [ FEE_REWARD_VAULT, 'latest' ] },
  { jsonrpc: '2.0', id: ID_COINBASE, method: 'eth_getBalance', params: [ FEE_COINBASE, 'latest' ] },
  { jsonrpc: '2.0', id: ID_HEAD, method: 'eth_getBlockByNumber', params: [ 'latest', false ] },
  // luxfi/evm extension. A node that does not serve it answers "method not
  // found", which is the honest 'unknown' state rather than a failure.
  { jsonrpc: '2.0', id: ID_CHAIN_CONFIG, method: 'eth_getChainConfig', params: [] },
];

// Required results throw on a JSON-RPC error rather than reading as zero: a
// balance the node refused to give is not a zero balance, and a burn counter
// that silently reads zero on failure is the worst possible lie.
function required(batch: ReadonlyArray<RpcEnvelope>, id: number, what: string): unknown {
  const entry = batch.find((item) => item.id === id);
  if (!entry || entry.error || entry.result === undefined || entry.result === null) {
    const detail = entry?.error?.message ? `: ${ entry.error.message }` : '';
    throw new Error(`C-Chain RPC did not return ${ what }${ detail }`);
  }
  return entry.result;
}

function hexToWeiString(value: unknown, what: string): string {
  if (typeof value !== 'string') {
    throw new Error(`C-Chain RPC returned a non-hex ${ what }`);
  }
  return BigInt(value).toString();
}

function hexToNumber(value: unknown, what: string): number {
  if (typeof value !== 'string') {
    throw new Error(`C-Chain RPC returned a non-hex ${ what }`);
  }
  return Number(BigInt(value));
}

export function parseFeeSplitBatch(batch: ReadonlyArray<RpcEnvelope>): FeeSplitReading {
  const head = required(batch, ID_HEAD, 'the head block') as { number?: string; timestamp?: string };

  const configEntry = batch.find((item) => item.id === ID_CHAIN_CONFIG);
  const chainConfig = (configEntry && !configEntry.error && configEntry.result ?
    configEntry.result : null) as FeeSplitChainConfig | null;

  const blockTime = hexToNumber(head.timestamp, 'head block timestamp');

  return {
    status: deriveStatus(chainConfig, blockTime),
    vaultWei: hexToWeiString(required(batch, ID_VAULT, 'the fee vault balance'), 'balance'),
    coinbaseWei: hexToWeiString(required(batch, ID_COINBASE, 'the coinbase balance'), 'balance'),
    blockNumber: hexToNumber(head.number, 'head block number'),
    blockTime,
    activatesAt: chainConfig?.feeSplitTimestamp ?? null,
    allowFeeRecipients: chainConfig?.allowFeeRecipients === true,
  };
}

async function fetchFeeSplit(): Promise<FeeSplitData> {
  const url = config.chain.rpcUrls[0];
  if (!url) {
    throw new Error('No C-Chain RPC URL is configured');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(RPC_BATCH),
  });

  if (!res.ok) {
    throw new Error(`C-Chain RPC returned ${ res.status }`);
  }

  const batch = await res.json() as unknown;
  if (!Array.isArray(batch)) {
    throw new Error('C-Chain RPC did not answer the batch');
  }

  const reading = parseFeeSplitBatch(batch as ReadonlyArray<RpcEnvelope>);

  return { reading, series: recordSample(reading) };
}

// ── Hook ──

export function useFeeSplit() {
  const query = useQuery({
    queryKey: [ QUERY_KEY ],
    queryFn: fetchFeeSplit,
    staleTime: POLL_INTERVAL_MS,
    refetchInterval: POLL_INTERVAL_MS,
    retry: 1,
  });

  return {
    reading: query.data?.reading,
    series: query.data?.series,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
