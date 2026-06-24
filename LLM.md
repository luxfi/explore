# Lux Network Explorer - AI Knowledge Base

**Last Updated**: 2024-12-24  
**Project**: explore  
**Organization**: luxfi  
**Upstream**: [blockscout/frontend](https://github.com/blockscout/frontend)

## Project Overview

Lux Network Explorer is a fork of Blockscout Frontend, customized for the Lux blockchain ecosystem. It provides a web-based interface for exploring blocks, transactions, addresses, tokens, and smart contracts on Lux Network chains (C-Chain, Zoo chains).

## Essential Commands

```bash
# Development
yarn dev              # Start dev server (runs tools/scripts/dev.sh)
yarn dev:preset       # Start with preset configuration
yarn build            # Production build
yarn build:docker     # Build Docker image
yarn start            # Start production server

# Linting & Testing
yarn lint:eslint      # Run ESLint
yarn lint:tsc         # TypeScript check
yarn test:pw          # Playwright tests
yarn test:pw:local    # Playwright tests locally

# Docker
docker compose up                    # Dev environment
docker compose -f compose.prod.yml up  # Production
```

## Architecture

```
explore/
├── pages/              # Next.js pages (file-based routing)
├── ui/                 # UI components by feature
│   ├── address/        # Address page components
│   ├── block/          # Block page components
│   ├── tx/             # Transaction page components
│   ├── token/          # Token page components
│   ├── shared/         # Shared components
│   └── snippets/       # Header, footer, navigation
├── lib/                # Core business logic
│   ├── api/            # API client & services
│   ├── hooks/          # React hooks
│   ├── contexts/       # React contexts
│   └── web3/           # Web3 integration
├── toolkit/            # UI toolkit (Chakra-based)
│   ├── components/     # Reusable components
│   ├── theme/          # Theme configuration
│   └── chakra/         # Chakra UI customization
├── configs/            # Configuration files
│   ├── app/            # App features config
│   └── envs/           # Environment presets
├── deploy/             # Deployment tools
│   ├── scripts/        # Build scripts
│   └── tools/          # Deployment utilities
├── mocks/              # Mock data for testing
├── stubs/              # API type stubs
├── types/              # TypeScript types
└── nextjs/             # Next.js configuration
```

## Key Technologies

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| UI Library | Chakra UI v3 |
| State | React Query (TanStack) |
| Web3 | wagmi, viem, RainbowKit |
| Testing | Playwright, Vitest |
| Styling | Emotion CSS-in-JS |
| Build | Turbopack |

## Configuration

### Environment Variables

Key environment variables (see `docs/ENVS.md` for full list):

```bash
NEXT_PUBLIC_NETWORK_NAME=Lux Network
NEXT_PUBLIC_NETWORK_ID=96369
NEXT_PUBLIC_NETWORK_RPC_URL=https://api.lux.network/ext/bc/C/rpc
NEXT_PUBLIC_API_HOST=https://explore.lux.network
NEXT_PUBLIC_APP_HOST=https://explore.lux.network
```

### Lux Branding

Lux-specific branding is configured in:
- `configs/app/ui/` - UI customization
- `public/logos/` - Logo assets
- `toolkit/theme/` - Theme colors

## Development Workflow

### Syncing with Upstream

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream into main
git merge upstream/main

# Resolve conflicts, preserving Lux branding
git add . && git commit
```

### Adding New Features

1. Check if feature exists in upstream Blockscout
2. If not, implement in `ui/` or `lib/` directories
3. Add TypeScript types in `types/`
4. Add mock data in `mocks/` for testing
5. Test with Playwright

### Lux-Specific Changes

Key Lux customizations:
- `ui/snippets/networkLogo/` - Lux logo component
- `toolkit/theme/foundations/` - Lux color palette
- `public/logos/` - Lux brand assets
- `Dockerfile.lux` - Lux-specific Docker build

## Chain Configuration

| Chain | Chain ID | Explorer URL |
|-------|----------|--------------|
| Lux Mainnet (C-Chain) | 96369 | explore.lux.network |
| Lux Testnet | 96368 | testnet.explore.lux.network |
| Zoo Mainnet | 200200 | zoo.explore.lux.network |
| Zoo Testnet | 200201 | zoo-testnet.explore.lux.network |

## API Integration

The explorer connects to:
- **Blockscout API**: Block/tx/address data
- **Stats API**: Chain statistics
- **RPC Node**: Direct chain queries

API services are in `lib/api/services/`.

## Context for AI Assistants

This file (`LLM.md`) is symlinked as:
- `AGENTS.md`
- `CLAUDE.md`  
- `QWEN.md`
- `GEMINI.md`

All symlinks reference this single source of truth.

## Rules for AI Assistants

1. **ALWAYS** update LLM.md with significant discoveries
2. **PRESERVE** Lux branding when merging upstream changes
3. **DO NOT** modify Blockscout-specific CI workflows
4. **USE** `yarn` for package management (not npm/pnpm)
5. **TEST** UI changes with Playwright before committing

## Recent Changes

### Investor-grade data: real validators + honest-empty stats/DEX (v1.0.11)
Removed every fabricated placeholder; data is now real-from-chain or honestly
empty, never faked. Root causes + fixes:
- **Validators/Stake = 0 was a proxy bug, not missing data.** P-chain
  `platform.getCurrentValidators` returns real validators (5, total weight
  2.5e18 on hanzo). `pages/api/pchain.ts` derived its base URL by stripping
  ONLY `/ext/bc/C/rpc` via regex; brand RPCs are `…/ext/bc/<chain>/rpc`
  (hanzo: `/ext/bc/hanzo/rpc`), so the regex no-op'd and the proxy POSTed to
  `…/ext/bc/hanzo/rpc/ext/bc/P` → HTML 404 → "Unexpected non-whitespace
  character after JSON at position 4" → 502. Fix: `new URL(rpcUrl).origin`
  (works for every brand) + defensive text→JSON parse with a clear error.
  `ui/stats/lux/NetworkStats.tsx` (Network Overview: Total Chains / Validators
  / Connected / Total Stake / Avg Uptime) already had honest `—` fallbacks and
  now renders REAL values. `lib/api/luxnet/instance.ts` was already safe (uses
  `new URL().hostname`), so B/D-Chain SDK calls were unaffected.
- **"Placeholder Counter 9.074M ×8"** came from `stubs/stats.ts` `STATS_COUNTER`
  (`value:'9074405', title:'Placeholder Counter'`) used as React-Query
  `placeholderData` in `ui/stats/NumberWidgetsList.tsx`. When the Blockscout
  **stats microservice** is absent (hanzo has NO `NEXT_PUBLIC_STATS_API_HOST`;
  every `api-explore.hanzo.network/api/v1|v2/*` 404s) the stub leaked as "real".
  Fix: neutralize the stub (`title:'', value:'0'`) AND gate the counters/charts
  in `ui/pages/Stats.tsx` on `config.features.stats.isEnabled` — show the live
  chain-sourced Network Overview always, with an honest "being indexed" note
  when no stats service. Aggregate counters (total txns/addresses, gas-used-
  today, history charts) genuinely need a stats indexer that isn't deployed.
- **DEX showed static demo numbers.** `lib/api/dchain/useDexData.ts` had
  hardcoded `DEMO_SYMBOLS/ORDERS/TRADES/POOLS/OVERVIEW` (LUX/USDT 24.85, etc.)
  served when the D-Chain (DexVM) is unavailable. Deleted ALL demo data → real
  D-Chain data or honest-empty; `ui/dex/DexPage.tsx` renders an honest empty/
  error message per tab.
- **Bridge signers = 0 is already honest** (`lib/api/bchain/useBridgeData.ts`
  returns real B-Chain signer set or `EMPTY_STATS`; B-Chain not yet reporting).
- **Homepage is already investor-grade**: real RPC blocks (#8–#13), tx hashes,
  gas (2.5 Gwei), Total blocks/txns/wallets — `ui/home/Stats.tsx` degrades to
  RPC when the general indexer errors; `HOMEPAGE_STATS` stub is placeholder-only.
- **Blockchain dropdown clipped its last item** ("Verified Contracts"):
  `@luxfi/ui` `Tooltip` `variant="popover"` Content defaults to
  `overflow-hidden px-3 py-2`, clipping a tall menu `<ul>`. Fixed at the
  consumer (`ui/snippets/navigation/horizontal/NavLinkGroup.tsx`) via
  `contentProps={{ className:'overflow-visible px-1.5 py-2' }}` (twMerge wins)
  + `placement:'bottom-start'`. No node_modules patch.
- Still needs a real indexer (honest-empty until then): aggregate Stats
  counters + history charts (Blockscout stats microservice), DEX live
  markets/orders/trades (DexVM indexer), Bridge signer set (B-Chain).
- Built v1.0.11 via the kaniko Job pattern (NO GHA) → `ghcr.io/{hanzoai,zooai,
  luxfi}/explore:v1.0.11`; deploy = image patch of `explore-fe-*` Deployments
  on do-sfo3-lux-k8s ns `lux-mainnet` (plain Deployments, not operator-managed).

### Validators page: visible in light mode + brand currency (v1.0.12)
v1.0.11 fetched REAL P-chain validators (5, total weight 2.5e18 on hanzo) but
a Playwright pass found the `/validators` view rendered **white-on-white in
light mode** — the data was present in the DOM yet invisible to users (only the
tab bar showed because it alone used `text-[var(--color-text-primary)]`). The
three custom Lux components (`ui/validators/lux/{ValidatorsDashboard,
ValidatorsList,DelegatorsList}.tsx`) set NO text color, so they inherited a
white color that doesn't flip with the theme. Fixes:
- Set `text-[var(--color-text-primary)]` on each component's root container —
  one place per component; the token flips per `styles/tokens.css` (light
  `rgba(16,17,18,.80)` / dark `rgba(255,255,255,.80)`), so all descendants now
  render the mode-correct color (dark on light, light on dark).
- Stake unit was hardcoded `LUX` on every brand; now `config.chain.currency.
  symbol || 'LUX'` (= `AI` on Hanzo) — matches `NetworkStats.tsx`'s pattern,
  DRY across all 6 stake labels in the three components.
- NOT changed: `formatStake` uses `LUX_DECIMALS = 6`, the codebase-wide
  convention (NetworkStats + ChainDetailPage use the same); P-chain
  `getMinStake` returns `minValidatorStake:2000000000` (= 2000 at 6dp),
  consistent with 6. (Three copies of this helper is a latent DRY violation to
  consolidate later, but the value is correct — left as-is to avoid drift.)
- `next.config.js` has `typescript.ignoreBuildErrors:true`; repo carries ~224
  pre-existing tsc errors (all in `*.pw.tsx` / unrelated) — build is unaffected.
  Dockerfile uses **pnpm** (not yarn). Edited files lint+typecheck clean.
- Built v1.0.12 via the kaniko Job (NO GHA) → `ghcr.io/{hanzoai,zooai,luxfi}/
  explore:v1.0.12`; deployed by image patch of `explore-fe-{hanzo,lux,zoo}` on
  do-sfo3-lux-k8s ns `lux-mainnet`. (Built on do-sfo3-hanzo-k8s ns `hanzo`.)

### Multi-brand hostname-driven header logo (explore v1.0.10)
- ONE image white-labels by request Host: `configs/app/chainRegistry.ts`
  `getCurrentChain()` resolves the chain (and its brand) from the hostname,
  and the header renders `chain.branding.logoContent` (an inline-SVG mark
  using `currentColor`). NO hardcoded logo, no image-URL→triangle fallback.
- Per-brand marks live in `chainRegistry.ts`: Lux = downward triangle
  (viewBox `0 0 100 100`), Hanzo = real blocky-H (`@hanzo/logo`, viewBox
  `0 0 67 67`, 5 paths — `M22.21 67…`), Zoo = interlocking circles
  (`0 0 1024 1024`), Pars = 8-pointed star, SPC = unicorn.
- The header logo renders in THREE spots, all reading `branding`:
  `ui/snippets/topBar/TopBar.tsx` (desktop), and
  `ui/snippets/networkLogo/{NetworkLogo,NetworkIcon}.tsx` (mobile header
  `ui/snippets/header/HeaderMobile.tsx` + chain-switcher). The stale
  pre-v1.0.10 mobile `NetworkIcon` hardcoded a `viewBox="0 0 50 50"`
  `<polygon>` triangle mislabeled `aria-label="Hanzo icon"` — fixed in
  4369780 (mobile) + 79dbe63 (desktop, single header per breakpoint).
- Multi-tenant L1/L2/L3: each `ChainEntry` has a `vm` field
  (`EVM` = Lux primary L1, `L2` = brand sovereign chains) gating
  `isPrimaryNetworkExplorer()` so brand explorers show ONLY their own chain.
  mainnet/testnet/devnet/localnet entries per brand; hostnames cover both
  canonical (`explore-<brand>.lux.network`) and brand-domain
  (`explore.<brand>.network`, `explore.hanzo.ai`) hosts.

### Build + deploy (NO GitHub builders)
- Built on-cluster via kaniko (do-sfo3-hanzo-k8s ns `hanzo`, node pool
  `runner-pool-32g`, secret `kaniko-ghcr-multi`, toleration
  `dedicated=ci-runner`): context `git://github.com/luxfi/explore.git#main`,
  `--dockerfile Dockerfile`, fan-out `--destination` to per-brand GHCR orgs
  `ghcr.io/{luxfi,zooai,hanzoai}/explore:v1.0.10` (one digest,
  `sha256:4f980291…`). pars (`ghcr.io/parsdao/explore`) not in the fan-out
  yet → stays v1.0.4.
- Runs on do-sfo3-lux-k8s ns `lux-mainnet` as `explore-fe-<brand>`
  Deployments (selector `{app:explore-fe,brand,network}`), env from
  `explore-env-<brand>` ConfigMap, pull secret `ghcr-luxfi`, svc 80→3000.
  NOT operator-managed (plain Deployments) → bump via image patch / apply.
  Declared state: `luxfi/universe k8s/lux-mainnet/explore-fe.yaml`
  (+ `k8s/lux-devnet/explore-fe.yaml`).
- App hydrates client-side (SSR HTML is an 8 KB shell) — verify the logo
  with a real browser (Playwright), not `curl | grep`.

### 2024-12-24
- Merged upstream blockscout/frontend (up to commit 5a49ad8b1)
- Updated branding from Blockscout to Lux Network
- Added logo assets

---

**Note**: This file is tracked in git. Update it when making significant architectural changes or discoveries about the codebase.
