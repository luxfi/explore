# Brand Audit — luxfi/explore

**Rule:** luxfi/explore committed source contains only Lux brand. Per-chain
identity for subnets on Lux primary network (Zoo, Hanzo, SPC, Pars) is
permitted as network metadata. No external-org explorer recipes, no Liquidity
references.

## Scope surveyed

- All committed source under `~/work/lux/explore/` (excluding `node_modules/`,
  `.next/`, `test-results/`, `qa-screenshots/`).
- Source globs: `*.{json,ts,tsx,js,jsx,md,yaml,yml,html,Dockerfile,env*}`.

## Findings

### Cross-brand recipes (REMOVED)

| Path | Why removed |
|------|-------------|
| `.env.example.hanzo` | Configured the image to be built and served as **Hanzo Explorer** under Hanzo's domain. That makes luxfi/explore a Hanzo brand surface — not allowed. |
| `.env.example.zoo` | Same as above for Zoo. |
| `.env.example.pars` | Same as above for Pars. |
| `Dockerfile.liquidity` | Liquidity is regulated US securities — must NEVER appear in OSS Lux. |

### Third-party-domain hostnames in `configs/app/chainRegistry.ts` (REMOVED)

Removed hostnames from the chain registry that asserted "this image, served
at the third-party org's canonical domain, IS that org's branded explorer":

- `explore.zoo.network`, `explore.zoo.ngo` (Zoo entry)
- `explore.hanzo.network`, `explore.hanzo.ai` (Hanzo entry)
- `explore.pars.network` (Pars entry)

Kept: `explore-{zoo,hanzo,spc,pars}.lux.network` — these are Lux-served
subnet explorer hosts where the chain identity (logo + name) is rendered as
network metadata for a chain running on the Lux primary network. That is the
per-chain branding the audit rules explicitly allow.

### Multi-brand selector (REWRITTEN)

`lib/white-label.ts` previously contained a hostname-suffix table mapping
`*.hanzo.ai`, `*.hanzo.network`, `*.zoo.ngo`, `*.zoo.network`,
`*.pars.network` to brand identifiers `hanzo`/`zoo`/`pars`. The intent was a
single image that becomes a different org's explorer based on serving host.

Replaced with: only Lux suffixes (`.lux.network`, `.lux.build`,
`.lux-test.network`, `.lux-dev.network`). External operators continue to be
supported via `NEXT_PUBLIC_BRAND=other` + `NEXT_PUBLIC_NETWORK_*` env vars
(see `.env.example.external`) — they supply their own brand strings at
deploy time; none are hardcoded here.

### Comment edits

- `lib/requestHost.ts`: dropped "Liquidity" from the multi-host narrative.

### Per-chain identity (KEPT — allowed)

- `configs/app/chainRegistry.ts` — `ZOO_BRANDING`, `HANZO_BRANDING`,
  `SPC_BRANDING`, `PARS_BRANDING` constants. These render as **chain
  identity** (which subnet this block / address belongs to) on
  `explore-{org}.lux.network` hosts. That's network metadata for chains
  running on Lux primary network, not a third-party brand on the explorer.
- `ui/chains/ChainDetailPage.tsx` `SUBNET_CHAIN_IDS` / `SUBNET_DESCRIPTIONS`
  maps — chain identity for subnets, kept.

### Generic finance terms (KEPT — not brand)

DeFi vocabulary that incidentally contains the substring "Liquidity":

- `ui/pool/PoolInfo.tsx`, `ui/pools/PoolsTable.tsx`,
  `ui/pools/PoolsListItem.tsx`, `ui/pages/Pool.tsx` — "Liquidity Provider",
  "Liquidity" column header.
- `stubs/token.ts` — `addLiquidity` method literal in transaction stub.
- `lib/api/dchain/useDexData.ts` — `totalLiquidity` field name.
- `ui/showcases/Tabs.tsx` — generic "Liquidity staking" tab demo.

None of these reference the regulated Liquidity brand or its parent entity.

## Federation manifest

Added `public/.well-known/explore.json` plus a generator at
`scripts/generate-well-known.js`. The generator parses
`configs/app/chainRegistry.ts` so the published federation manifest stays in
sync with the chain registry.

- Wired into `npm scripts`: `build`, `build:next`, `wellknown:generate`,
  `wellknown:check`.
- Mainnet chains emitted: C-Chain (Lux Mainnet) + Lux Testnet + Lux Devnet +
  Zoo/Hanzo/SPC/Pars subnets (chain identity, not org brand).
- `peers: []` is populated at runtime by a ConfigMap mount that overlays
  `public/.well-known/explore.json` in production; each deploy environment
  knows which other federation peers (Hanzo Explorer, Zoo Explorer, etc.)
  are reachable.

## Files touched

```
D  .env.example.hanzo
D  .env.example.pars
D  .env.example.zoo
D  Dockerfile.liquidity
M  configs/app/chainRegistry.ts
M  lib/requestHost.ts
M  lib/white-label.ts
M  package.json
A  public/.well-known/explore.json
A  scripts/generate-well-known.js
A  BRAND-AUDIT.md
```

## Follow-ups

1. Federation peers list — agree on the ConfigMap schema across Hanzo / Zoo /
   Pars explorer deployments; current `peers: []` placeholder is correct for
   build-time defaults.
2. `LUX_BRANDING_SETUP.md` still mentions an `nginx` reverse proxy and a
   `docker-luxnet` path that no longer exist. Rewrite next pass — not blocking.
3. `Dockerfile.branded` is a stale env-overlay image; superseded by
   `Dockerfile.lux`. Candidate for removal in a follow-up clean-up.
