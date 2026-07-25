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
4. **USE** `pnpm` for package management (repo is `packageManager: pnpm@10.11.0`; npm/yarn break the `@hanzogui` overrides)
5. **TEST** UI changes with Playwright before committing

## Recent Changes

### Shell overflow + white-on-white values + broken Menu button (v1.1.12)
Three write-once-deploy-4 root causes from the 4-breakpoint UI audit. Built
on-cluster (buildkit Job in `hanzo-build` ns on do-sfo3-hanzo-k8s
runner-pool-32g, git-context clone of `luxfi/explore#main`), fanned out with
`crane` to ghcr.io/{luxfi,zooai,hanzoai,parsdao}/explore:v1.1.12 (same digest
`sha256:223b3ca2…`), rolled to all four explore-fe-* on lux-k8s/lux-mainnet.
**Verified LIVE (Playwright/Chromium) 4 brands × {390,768,1280,1920}, 16/16
pass**: `document.scrollWidth == innerWidth` everywhere, all four home values
≥4.5:1, Menu button 32px (lg+)/40px (mobile) with no clip, zero hamburgers at
lg+ (1 at <lg = the correct mobile nav trigger).

- **Horizontal overflow (454px @1280, 38px @1920).** `Container.tsx` forced
  `min-w-[100vw] lg:min-w-[fit-content]`, which promoted the whole page to its
  ~1734px max-content width (the `MainColumn` grow shell measured 1734 at 1280)
  so stat/block cards clipped past the viewport. Fix: fluid column —
  `Container` → `w-full min-w-0`, and `MainColumn` gains `min-w-0` so the flex
  chain shrinks and the block-row `overflow-x-auto` scrolls internally instead
  of pushing the page. docSW 1734→1280 / 1958→1920 verified.
- **White-on-white values** (block Reward / tx Value / tx Fee /
  network-utilization%, all computed `rgb(255,255,255)` @1.04:1). Root cause:
  legacy Chakra dot-tokens (`color="text.secondary"`, `green.600`…) were passed
  straight into an inline CSS `color`, which browsers drop as invalid → the text
  inherited white. Fix: one `lib/utils/colorToken.ts` `resolveColorToken()`
  (dot-token → `var(--color-*)`) applied in `SimpleValue` (the value chokepoint
  for Reward/Value/Fee → `#737373` = 4.54:1 on the `#FAFAFA` card bg), plus new
  semantic status vars `--color-status-good/warn/bad` (#1A7A47/#B45309/#B91C1C
  light = 5.1/4.8/6.1:1; light shades for dark) that
  `getNetworkUtilizationParams` now returns (utilization = 5.13:1).
  NOTE: `@luxfi/ui` `Skeleton` sets `style.color = props.color` verbatim — pass
  it a CSS value/var, never a Chakra dot-token. ~160 `color="x.y"` call sites
  remain repo-wide; funnel value colors through `SimpleValue`.
- **Broken "Menu" button** (`UserWalletButton.tsx`): icon+label were stacked in
  a bare `<div>` (20px icon over ~20px text) inside a 32px `overflow:hidden`
  button → the "51px in 32px" clip that read as a stray hamburger at lg+. Fix:
  `flex items-center gap-2` + sized icon (`w-5 h-5 shrink-0`). Lux shows "Sign
  in" instead (OIDC auth) — that path was never broken.

### Org explorers un-stubbed + mobile detail pages fixed (v1.1.10)
Two mobile-QA defects across the block explorers. **DEPLOYED + VERIFIED**: image
built on-cluster via buildkit (a Job on do-sfo3-hanzo-k8s
runner-pool-32g — NO GHA; GitHub Actions is disabled for the account) from
commit 7e35a0a, fanned out with `crane` to ghcr.io/{luxfi,zooai,hanzoai,
parsdao}/explore:v1.1.10 (same digest 6f7c19d0), rolled to all four
explore-fe-* on lux-k8s/lux-mainnet. Verified 390px: docSW==390 (no clip),
labels legible, tab strip scrolls (sw 945, no overlap); desktop 1280px
unchanged; org branding intact (explore.zoo.network = Zoo, networkId 200200,
frontend 1.1.10). CI note: build-lux.yml only builds/deploys luxfi and its
deploy job is currently broken (expired DigitalOcean token → doctl 401);
org rollout is the buildkit+crane path above.

- **Defect 1 (org explorers showed goerli stub data, not their real chains).**
  Root cause was purely TLS: `api-explore.{zoo,hanzo,pars}.network` served the
  self-signed `CN=INGRESS DEFAULT CERT` (no cert-manager Ingress for those SNIs,
  only lux had one). Real browsers reject it → every FE data fetch fails →
  react-query falls back to the `stubs/` placeholders (block #8988736, "Stub
  Token (goerli)") behind stuck skeletons. The FE wiring was already correct
  (configmaps point at `api-explore.<org>.network` + right chainId) and the
  backend already serves real per-chain data — the unified `explorer` pod has
  all 6 chains (`{"chains":6}`) and the org IngressRoutes route by Host /
  `blockscout-prefix-<brand>` → `/v1/indexer/<slug>` (proven: cchain 1.09M
  blocks, zoo 13,381, hanzo 11, pars 63). Fix = add a dedicated cert-manager
  `letsencrypt-prod` Ingress per org api host → `explorer-unified:8090`,
  mirroring `api-explore-lux-network` (declared in `ingress-api-mainnet.yaml`,
  in the kustomize resources). Certs issued in ~60s; all three now
  `ssl_verify=0`. **If an org explorer ever goes blank/stubs again, check
  `kubectl -n lux-mainnet get certificate api-explore-<org>-network-tls` first.**
  The `@luxfi/ui` browser (Playwright) ignores TLS errors, so it renders real
  data even when the cert is bad — verify Defect-1-class bugs with a REAL
  cert-enforcing client (openssl/curl without -k), not the MCP browser.

- **Defect 2 (mobile 390px detail pages: dropped labels, horizontal clip, tab
  overlap).** Three shared-UI fixes (fix all 4 explorers at once):
  - *Labels invisible* was the v1.1.9 white-on-white color fix (already landed);
    deploying v1.1.10 to the org images (they ran v1.0.14) is what makes it show.
  - *Horizontal clip* — the real page-overflow driver at 390px was the FOOTER,
    not the field rows. `ui/snippets/footer/Footer.tsx` used inline
    `gridTemplateColumns: 'minmax(auto,470px) 1fr'` + `repeat(colNum,160px)` with
    no mobile breakpoint → a 470px column past the 390 viewport. Made it
    `grid-cols-1 lg:grid-cols-[minmax(auto,470px)_1fr]` (single column on mobile;
    links `grid-cols-2` via a `--footer-cols` CSS var for the desktop count).
    docSW 486→390 verified on a fresh `next dev` render.
  - *Detail values* — `DetailedInfo.ItemValue` forced `whitespace-nowrap` with no
    `min-w-0`, so a long address/hash couldn't shrink and its dynamic shortener
    (`HashStringShortenDynamic`, which sizes off its parent width) never bounded.
    Added `min-w-0 whitespace-normal break-words overflow-x-hidden lg:whitespace-nowrap
    lg:overflow-x-visible` — desktop unchanged.
  - *Tab bar overlap/collide* — **`@luxfi/ui` `TabsList`/`TabsTrigger` silently
    DISCARD all Chakra style props** (`overflowX`, `w`, `mx`, `css` scroll-snap,
    `flexShrink`, sticky…): they destructure them to `_overflowX` etc. and only
    forward `className`/`style`. So the mobile scroll + `flexShrink={0}` the
    consumer passed never applied → triggers shrank and collided, no scroll.
    Fixed at the consumer (`AdaptiveTabsList.tsx`): express the mobile scroll as
    Tailwind `className` on TabsList (`overflow-x-auto snap-x -mx-3 px-3
    w-[calc(100%+24px)] lg:…`) and `className="shrink-0 snap-start"` on triggers.
    Verified: tab strip becomes a scroll container (sw 373→921) with no overlap.
    NOTE for future work: any Chakra-style prop on `@luxfi/ui` Tabs is a no-op —
    use `className`. `DetailedInfo.Container`'s `templateColumns` prop is likewise
    dropped (hardcoded grid); mobile is already single-column so it's benign.
  - Dev caveat: `next dev` crashes tab pages in `AdaptiveTabsMenu` (pre-existing
    dev-only `icons/dots.svg`/popover import resolving to object); prod build is
    fine. Verify tab/detail rendering on the deployed prod URL, footer on dev.

### api-explore.lux.network TLS cert fix — explorer data now loads (infra)
The explorer FE was stuck in skeleton loaders ("0/5 CONNECTED", no blocks/txns)
because **every** `api-explore.lux.network` request failed in the browser with
`ERR_CERT_AUTHORITY_INVALID`. Root cause: the explorer Go backend answers by
Host header via the ingress default backend, so the API responded (200) even
with **no ingress rule** for that host — but with no TLS block for that SNI the
controller served the self-signed `CN=INGRESS DEFAULT CERT`, which browsers
reject. (`curl -k` worked; a real browser did not.) A stale
`api-explore-lux-network-tls` secret existed but nothing referenced/renewed it.
Fix: a dedicated Ingress for `api-explore.lux.network` → `explorer-unified:8090`
with a `letsencrypt-prod` TLS block (mirrors the working
`api-explore.osage.network`). cert-manager issued a real LE cert (CN=YR2) in
~60s; `curl ssl_verify_result=0`. Verified live (Playwright): explore.lux.network
now renders 1.09M blocks, 16.9k txns, live blocks + real tx hashes.
Declared in `deploy/k8s/explore-fe/ingress-api-mainnet.yaml` (in the kustomize
resources) so it survives redeploys. **If explorer data ever goes blank, check
this ingress + its cert first** (`kubectl -n lux-mainnet get certificate
api-explore-lux-network-tls`). Sibling brands (hanzo/pars/spc) have api-explore
TLS secrets too — if their explorers go blank, they likely need the same
dedicated api-explore ingress.

### Native all-chains wallet, lux.id login, menu/panel fix, real deploy path (v1.1.6)
Four owner-reported UI fixes + the deploy/runtime wiring to actually ship them.
(v1.1.4 shipped a crash; v1.1.5 fixed it; v1.1.6 fixes the chain switcher.)
Verified live on explore.lux.network (Playwright): homepage + /blocks render with
live blocks; header menus/panels open with solid backgrounds; Sign in → lux.id
login page; chain switcher lists Lux/Zoo/Hanzo/SPC/Pars/Osage.

- **Chain switcher didn't open (v1.1.6).** ChainSwitcher put onClick={handleToggle}
  on the PopoverTrigger button, double-toggling against PopoverTrigger's own
  handler (net: stays closed) — no chains were selectable. Removed the redundant
  onClick + unused handleToggle (match UserProfileDesktop's pattern).

**Flagged, NOT fixed here (need owner input / secrets):**
- **Wallet connect is disabled**: blockchainInteraction only enables when
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is set (a real reown/WalletConnect
  projectId, a vault secret per deploy/values/*.gotmpl). It's absent in the Lux
  configmap → no wallet-connect UI. brandFamilyChains (the code side of fix c)
  is in place; enable by adding the projectId secret. Don't use a placeholder.
- **Homepage intermittently error-boundaries** ("length" of undefined, after an
  async update) — pre-existing (old build too); recovers on reload; header + all
  other pages unaffected. No source maps, couldn't pin the exact widget.
- **CI deploy job**: build succeeds on ARC; the deploy job's KMS/DO-token step
  still needs the DO token (fixed set -e / jq aborts + DIGITALOCEAN_ACCESS_TOKEN
  fallback). Deploy is done via `kubectl set image explore-fe-lux …:sha-<short>`
  (the documented method) meanwhile.

- **App-crash fix (v1.1.4 regression).** v1.1.4 changed `useProvider` to return
  `null` (react-query v5 forbids `undefined`) but only switched the `lib/web3`
  hooks; four UI consumers still did `const { data: { wallet } = {} } =
  useProvider()`. `= {}` defaults only `undefined`, not `null`, so `null` data
  crashed them → whole-page error boundary once account/OIDC put a wallet-using
  popover in the header. Fixed to `useProvider().data ?? {}` in ChainWidget,
  MultichainEcosystemsTableItem, NetworkAddToWallet, AddressAddToWallet.

- **Menu / floating panels (the big visible break).** The prior build threw
  ~7k `setReference` crashes — every popover/menu/drawer (chain switcher,
  sign-in, mobile nav) rendered transparent (page bled through). Two causes: duplicate
  `@hanzogui/*` React contexts (pinned to one 3.0.2 instance) and Tailwind v4
  not scanning `@luxfi/ui` so the panel-surface utilities were purged. Fix:
  `@hanzogui` pins + `@source "../node_modules/@luxfi/ui"` in `nextjs/global.css`
  + a `--color-popover-border` token.
- **Wallet / all-chains.** `lib/web3/chains.ts` derives `brandFamilyChains`
  from `configs/app/chainRegistry` (+ matching wagmi transports); header
  `ChainSwitcher` lists every registry chain on the primary C-Chain explorer.
  `useProvider` returns `null` not `undefined` (react-query v5 crashed the
  wallet hooks — that also broke the menu).
- **lux.id login is RUNTIME config, not code.** The account feature is gated on
  env that was never in the deployed ConfigMap, so no sign-in button appeared.
  Enabled on `explore-env-lux` (lux-mainnet) + `deploy/k8s/explore-fe/configmap-mainnet.yaml`:
  `IS_ACCOUNT_SUPPORTED=true`, `ACCOUNT_AUTH_PROVIDER=oidc`,
  `OIDC_SERVER_URL=https://lux.id`, `OIDC_CLIENT_ID=lux-explore-client-id`
  (issuer live; authorize `https://lux.id/v1/iam/oauth/authorize`).
- **Deploy path (was broken).** explore.lux.network is served by Deployment
  `explore-fe-lux` (ns `lux-mainnet`, `ghcr.io/luxfi/explore:sha-<short>`,
  IfNotPresent). `build-lux.yml` builds on the `lux-build` ARC pool; the deploy
  job now `kubectl set image explore-fe-lux` to the freshly built sha + waits on
  rollout — it previously restarted a non-existent `lux-frontend-mainnet` and
  its KMS `DO_API_TOKEN` fetch returned empty (deploys silently skipped). Added
  a `DIGITALOCEAN_ACCESS_TOKEN` fallback; footer version now from package.json.
- **Manifest.** `scripts/generate-well-known.js` regenerates
  `public/.well-known/explore.json` at build; now emits `<Brand> Network`, never
  "Subnet".

**chainId reconciliation + RPC → /v1 (v1.1.7):** registry now matches the LIVE
chains AND the canonical genesis source of truth
(`~/work/lux/genesis/configs/lp182_chain_id_map.go`, the LP-018 (family,env)→
EVMChainID map). One value, one way.
- **Pars mainnet 494949** (was the stale 7070) — `api.pars.network` reports
  `eth_chainId=0x78d65` / `net_version=494949`. Pars **testnet 494950**, **devnet
  494951** (were 7071/7072) — matches the LP-018 map's 4949xx theme. Note the LP-018
  map itself was ALSO stale on Pars mainnet (7070) and was corrected to 494949 in
  the genesis repo; testnet/devnet 494950/494951 were already canonical there.
- **Lux devnet 96367** (was the stale 96370) — `api.lux-dev.network` reports
  96367. Canonical Lux: mainnet 96369 / testnet 96368 / devnet 96367.
- `chainRegistry.spec.ts` now asserts Pars **494949** (was the stale-7070 assert).
- Fixed in: `configs/app/chainRegistry.ts`, `chainRegistry.spec.ts`,
  `public/.well-known/explore.json`, `lib/web3/chains.ts` (comment),
  `deploy/k8s/explore-fe/configmap-{mainnet,testnet}.yaml`,
  `deploy/scripts/branded_build.sh`, `tools/send_test_txs.py`.
- **Chain RPC migrated `/ext/bc/<alias>/rpc` → `/v1/bc/C/rpc`** (gateway canonical;
  every sovereign L1 exposes its own C-Chain at `/v1/bc/C/rpc`, so zoo/hanzo/pars
  drop their old brand-aliased `/ext/bc/{zoo,hanzo,pars}/rpc` paths — which were
  already 404ing). Verified returning blocks BEFORE switching: Lux/Zoo/Hanzo/Pars
  **mainnet** + Lux **testnet**. Deliberately still on `/ext` (their `/v1` gateway
  route is not up yet — do NOT switch until a block returns): Lux **devnet**,
  Zoo/Hanzo/Pars **testnet**, and the local-node compose + `send_test_txs.py`
  URLs (raw luxd serves `/ext` natively, no gateway). P-chain proxy
  (`pages/api/pchain.ts`) now dials `/v1/bc/P` (verified). `useChainHeights.ts`
  and `luxnet/instance.ts` no longer strip `/ext/bc/C/rpc`: they use the env RPC
  URL (or its origin) directly, so the C-chain height widget + luxnet SDK work
  under either path scheme.

### Chain-visibility + 10-VM/DEX handling (v1.0.14)
Two orthogonal correctness fixes shipped in one build cycle.

- **Chain-visibility rule (PR #7):** `isPrimaryNetworkExplorer()` now requires
  `!isWhiteLabelMode() && vm === 'EVM'`, so unregistered/brand hosts stop
  rendering the Lux primary panels + cross-L1 list. Registered
  `explore.zoo.network`/`.ngo` + `explore.pars.network` as own-scoped L2s
  (brand parity with Hanzo), added **Osage** L1, and set Pars chainId (interim
  **7070**, since reconciled → **494949** in v1.1.7 above). Rule: **lux explorer =
  ALL chains; hanzo/zoo/pars = ONLY their own.**
  Proven by `configs/app/chainRegistry.spec.ts` (12 cases).
- **10-VM / DEX handling:** the Lux primary network is a family of VM-specialized
  chains (C=EVM, X=UTXO, D=DEX, P=platform, + A/B/Q/T/Z/G/K/O/R/I/M), mirrored
  from `~/work/lux/node/node/vms.go`. New single source of truth
  `configs/app/primaryChains.ts` (`PRIMARY_VMS`, `getPrimaryVm`, `view`,
  `hasBespokeView`, `chainsAwaitingBespokeView`) **decomplects** the two lists
  that used to duplicate this (ChainsPage / ChainDetailPage now consume it).
  Each VM routes at `/chains/<slug>`; `view` selects the render:
  - **D-Chain → the DEX order-book UI** (`ui/dex/DexPage`, wired to the indexer
    `./dex` adapter via `lib/api/dchain`) — `ChainDetailPage` renders `<DexPage/>`
    for `view: 'dex'`, not a generic block list.
  - **C-Chain** = the EVM explorer core; **P-Chain** = platform/validators data;
    **X-Chain** + the custom VMs (A/B/Q/T/Z/G/K/O/R/I/M) render the generic
    chain-detail fallback (info + indexer DAG stats + validators) — they do NOT
    crash/blank. `chainsAwaitingBespokeView()` FLAGS the backlog: **X-Chain
    (UTXO) and the 11 custom VMs still need a bespoke explorer view**; only
    C/P/D have one today.
- **VMs are Lux-primary → lux-only:** the primary-VM surfaces (Chains / DEX /
  Bridge / AI Compute nav + the `/chains`, `/chains/[slug]`, `/dex` pages) are
  gated on `isPrimaryNetworkExplorer()`. Nav hides them on brand/white-label
  hosts; `ui/shared/PrimaryNetworkGuard` backstops direct-URL access so the 10
  VMs can never leak onto Hanzo/Zoo/Pars. Proven by
  `configs/app/primaryChains.spec.ts` (26 cases).
- **Build/deploy:** single multi-destination kaniko Job (NO GHA), context
  `git://github.com/luxfi/explore.git#main`, Dockerfile (base Next.js build),
  fan-out `--destination=ghcr.io/{luxfi,zooai,hanzoai,parsdao}/explore:v1.0.14`
  (parsdao ADDED — it had no v1.0.1x image). White-label is 100% runtime via the
  `explore-env-{brand}` configmaps (APP_HOST), not baked per-brand. Deploy = bump
  all four `explore-fe-*` images to v1.0.14 in
  `luxfi/universe k8s/lux-mainnet/explore-fe.yaml`, operator reconcile.

### Realtime transport: Phoenix WebSocket → SSE (v1.0.13)
- **Bug:** the FE connected realtime via Phoenix Channels
  (`wss://api-explore.lux.network/socket/v2/websocket`), but the Go backend
  (`luxfi/explorer`) serves **no** Phoenix endpoint — its realtime is **SSE**
  at `/v1/base/realtime` (multiplexed, envelope `{event, chain, data}`, initial
  `event: CONNECT`, `: ping` keep-alive). Result: repeating `ws 404` →
  "Live updates temporarily delayed". This is a frontend-only transport
  mismatch; the chain/indexer are untouched.
- **Fix:** `lib/socket/sse.ts` reimplements the slice of the Phoenix
  `Socket`/`Channel` API the 27 realtime consumers use, backed by ONE
  `EventSource`. The seam is unchanged — `SocketProvider` / `useSocketChannel`
  / `useSocketMessage` and every consumer keep working; only the transport
  underneath swapped. No more `phoenix` import in app code.
- **Routing:** envelope `{event, chain, data, topic?}`. With `topic` →
  delivered straight to that channel/event (scoped `addresses:*`/`tokens:*`,
  and the component-test harness). Without → the `TRANSLATIONS` table maps the
  backend hub channel to a Blockscout `(topic, event)`; today the indexer
  broadcasts only `blocks` → `blocks:new_block` / `new_block`. `join()` resolves
  `ok` on stream open; EventSource auto-reconnects. URL normaliser collapses any
  `wss://…/socket*` (or test `ws://host:port`) to `<https>/v1/base/realtime`.
- **Tests:** `lib/socket/sse.spec.ts` (12 vitest cases, all green) covers URL
  normalisation, blocks→new_block translation, direct-topic routing, join `ok`,
  on/off, onError, disconnect. CT harness `playwright/fixtures/socketServer.ts`
  is now a tiny SSE server (same `createSocket`/`joinChannel`/`sendMessage`
  signatures) so the 12 consumer specs are unchanged.
- **Still owner-gated (separate, NOT this fix):** data freshness on
  explore.lux.network is blocked on the C-Chain rollback + indexer reorg
  handling — no fresh blocks flow until that lands. When it does, align the
  EVMBlock→Blockscout `Block` field shapes in the `blocks` translation (or have
  the backend emit Blockscout-shaped blocks); that is the only remaining piece
  and it can only be verified end-to-end once data flows again.

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

### Cleanup
- **Removed** 8 stale `*.orig`/`*.bak` backups (~1.9 MB) left by the Blockscout→Lux
  rebrand commits; two still carried raw `<<<<<<< HEAD` conflict markers. Nothing
  referenced them. `*.orig`/`*.rej`/`*.bak` are now in `.gitignore` (upstream's had
  `*.orig`; the fork dropped it, which is how they got committed).

---

**Note**: This file is tracked in git. Update it when making significant architectural changes or discoveries about the codebase.
