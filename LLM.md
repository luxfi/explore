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

### 2024-12-24
- Merged upstream blockscout/frontend (up to commit 5a49ad8b1)
- Updated branding from Blockscout to Lux Network
- Added logo assets

---

**Note**: This file is tracked in git. Update it when making significant architectural changes or discoveries about the codebase.
