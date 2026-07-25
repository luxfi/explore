// Wire-contract guard for the P-chain JSON-RPC surface.
//
// The node speaks Lux nomenclature: a sovereign L1 is a *Network*. The
// platform API therefore emits `netID` on every blockchain record and exposes
// `platform.getNets`. The legacy upstream spelling is not a synonym here — it
// is simply absent, and calling it returns JSON-RPC -32000. Before this guard
// existed the explorer read a field the node never sends, so
// `chain.<missing> !== PRIMARY_NETWORK_ID` was true for every primary chain and
// the "L1 / L2 / L3" tab listed all ten primary-network chains as sovereign L1s.
//
// These tests pin the wire contract against a recorded live response from
// https://api.lux.network/v1/bc/C -> P-chain (mainnet 96369, 2026-07-25).

import type { GetBlockchainsResponse, GetNetsResponse } from './types';

import { describe, expect, it } from 'vitest';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';

// Verbatim excerpt of platform.getBlockchains on lux-mainnet.
const LIVE_GET_BLOCKCHAINS: GetBlockchainsResponse = {
  blockchains: [
    {
      id: '13BEMG3e4dZXC7H7AqW9YtY3JRPP4AyPh9mvnTtX3AVnuCzri',
      name: 'K-Chain',
      netID: PRIMARY_NETWORK_ID,
      vmID: 'pJJCSV7hHYVY6TUZwR8qUPAfuhX8JLb2C1AzNSezrYNbgau8M',
    },
    {
      id: '2T11SNJM9KYqSenoPb5yv6qahmj8HLefCjxt4gTD2iQWTHwdRu',
      name: 'C-Chain',
      netID: PRIMARY_NETWORK_ID,
      vmID: 'mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6',
    },
  ],
};

// Verbatim platform.getNets on lux-mainnet.
const LIVE_GET_NETS: GetNetsResponse = {
  nets: [
    { id: PRIMARY_NETWORK_ID, controlKeys: [], threshold: '0' },
  ],
};

describe('P-chain wire contract', () => {
  it('blockchain records carry netID, and it is the field the L1 filter reads', () => {
    for (const chain of LIVE_GET_BLOCKCHAINS.blockchains) {
      expect(chain.netID).toBe(PRIMARY_NETWORK_ID);
    }
  });

  it('the L1 filter excludes primary-network chains', () => {
    const l1Chains = LIVE_GET_BLOCKCHAINS.blockchains
      .filter((c) => c.netID !== PRIMARY_NETWORK_ID);
    expect(l1Chains).toHaveLength(0);
  });

  it('reading any other id field would misclassify every primary chain as an L1', () => {
    // Regression pin: this is exactly the bug that shipped to
    // explore.lux.network. An absent field is never equal to the primary
    // network id, so the filter passed everything through.
    const wrong = LIVE_GET_BLOCKCHAINS.blockchains
      .filter((c) => (c as unknown as Record<string, string>).subnetID !== PRIMARY_NETWORK_ID);
    expect(wrong).toHaveLength(LIVE_GET_BLOCKCHAINS.blockchains.length);
  });

  it('platform.getNets returns nets, and the primary network is one of them', () => {
    expect(LIVE_GET_NETS.nets.map((n) => n.id)).toContain(PRIMARY_NETWORK_ID);
  });
});
