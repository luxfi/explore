# LUX Network Explorer Branding Setup

This document explains how the LUX Network branding has been configured for the Blockscout explorer.

## Overview

The LUX Network explorer uses a custom Docker image with LUX branding applied via environment variables. The explorer is accessible at:
- Local: http://localhost:3000
- Production: https://explore.lux.network

## Key Components

### 1. Docker Image
- **Image**: `ghcr.io/luxfi/explore:latest`
- **Base**: Built on `ghcr.io/blockscout/frontend:latest`
- **Location**: GitHub Container Registry

### 2. Branding Elements
- **Network Name**: LUX Network
- **Symbol**: LUX (▼)
- **Chain ID**: 96369 (Mainnet)
- **Logo**: Downward-pointing black triangle (stored at `/public/logos/lux-logo-white.png`)

### 3. Configuration Files

#### Docker Compose (`/home/z/blockscout/docker-luxnet/frontend.yml`)
```yaml
services:
  frontend:
    image: ghcr.io/luxfi/explore:latest
    container_name: 'explore-lux'
    ports:
      - 3000:3000
    environment:
      - NEXT_PUBLIC_API_HOST=api-explore.lux.network
      - NEXT_PUBLIC_NETWORK_NAME=Lux Mainnet
      # ... other env vars
```

#### Production Environment (`.env.production`)
Contains all necessary environment variables for LUX branding:
- Network configuration
- API endpoints
- Logo paths
- Font configuration (Inter font)

### 4. GitHub Actions

The `.github/workflows/build-lux.yml` workflow automatically builds and pushes the Docker image when changes are pushed to:
- `main` branch
- `lux-branding` branch

**Required Secret**: `GH_PAT` (GitHub Personal Access Token with packages:write permission)

## Deployment

### Local Development
```bash
# Pull latest image
docker pull ghcr.io/luxfi/explore:latest

# Start the service
cd /home/z/blockscout
docker-compose -f docker-luxnet/frontend.yml up -d

# Check status
docker ps | grep explore-lux
```

### Production Deployment
The production deployment should use the same Docker image with appropriate production environment variables. Ensure the reverse proxy (nginx/cloudflare) is configured to serve explore.lux.network from port 3000.

## Known Issues

1. **Font Override**: The pre-built Blockscout image has hardcoded Poppins font references. To fully replace with Inter font, building from source is required.

2. **Logo Path**: The logo should be accessible at `/logos/lux-logo-white.png` but may need additional nginx configuration for proper serving.

3. **Monochromatic Theme**: Full theme customization requires building from source with modified Chakra UI configurations.

## Future Improvements

1. Build from source for complete control over fonts and theme
2. Implement full monochromatic Vercel-style theme
3. Add custom favicon with LUX triangle logo
4. Configure proper logo serving in production

## Commands Reference

```bash
# Check running container
docker ps | grep explore-lux

# View logs
docker logs explore-lux

# Restart service
docker-compose -f docker-luxnet/frontend.yml restart

# Rebuild and push image
docker build -f Dockerfile.branded -t ghcr.io/luxfi/explore:latest .
docker push ghcr.io/luxfi/explore:latest
```

## Support

For issues with the explorer, check:
1. Container logs: `docker logs explore-lux`
2. Network connectivity to API endpoints
3. Environment variable configuration
4. GitHub Actions build status