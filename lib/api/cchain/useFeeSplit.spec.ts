// Wire-contract and arithmetic guard for the fee-split panel.
//
// Two things can go wrong here and both are silent:
//
//   1. The decimals. A C-Chain balance from eth_getBalance is WEI (10^18).
//      nLUX (10^9) is the P-Chain staking denomination, and a 10^9 divisor
//      already shipped once in this repo (commit 1b6e86a16) — every LUX figure
//      was 1000x too large. On a burn counter the same slip would be 10^9x.
//
//   2. The activation gate. Reporting "burned" on a chain where the split has
//      never fired invents deflation that is not happening.
//
// The batch below is a verbatim response from the live mainnet C-Chain
// (https://api.lux.network/v1/bc/C/rpc, chainId 96369, head 1098191).

import { describe, expect, it } from 'vitest';

import type { FeeSplitReading, RpcEnvelope } from './useFeeSplit';
import {
  blockTimeSeconds,
  burnedWei,
  deriveFeeDestination,
  deriveStatus,
  feeDestinationAt,
  feeDestinationCopy,
  parseFeeSplitBatch,
  recordSample,
  toCoinSeries,
} from './useFeeSplit';

// Verbatim, trimmed only of chain-config fields the panel never reads.
// id 1 = fee reward vault balance, id 2 = coinbase balance,
// id 3 = head block, id 4 = eth_getChainConfig.
const LIVE_MAINNET_BATCH: Array<RpcEnvelope> = [
  { id: 1, result: '0x0' },
  { id: 2, result: '0xd1a8f3fddb2abeb787' },
  { id: 3, result: { number: '0x10c1cf', timestamp: '0x6a6388cb' } },
  { id: 4, result: { chainId: 96369, feeConfig: {}, upgrades: {} } },
];

// What a node that does not implement the luxfi/evm extension answers.
const NO_CHAIN_CONFIG_BATCH: Array<RpcEnvelope> = [
  { id: 1, result: '0x0' },
  { id: 2, result: '0x0' },
  { id: 3, result: { number: '0x10c1cf', timestamp: '0x6a6388cb' } },
  { id: 4, error: { message: 'the method eth_getChainConfig does not exist/is not available' } },
];

const READING = (over: Partial<FeeSplitReading> = {}): FeeSplitReading => ({
  status: 'active',
  vaultWei: '0',
  coinbaseWei: '0',
  blockNumber: 1,
  blockTime: 1_785_000_000,
  activatesAt: null,
  allowFeeRecipients: false,
  ...over,
});

describe('deriveStatus — mirrors extras.ChainConfig.IsFeeSplit', () => {
  it('reports unknown when the node does not serve a chain config', () => {
    expect(deriveStatus(null, 1_785_000_000)).toBe('unknown');
  });

  it('reports inactive when feeSplitTimestamp is absent (nil = never)', () => {
    // This is live mainnet today: the config is served, the field is not set.
    expect(deriveStatus({}, 1_785_000_000)).toBe('inactive');
  });

  it('activates at the timestamp, not after it', () => {
    expect(deriveStatus({ feeSplitTimestamp: 1000 }, 999)).toBe('scheduled');
    expect(deriveStatus({ feeSplitTimestamp: 1000 }, 1000)).toBe('active');
    expect(deriveStatus({ feeSplitTimestamp: 1000 }, 1001)).toBe('active');
  });

  it('reads BLOCK time, not wall clock: a chain stuck at genesis has split nothing', () => {
    // Devnet 96367: feeSplitTimestamp 1785133547 is set and has passed in
    // wall-clock terms, but the C-Chain has never built a block, so no fee has
    // ever been split. Wall clock would say "active" and report a burn that
    // did not happen.
    expect(deriveStatus({ feeSplitTimestamp: 1_785_133_547 }, 0)).toBe('scheduled');
  });
});

describe('parseFeeSplitBatch — live mainnet wire contract', () => {
  it('reads the vault, the coinbase and the head from one batch', () => {
    const reading = parseFeeSplitBatch(LIVE_MAINNET_BATCH);

    expect(reading.vaultWei).toBe('0');
    expect(reading.coinbaseWei).toBe('3867543864740765677447');
    expect(reading.blockNumber).toBe(1098191);
    expect(reading.blockTime).toBe(1784907979);
  });

  it('mainnet today is inactive: the split has never fired, nothing is burned', () => {
    const reading = parseFeeSplitBatch(LIVE_MAINNET_BATCH);

    expect(reading.status).toBe('inactive');
    expect(reading.activatesAt).toBeNull();
    expect(reading.vaultWei).toBe('0');
  });

  it('falls back to unknown — never to inactive — when the config call errors', () => {
    // An errored config must not be read as "no feeSplitTimestamp"; the panel
    // has to say it cannot tell rather than assert a state it did not observe.
    expect(parseFeeSplitBatch(NO_CHAIN_CONFIG_BATCH).status).toBe('unknown');
  });

  it('throws rather than reporting zero when a balance call errors', () => {
    const failed: Array<RpcEnvelope> = [
      { id: 1, error: { message: 'missing trie node' } },
      ...LIVE_MAINNET_BATCH.slice(1),
    ];
    expect(() => parseFeeSplitBatch(failed)).toThrow(/fee vault balance/);
  });

  it('keeps full wei precision (a balance overflows Number)', () => {
    const big: Array<RpcEnvelope> = [
      { id: 1, result: '0xd1a8f3fddb2abeb787' },
      ...LIVE_MAINNET_BATCH.slice(1),
    ];
    // Number() would round this to ...677440.
    expect(parseFeeSplitBatch(big).vaultWei).toBe('3867543864740765677447');
  });
});

describe('burnedWei — a balance is not a burn', () => {
  it('is the vault balance once the split is active', () => {
    expect(burnedWei(READING({ status: 'active', vaultWei: '900' }))).toBe('900');
  });

  it('is exactly zero before activation, even if the vault holds a balance', () => {
    // The vault is a plain account: anyone can transfer into it. Before the
    // split fires, creditTxFee has destroyed nothing, so that balance is not a
    // burn and must never be rendered as one.
    expect(burnedWei(READING({ status: 'inactive', vaultWei: '7500000000000000000' }))).toBe('0');
    expect(burnedWei(READING({ status: 'scheduled', vaultWei: '7500000000000000000' }))).toBe('0');
  });

  it('is undefined — not zero — when the activation state could not be read', () => {
    expect(burnedWei(READING({ status: 'unknown', vaultWei: '900' }))).toBeUndefined();
    expect(burnedWei(undefined)).toBeUndefined();
  });
});

describe('toCoinSeries — the divisor is 10^18, not 10^9', () => {
  it('renders the live coinbase pile as 3,867 LUX, not 3.87 trillion', () => {
    const [ point ] = toCoinSeries([
      { blockNumber: 1098191, blockTime: 1784907979, vaultWei: '3867543864740765677447' },
    ]);

    expect(point.value).toBeCloseTo(3867.54386474, 6);
    // The 10^9 bug would land at 3.867e12 — above the whole LUX supply.
    expect(point.value).toBeLessThan(1e6);
    expect(point.date.getTime()).toBe(1784907979 * 1000);
  });

  it('does not round a single wei up to a whole coin', () => {
    const [ point ] = toCoinSeries([ { blockNumber: 1, blockTime: 1, vaultWei: '1' } ]);
    expect(point.value).toBe(1e-18);
  });
});

describe('recordSample', () => {
  it('records one observation per block and ignores repeats of the same block', () => {
    const buffer: Array<{ blockNumber: number; blockTime: number; vaultWei: string }> = [];

    recordSample(READING({ blockNumber: 10, vaultWei: '100' }), buffer);
    recordSample(READING({ blockNumber: 10, vaultWei: '100' }), buffer);
    const series = recordSample(READING({ blockNumber: 11, vaultWei: '150' }), buffer);

    expect(series.map((s) => s.blockNumber)).toEqual([ 10, 11 ]);
    expect(series.map((s) => s.vaultWei)).toEqual([ '100', '150' ]);
  });

  it('returns a fresh array so the chart re-renders, and never the buffer itself', () => {
    const buffer: Array<{ blockNumber: number; blockTime: number; vaultWei: string }> = [];
    const first = recordSample(READING({ blockNumber: 1 }), buffer);
    const second = recordSample(READING({ blockNumber: 2 }), buffer);

    expect(first).not.toBe(buffer);
    expect(second).not.toBe(first);
  });

  it('caps the buffer so an all-day tab cannot grow without bound', () => {
    const buffer: Array<{ blockNumber: number; blockTime: number; vaultWei: string }> = [];
    let series: ReadonlyArray<{ blockNumber: number }> = [];
    for (let i = 0; i < 300; i++) {
      series = recordSample(READING({ blockNumber: i }), buffer);
    }

    expect(series).toHaveLength(240);
    expect(series[series.length - 1].blockNumber).toBe(299);
  });
});

describe('deriveFeeDestination — "Burnt fees" is a claim, not a label', () => {
  it('only calls it burned while the split is active', () => {
    expect(deriveFeeDestination('active')).toBe('burned');
  });

  // Mainnet 96369 today: eth_getChainConfig answers (chainId present) with no
  // feeSplitTimestamp, the vault holds 0 LUX and the coinbase 0x0100..0000
  // holds 3867.79 LUX. Every wei of every fee went to an account.
  it('says coinbase before activation, scheduled or not', () => {
    expect(deriveFeeDestination('inactive')).toBe('coinbase');
    expect(deriveFeeDestination('scheduled')).toBe('coinbase');
  });

  it('makes no claim when the config could not be read', () => {
    expect(deriveFeeDestination('unknown')).toBe('unknown');
  });

  it('never shows a burn ratio for a fee that was not burned', () => {
    expect(feeDestinationCopy('burned').showBurnRatio).toBe(true);
    expect(feeDestinationCopy('coinbase').showBurnRatio).toBe(false);
    expect(feeDestinationCopy('unknown').showBurnRatio).toBe(false);
  });

  it('never labels an un-burned fee "Burnt fees"', () => {
    expect(feeDestinationCopy('coinbase').label).not.toContain('Burnt');
    expect(feeDestinationCopy('unknown').label).not.toContain('Burnt');
    expect(feeDestinationCopy('burned').label).toBe('Burnt fees');
  });
});

// A block's label must follow the policy in force AT THAT BLOCK. Deriving it
// from the head reading is only accidentally right while the split has never
// been active; the day feeSplitTimestamp passes, every pre-activation block
// would be relabelled "Burnt fees" — the same false deflation claim, moved into
// history. These cases pin the per-block gate that prevents that.
describe('per-block fee destination — history must not be relabelled', () => {
  const ACTIVATES_AT = 1_800_000_000;
  const config = { feeSplitTimestamp: ACTIVATES_AT };

  it('does not call a pre-activation block burned once the split is live', () => {
    // Head is past activation, the rendered block is not.
    expect(deriveFeeDestination(deriveStatus(config, ACTIVATES_AT + 5_000))).toBe('burned');
    expect(deriveFeeDestination(deriveStatus(config, ACTIVATES_AT - 1))).toBe('coinbase');
  });

  it('suppresses the burn ratio on a pre-activation block', () => {
    const copy = feeDestinationCopy(deriveFeeDestination(deriveStatus(config, ACTIVATES_AT - 1)));
    expect(copy.showBurnRatio).toBe(false);
    expect(copy.label).not.toContain('Burnt');
  });

  it('calls the activation block itself burned — the gate is >=, as in IsFeeSplit', () => {
    expect(deriveFeeDestination(deriveStatus(config, ACTIVATES_AT))).toBe('burned');
  });

  it('reads an API timestamp as whole seconds', () => {
    // Block 1098234, the page that rendered "Burnt fees" over coinbase 0x0100..0000.
    expect(blockTimeSeconds('2026-07-28T07:28:35.000000Z')).toBe(1785223715);
  });

  it('has no block time when the API omits it, so the caller falls back to head', () => {
    expect(blockTimeSeconds(null)).toBeUndefined();
    expect(blockTimeSeconds(undefined)).toBeUndefined();
    expect(blockTimeSeconds('')).toBeUndefined();
    expect(blockTimeSeconds('not a date')).toBeUndefined();
  });
});

// The wiring, not just the arithmetic: feeDestinationAt is what the block pages
// call. Reusing reading.status here instead of re-deriving against the block's
// own time is exactly the regression these cases exist to catch.
describe('feeDestinationAt — the reading is the head, the question is the block', () => {
  const ACTIVATES_AT = 1_800_000_000;

  // A head reading taken well AFTER activation: status is 'active'.
  const headAfterActivation: FeeSplitReading = {
    status: 'active',
    vaultWei: '0x0',
    coinbaseWei: '0x0',
    blockNumber: 2_000_000,
    blockTime: ACTIVATES_AT + 100_000,
    activatesAt: ACTIVATES_AT,
    allowFeeRecipients: false,
  };

  it('does NOT report a pre-activation block as burned', () => {
    expect(feeDestinationAt(headAfterActivation, ACTIVATES_AT - 1)).toBe('coinbase');
  });

  it('still reports a post-activation block as burned', () => {
    expect(feeDestinationAt(headAfterActivation, ACTIVATES_AT + 1)).toBe('burned');
  });

  it('falls back to the head reading when the block time is unknown', () => {
    expect(feeDestinationAt(headAfterActivation, undefined)).toBe('burned');
  });

  it('makes no claim at all with no reading', () => {
    expect(feeDestinationAt(undefined, ACTIVATES_AT + 1)).toBe('unknown');
  });

  it('reports coinbase for every block on a chain that never set the timestamp', () => {
    // Mainnet 96369 today. Head and history alike: nothing has been burned.
    const neverActivated: FeeSplitReading = { ...headAfterActivation, status: 'inactive', activatesAt: null };
    expect(feeDestinationAt(neverActivated, 1)).toBe('coinbase');
    expect(feeDestinationAt(neverActivated, ACTIVATES_AT + 100_000)).toBe('coinbase');
  });
});
