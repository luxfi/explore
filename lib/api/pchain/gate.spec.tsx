// @vitest-environment jsdom

// A chain whose node runs no P-Chain (Hanzo on hanzod) answers every platform.*
// read with "no such chain: P", so its explorer must not send them. Every
// P-Chain hook asks only where hasPChain() holds; which hosts those are is
// pinned in configs/app/chainRegistry.spec.ts.

import type * as ChainRegistry from 'configs/app/chainRegistry';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor, wrapper } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';

const host = vi.hoisted(() => ({ pChain: true }));

vi.mock('configs/app/chainRegistry', async(importOriginal) => ({
  ...(await importOriginal<typeof ChainRegistry>()),
  hasPChain: () => host.pChain,
}));

import { useBlockchains, useChainHeights, useCurrentValidators, useNets, useNetworkValidators } from '.';

const HOOKS = Object.entries({ useBlockchains, useChainHeights, useCurrentValidators, useNets, useNetworkValidators });

function nodeCalls(): Array<string> {
  return fetchMock.mock.calls.map(([ input ]) => String(input)).filter((url) => url.startsWith('/v1/node/p-chain'));
}

describe('P-Chain hooks', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ jsonrpc: '2.0', id: 1, result: {} }));
  });

  it.each(HOOKS)('%s sends nothing where there is no P-Chain', async(_, hook) => {
    host.pChain = false;
    renderHook(() => hook(), { wrapper });
    await flushPromises();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(HOOKS)('%s reads the P-Chain where there is one', async(_, hook) => {
    host.pChain = true;
    renderHook(() => hook(), { wrapper });
    await waitFor(() => expect(nodeCalls()).not.toHaveLength(0));
  });
});
