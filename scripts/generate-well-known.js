#!/usr/bin/env node
/**
 * Generate public/.well-known/explore.json from configs/app/chainRegistry.ts.
 *
 * Run at build time so the federation manifest is always in sync with the
 * chains the explorer actually knows about. Output is byte-identical when
 * the registry hasn't changed (stable key order, trailing newline).
 *
 * Usage:
 *   node scripts/generate-well-known.js          # write public/.well-known/explore.json
 *   node scripts/generate-well-known.js --check  # exit 1 if file out of sync
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(REPO_ROOT, 'configs/app/chainRegistry.ts');
const OUT_PATH = path.join(REPO_ROOT, 'public/.well-known/explore.json');

/** Parse a minimal subset of chainRegistry.ts to extract { chainId, label, network } per CHAINS[] entry.
 *  Avoids running TypeScript at build time — the registry is hand-edited and stable enough for regex.
 */
function parseChainEntries(src) {
  const start = src.indexOf('export const CHAINS');
  if (start < 0) throw new Error('CHAINS export not found in chainRegistry.ts');
  const end = src.indexOf('];', start);
  if (end < 0) throw new Error('CHAINS export not terminated');
  const block = src.slice(start, end);

  // Match every chain object literal: { name: ..., label: ..., network: ..., chainId: <N>, ... }
  const entryRe = /name:\s*'([^']+)',[\s\S]*?label:\s*'([^']+)',[\s\S]*?network:\s*'([^']+)',[\s\S]*?chainId:\s*(\d+)/g;
  const entries = [];
  let m;
  while ((m = entryRe.exec(block)) !== null) {
    entries.push({ name: m[1], label: m[2], network: m[3], chainId: Number(m[4]) });
  }
  return entries;
}

/** Subnet display name. C-Chain (Contract Chain) is handled separately by
 *  the caller; for other chains use the short `name` field plus " Subnet". */
function normalizeSubnetName(rawName) {
  return `${ rawName.trim() } Subnet`;
}

/** Build the federation manifest. Mainnet chains only — testnet/devnet are operator-visible
 *  but not federation peers. Localnet is excluded entirely (chainId 1337 is reserved).
 */
function buildManifest(entries) {
  const chains = entries
    .filter((e) => e.network === 'mainnet')
    .map((e) => ({
      id: e.chainId,
      name: e.label === 'Contract Chain' ? 'Lux Mainnet' : normalizeSubnetName(e.name),
    }));

  // Always include explicit Lux Testnet/Devnet so peers can discover them.
  const testnet = entries.find((e) => e.network === 'testnet' && e.label === 'Contract Chain');
  const devnet = entries.find((e) => e.network === 'devnet' && e.label === 'Contract Chain');
  if (testnet) chains.splice(1, 0, { id: testnet.chainId, name: 'Lux Testnet' });
  if (devnet) chains.splice(2, 0, { id: devnet.chainId, name: 'Lux Devnet' });

  return {
    brandId: 'lux',
    appId: 'explore',
    title: 'Lux Explorer',
    domain: 'explore.lux.network',
    url: 'https://explore.lux.network',
    github: 'https://github.com/luxfi/explore',
    chains,
    peers: [],
    capabilities: [ 'blocks', 'transactions', 'accounts', 'tokens' ],
    apiVersion: '1',
  };
}

function main() {
  const src = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const manifest = buildManifest(parseChainEntries(src));
  const out = JSON.stringify(manifest, null, 2) + '\n';

  const check = process.argv.includes('--check');
  if (check) {
    const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : '';
    if (current !== out) {
      process.stderr.write(`${ path.relative(REPO_ROOT, OUT_PATH) } is out of sync. Run: node scripts/generate-well-known.js\n`);
      process.exit(1);
    }
    return;
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, out);
  process.stdout.write(`Wrote ${ path.relative(REPO_ROOT, OUT_PATH) } (${ manifest.chains.length } chains)\n`);
}

main();
