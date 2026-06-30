import { describe, expect, it, beforeEach } from 'vitest';

import { isPrimaryNetworkExplorer } from './chainRegistry';
import {
  PRIMARY_VMS,
  getPrimaryVm,
  hasBespokeView,
  chainsAwaitingBespokeView,
} from './primaryChains';

// Drives the registry off a simulated request host, exactly like the browser
// (getHostname() reads window.location.hostname). Mirrors chainRegistry.spec.ts.
function atHost(hostname: string) {
  (globalThis as unknown as { window: unknown }).window = { location: { hostname }, __envs: {} };
}

describe('primary-network VM registry', () => {
  // The 10 VM chains the Lux primary network must expose + route (the build
  // directive). The registry is a superset (P/M/O/R/I as well), so we assert
  // the mandated 10 are all present with the right VM type.
  const REQUIRED = [
    { slug: 'c-chain', vm: 'EVM' },
    { slug: 'x-chain', vm: 'XVM' },
    { slug: 'd-chain', vm: 'DexVM' },
    { slug: 'a-chain', vm: 'AIVM' },
    { slug: 'z-chain', vm: 'ZKVM' },
    { slug: 'q-chain', vm: 'QuantumVM' },
    { slug: 'b-chain', vm: 'BridgeVM' },
    { slug: 'k-chain', vm: 'KeyVM' },
    { slug: 'g-chain', vm: 'GraphVM' },
    { slug: 't-chain', vm: 'ThresholdVM' },
  ];

  it.each(REQUIRED)('registers $slug as $vm', ({ slug, vm }) => {
    const entry = getPrimaryVm(slug);
    expect(entry).toBeDefined();
    expect(entry?.vm).toBe(vm);
  });

  it('exposes every VM at a unique slug routed under /chains/<slug>', () => {
    const slugs = PRIMARY_VMS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(PRIMARY_VMS.length).toBeGreaterThanOrEqual(REQUIRED.length);
  });

  it('resolves slugs case-insensitively', () => {
    expect(getPrimaryVm('D-Chain')?.slug).toBe('d-chain');
    expect(getPrimaryVm('C-CHAIN')?.slug).toBe('c-chain');
  });

  describe('each VM type maps to the correct render view', () => {
    it('D-Chain renders the DEX order-book UI (not an EVM block list)', () => {
      expect(getPrimaryVm('d-chain')?.view).toBe('dex');
    });
    it('C-Chain renders the EVM model', () => {
      expect(getPrimaryVm('c-chain')?.view).toBe('evm');
    });
    it('X-Chain renders the UTXO model', () => {
      expect(getPrimaryVm('x-chain')?.view).toBe('utxo');
    });
    it('P-Chain renders the platform/validators model', () => {
      expect(getPrimaryVm('p-chain')?.view).toBe('platform');
    });
    it('custom VMs (A/Z/Q/B/K/G/T) fall back to the generic view', () => {
      for (const slug of [ 'a-chain', 'z-chain', 'q-chain', 'b-chain', 'k-chain', 'g-chain', 't-chain' ]) {
        expect(getPrimaryVm(slug)?.view).toBe('generic');
      }
    });
  });

  describe('bespoke-view flag — what still needs a native explorer', () => {
    it('EVM / platform / DEX have a bespoke view today', () => {
      expect(hasBespokeView('evm')).toBe(true);
      expect(hasBespokeView('platform')).toBe(true);
      expect(hasBespokeView('dex')).toBe(true);
    });
    it('UTXO + generic still fall back (flagged backlog)', () => {
      expect(hasBespokeView('utxo')).toBe(false);
      expect(hasBespokeView('generic')).toBe(false);
    });
    it('flags X-Chain and the custom VMs, never C/P/D', () => {
      const flagged = chainsAwaitingBespokeView().map((c) => c.slug);
      expect(flagged).toEqual(expect.arrayContaining([ 'x-chain', 'a-chain', 'z-chain', 'q-chain', 'b-chain', 'k-chain', 'g-chain', 't-chain' ]));
      expect(flagged).not.toContain('c-chain');
      expect(flagged).not.toContain('p-chain');
      expect(flagged).not.toContain('d-chain');
    });
  });
});

// The primary-network VM surfaces (Chains / Chain detail / DEX nav + pages) are
// gated on isPrimaryNetworkExplorer(). This keystone proves the 10 VMs surface
// ONLY on the Lux explorer and never leak onto a brand explorer — the same
// predicate the nav and PrimaryNetworkGuard use.
describe('primary VMs surface only on the Lux primary explorer', () => {
  beforeEach(() => atHost('localhost'));

  it('shows the VM surfaces on the Lux explorer', () => {
    atHost('explore.lux.network');
    expect(isPrimaryNetworkExplorer()).toBe(true);
  });

  it.each([
    'explore.hanzo.network',
    'explore.zoo.network',
    'explore.pars.network',
    'explore.osage.network',
    'explore.unknown.example',
  ])('hides the VM surfaces on %s (no leak)', (host) => {
    atHost(host);
    expect(isPrimaryNetworkExplorer()).toBe(false);
  });
});
