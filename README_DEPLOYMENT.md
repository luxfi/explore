# Blockchain Explorer Deployment Guide

This repository contains the frontend for blockchain explorers across the LUX ecosystem (LUX, ZOO, SPC, Hanzo networks).

## Architecture

Each network has its own GitHub fork of this repository:
- `luxfi/explore` - LUX Network explorer
- `luxfi/explore-zoo` - ZOO Network explorer  
- `luxfi/explore-spc` - SPC Network explorer
- `luxfi/explore-hanzo` - Hanzo Network explorer

## Configuration

### Minimal Changes Per Fork

Each fork only needs to modify:
1. **Environment variables** in `.env` or `compose.prod.yml`
2. **Favicon** in `public/favicon/favicon.png`
3. **Network logo URLs** in environment variables

### Font Configuration

All networks use Inter font by default. This is configured via environment variables:
```env
NEXT_PUBLIC_FONT_FAMILY_HEADING={"name": "Inter", "url": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"}
NEXT_PUBLIC_FONT_FAMILY_BODY={"name": "Inter", "url": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"}
```

Monospace fonts use Roboto Mono (hardcoded in `theme/foundations/typography.ts`).

### Network Dropdown

All explorers share a network dropdown configured via `public/networks.json`. This file lists all available networks across the ecosystem.

## Deployment

Each fork includes a `compose.prod.yml` file for production deployment:

```bash
# Deploy using Docker Compose
docker-compose -f compose.prod.yml up -d
```

### Traefik Integration

The compose file includes Traefik labels for automatic SSL and routing:
- `traefik.http.routers.[network]-explorer.rule=Host(\`explore.[network].network\`)`
- Automatic Let's Encrypt SSL certificates
- Requires external `traefik` network

### Example Deployment Commands

```bash
# Clone the appropriate fork
git clone https://github.com/luxfi/explore.git       # For LUX
git clone https://github.com/luxfi/explore-zoo.git   # For ZOO
git clone https://github.com/luxfi/explore-spc.git   # For SPC
git clone https://github.com/luxfi/explore-hanzo.git # For Hanzo

# Enter directory
cd explore

# Deploy
docker-compose -f compose.prod.yml up -d
```

## Maintenance

### Syncing with Upstream

To update from the upstream Blockscout repository:

```bash
# Add upstream remote (one time)
git remote add upstream https://github.com/blockscout/frontend.git

# Fetch and merge latest changes
git fetch upstream
git merge upstream/main

# Push to origin
git push origin main
```

### Building Custom Images

If you need to build a custom Docker image:

```bash
docker build -t luxfi/explorer-frontend:latest .
```

## Network-Specific Configuration

### LUX Network
- Domain: `explore.lux.network`
- Chain ID: 96369 (mainnet), 96368 (testnet)
- Currency: LUX

### ZOO Network
- Domain: `explore.zoo.network`
- Chain ID: 200200 (mainnet), 200201 (testnet)
- Currency: ZOO

### SPC Network
- Domain: `explore.spc.network`
- Chain ID: 36911 (mainnet), 36912 (testnet)
- Currency: SPC

### Hanzo Network
- Domain: `explore.hanzo.network`
- Chain ID: 36963 (mainnet), 36962 (testnet)
- Currency: HANZO

## Environment Variables

See `.env.example` for all available configuration options. Key variables:
- `NEXT_PUBLIC_NETWORK_*` - Network identification
- `NEXT_PUBLIC_API_HOST` - Backend API host
- `NEXT_PUBLIC_FEATURED_NETWORKS` - Path to networks dropdown config
- `NEXT_PUBLIC_COLOR_THEME_DEFAULT` - Theme (dark/light)
- `NEXT_PUBLIC_FONT_FAMILY_*` - Font configuration