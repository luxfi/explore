# Lux Network Explorer

Fork of [blockscout/frontend](https://github.com/blockscout/frontend).

## What This Is

Block explorer frontend for Lux Network C-Chain. Minimal fork -- upstream code plus Lux branding/config.

## Customizations Over Upstream

Only these files differ from upstream:
- `.github/workflows/build-lux.yml` -- CI to build `ghcr.io/luxfi/explore`
- `configs/envs/.env.lux` -- Lux mainnet env
- `configs/envs/.env.lux_testnet` -- Lux testnet env
- `LLM.md`, `CLAUDE.md`, `AGENTS.md` -- AI docs

All branding (logo, colors, footer) is via env vars at deploy time, not code changes.

## Syncing Upstream

```bash
git fetch upstream
git merge upstream/main
# Should be conflict-free since we don't modify upstream files
```

## Build

```bash
pnpm install
pnpm build
```

## Docker

CI builds `ghcr.io/luxfi/explore:{branch}` on push to main/dev/test.

## Network Config

| Network | Chain ID | RPC |
|---------|----------|-----|
| Mainnet | 96369 | api.lux.network/ext/bc/C/rpc |
| Testnet | 96368 | api.lux-test.network/ext/bc/C/rpc |
