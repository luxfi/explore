// @vitest-environment jsdom

// The home page reads the Lux primary network only where it shows it. Zoo's
// home shows its own chain, so it sends no P-Chain request, even though a
// P-Chain (Lux's) secures it and its validators page reads that one.

import type React from 'react';

import type * as ChainRegistry from 'configs/app/chainRegistry';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';

const host = vi.hoisted(() => {
  // jsdom has no matchMedia, and the page's layout hooks ask it at render.
  window.matchMedia = ((query: string) => ({
    matches: false, media: query, onchange: null, dispatchEvent: () => false,
    addEventListener: () => undefined, removeEventListener: () => undefined, addListener: () => undefined, removeListener: () => undefined,
  })) as typeof window.matchMedia;
  return { primary: false };
});

// A module whose one export renders its children and nothing of its own.
const passthrough = vi.hoisted(() => (name: string) => ({ [name]: ({ children }: { children?: React.ReactNode }) => children ?? null }));

vi.mock('configs/app/chainRegistry', async(importOriginal) => ({
  ...(await importOriginal<typeof ChainRegistry>()),
  isPrimaryNetworkExplorer: () => host.primary,
  getPChain: () => ({ url: 'https://api.lux.network', name: 'Lux primary network', symbol: 'LUX' }),
}));

// The brand-agnostic panels read the indexer, not the P-Chain, and the UI kit
// needs its theme provider; neither is what is under test.
vi.mock('ui/home/fallbacks/rpcDataContext', () => passthrough('HomeRpcDataContextProvider'));
vi.mock('@luxfi/ui/heading', () => passthrough('Heading'));
vi.mock('@luxfi/ui/skeleton', () => passthrough('Skeleton'));
vi.mock('@luxfi/ui/tag', () => passthrough('Tag'));
vi.mock('toolkit/next/link', () => passthrough('Link'));
vi.mock('ui/home/HeroBanner', () => ({ 'default': () => null }));
vi.mock('ui/home/Stats', () => ({ 'default': () => null }));
vi.mock('ui/home/LatestBlocks', () => ({ 'default': () => null }));
vi.mock('ui/home/Transactions', () => ({ 'default': () => null }));
vi.mock('ui/stats/lux/FeeSplitPanel', () => ({ 'default': () => null }));

import NetworkOverview from './NetworkOverview';

function pChainReads(): Array<string> {
  return fetchMock.mock.calls.map(([ input ]) => String(input)).filter((url) => url.startsWith('/v1/node/p-chain'));
}

describe('NetworkOverview', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ validators: [], blockchains: [], height: '0' }));
  });

  it('reads nothing about the Lux primary network on a brand explorer', async() => {
    host.primary = false;
    render(<NetworkOverview/>);
    await flushPromises();
    expect(pChainReads()).toEqual([]);
  });

  it('reads the validators, the chain list and the height on the Lux explorer', async() => {
    host.primary = true;
    render(<NetworkOverview/>);
    await waitFor(() => expect(new Set(pChainReads())).toEqual(new Set([
      '/v1/node/p-chain?op=validators',
      '/v1/node/p-chain?op=blockchains',
      '/v1/node/p-chain?op=height',
    ])));
  });
});
