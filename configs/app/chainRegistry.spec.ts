import { describe, expect, it, beforeEach } from 'vitest';

import {
  getChainsForNetwork,
  getCurrentChain,
  getCurrentNetwork,
  isPrimaryNetworkExplorer,
  isWhiteLabelMode,
} from './chainRegistry';

// Drives the registry off a simulated request host, exactly like the browser
// (getHostname() reads window.location.hostname). window.__envs is emptied so
// no NEXT_PUBLIC_* override leaks in — we assert the bundled defaults.
function atHost(hostname: string) {
  // Minimal browser global so isBrowser() is true and getHostname() reads the
  // simulated request host — no jsdom needed.
  (globalThis as unknown as { window: unknown }).window = { location: { hostname }, __envs: {} };
}

// Mirrors the pure logic of ui/snippets/topBar/ChainSwitcher.tsx: the lux
// primary (C-Chain) host shows every chain; a brand explorer shows only chains
// sharing its brand. Returns the chain names the switcher would render.
function switcherChainNames(): Array<string> {
  const current = getCurrentChain();
  const all = getChainsForNetwork(getCurrentNetwork().network);
  const isMain = current.name === 'C-Chain';
  return (isMain ? all : all.filter((c) => c.branding.brandName === current.branding.brandName)).map((c) => c.name);
}

describe('chain-visibility rule', () => {
  beforeEach(() => atHost('localhost'));

  describe('Lux primary explorer (explore.lux.network) = UNIVERSAL (shows everything)', () => {
    beforeEach(() => atHost('explore.lux.network'));

    it('is the primary-network explorer', () => {
      expect(isWhiteLabelMode()).toBe(false);
      expect(isPrimaryNetworkExplorer()).toBe(true);
      expect(getCurrentChain().name).toBe('C-Chain');
    });

    it('lists every sovereign L1 incl. Osage', () => {
      const names = switcherChainNames();
      expect(names).toEqual(expect.arrayContaining([ 'C-Chain', 'Zoo', 'Hanzo', 'SPC', 'Pars', 'Osage' ]));
    });
  });

  describe('Brand explorers = OWN-ONLY (no lux primary, no other orgs)', () => {
    const cases = [
      { host: 'explore.hanzo.network', name: 'Hanzo', brandName: 'Hanzo AI' },
      { host: 'explore.zoo.network', name: 'Zoo', brandName: 'Zoo Chain' },
      { host: 'explore.pars.network', name: 'Pars', brandName: 'Pars Network' },
      { host: 'explore.osage.network', name: 'Osage', brandName: 'Osage' },
    ];

    it.each(cases)('$host is a registered L2, NOT the primary explorer (no leak)', ({ host, brandName }) => {
      atHost(host);
      expect(isWhiteLabelMode()).toBe(false);
      expect(isPrimaryNetworkExplorer()).toBe(false);
      expect(getCurrentChain().vm).toBe('L2');
      expect(getCurrentChain().branding.brandName).toBe(brandName);
    });

    it.each(cases)('$host switcher shows ONLY its own chain (no lux-primary, no other orgs)', ({ host, name }) => {
      atHost(host);
      expect(switcherChainNames()).toEqual([ name ]);
    });

    it('pars uses its deployed chainId 7070 (not the stale 494949)', () => {
      atHost('explore.pars.network');
      expect(getCurrentChain().chainId).toBe(7070);
    });
  });

  describe('keystone: unregistered white-label hosts are NEVER the primary explorer', () => {
    it('does not leak the lux primary network to an unknown host', () => {
      atHost('explore.unknown.example');
      expect(isWhiteLabelMode()).toBe(true);
      expect(isPrimaryNetworkExplorer()).toBe(false);
    });
  });
});
