// Wire-contract guard for the P-Chain's typed reads, GET /v1/chain/P/ops/*.
// luxd serves no P-Chain JSON-RPC; the contract is its OpenAPI 3.1 document at
// /v1/chain/P/ops/.well-known/openapi.json.
//
// The node speaks Lux nomenclature: a sovereign L1 is a *Network*, so every
// blockchain record carries `netID`. The legacy upstream spelling is simply
// absent. Before this guard existed the explorer read a field the node never
// sends, so `chain.<missing> !== PRIMARY_NETWORK_ID` was true for every primary
// chain and the "L1 / L2 / L3" tab listed all ten primary-network chains as
// sovereign L1s.
//
// Pinned against responses recorded from https://api.lux.network (mainnet
// 96369, luxd v1.37.9, 2026-09-24).

import type { GetBlockchainsResponse, GetCurrentValidatorsResponse, GetHeightResponse } from './types';

import { describe, expect, it } from 'vitest';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';

// Verbatim excerpt of GET /v1/chain/P/ops/blockchains.
const LIVE_BLOCKCHAINS: GetBlockchainsResponse = {
  blockchains: [
    {
      id: '2Y3a57PjhyvTfmiqxN772ms2kDD1xkcskaw3Mb7ZbwLYFuSoqS',
      name: 'K-Chain',
      netID: PRIMARY_NETWORK_ID,
      vmID: 'pJJCSV7hHYVY6TUZwR8qUPAfuhX8JLb2C1AzNSezrYNbgau8M',
    },
    {
      id: '2Hx3UMuWA6mSQHwZ8SYcqnWUUAj4T3jHbD5HFFa1SiCdPq9TvU',
      name: 'C-Chain',
      netID: PRIMARY_NETWORK_ID,
      vmID: 'mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6',
    },
  ],
};

// Verbatim first record of GET /v1/chain/P/ops/validators, signer omitted.
const LIVE_VALIDATORS = {
  validators: [
    {
      txID: '2sV1q6dPSWKs8eUJDbbhcCi7wdZ4vLa6sy1nhrXqbbmBMLxFD7',
      startTime: '1765573611',
      endTime: '1797088011',
      weight: '500000000000000000',
      nodeID: 'NodeID-DwsrqSkPoE3pXWrUt9nkJ5yBycwRQ246X',
      potentialReward: '33575831900252839',
      accruedDelegateeReward: '0',
      delegationFee: '2.0000',
      uptime: '99.9205',
      connected: false,
      delegatorCount: '0',
      delegatorWeight: '0',
    },
  ],
};

// The recorded answer is assignable to the type the hooks read it as.
const TYPED_VALIDATORS: GetCurrentValidatorsResponse = LIVE_VALIDATORS;

// Verbatim GET /v1/chain/P/ops/height: the archive node has no peers, so the
// P-Chain sits at genesis.
const LIVE_HEIGHT: GetHeightResponse = { height: '0' };

describe('P-Chain wire contract', () => {
  it('blockchain records carry netID, and it is the field the L1 filter reads', () => {
    for (const chain of LIVE_BLOCKCHAINS.blockchains) {
      expect(chain.netID).toBe(PRIMARY_NETWORK_ID);
    }
  });

  it('the L1 filter excludes primary-network chains', () => {
    const l1Chains = LIVE_BLOCKCHAINS.blockchains
      .filter((c) => c.netID !== PRIMARY_NETWORK_ID);
    expect(l1Chains).toHaveLength(0);
  });

  it('reading any other id field would misclassify every primary chain as an L1', () => {
    // Regression pin: this is exactly the bug that shipped to
    // explore.lux.network. An absent field is never equal to the primary
    // network id, so the filter passed everything through.
    const wrong = LIVE_BLOCKCHAINS.blockchains
      .filter((c) => (c as unknown as Record<string, string>).subnetID !== PRIMARY_NETWORK_ID);
    expect(wrong).toHaveLength(LIVE_BLOCKCHAINS.blockchains.length);
  });

  it('a validator carries its stake as weight and its delegators as a count and a weight', () => {
    const [ v ] = TYPED_VALIDATORS.validators;
    expect(BigInt(v.weight)).toBe(BigInt('500000000000000000'));
    expect(v.delegatorCount).toBe('0');
    expect(v.delegatorWeight).toBe('0');
    // The list never carries the delegator records or the deprecated stakeAmount.
    expect(v).not.toHaveProperty('delegators');
    expect(v).not.toHaveProperty('stakeAmount');
  });

  it('height is a decimal string, and 0 is a height', () => {
    expect(LIVE_HEIGHT.height).toMatch(/^\d+$/);
    expect(Number(LIVE_HEIGHT.height)).toBe(0);
  });
});
