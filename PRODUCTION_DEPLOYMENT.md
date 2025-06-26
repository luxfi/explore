# Production Deployment Guide for LUX Explorer

## Current Status
- ✅ Docker image built and pushed to `ghcr.io/luxfi/explore:latest`
- ✅ GitHub Actions workflow configured and working
- ❌ Production site (https://explore.lux.network) still showing old UI

## Steps to Deploy to Production

### 1. SSH to Production Server
```bash
ssh <production-server>
```

### 2. Update Docker Image
```bash
# Pull the latest LUX-branded image
docker pull ghcr.io/luxfi/explore:latest

# Or if using docker-compose
docker-compose pull frontend
```

### 3. Update Configuration
Ensure the production docker-compose.yml or deployment configuration uses:
```yaml
services:
  frontend:
    image: ghcr.io/luxfi/explore:latest
    environment:
      - NEXT_PUBLIC_API_HOST=api-explore.lux.network
      - NEXT_PUBLIC_API_PROTOCOL=https
      - NEXT_PUBLIC_APP_HOST=explore.lux.network
      - NEXT_PUBLIC_APP_PROTOCOL=https
      # ... other production env vars
```

### 4. Restart Services
```bash
# Using docker-compose
docker-compose down && docker-compose up -d

# Or using docker directly
docker stop <container-name>
docker rm <container-name>
docker run -d --name explore-lux \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_HOST=api-explore.lux.network \
  -e NEXT_PUBLIC_API_PROTOCOL=https \
  ghcr.io/luxfi/explore:latest
```

### 5. Verify Deployment
- Check container is running: `docker ps | grep explore`
- Test locally: `curl http://localhost:3000`
- Verify production: https://explore.lux.network

## Automated Deployment (Future)

To automate production deployments, consider:

1. **Webhook Deployment**
   - Set up a webhook receiver on production server
   - Trigger deployment when GitHub Action completes

2. **CD Pipeline**
   - Use GitHub Actions to SSH and deploy
   - Or integrate with deployment platforms (Vercel, Railway, etc.)

3. **Container Orchestration**
   - Use Kubernetes with automatic image updates
   - Or Docker Swarm with update policies

## Environment Variables for Production

```env
NEXT_PUBLIC_NETWORK_NAME=LUX Network
NEXT_PUBLIC_NETWORK_SHORT_NAME=LUX
NEXT_PUBLIC_NETWORK_ID=96369
NEXT_PUBLIC_NETWORK_CURRENCY_NAME=LUX
NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL=LUX
NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS=18
NEXT_PUBLIC_API_HOST=api-explore.lux.network
NEXT_PUBLIC_API_PROTOCOL=https
NEXT_PUBLIC_APP_HOST=explore.lux.network
NEXT_PUBLIC_APP_PROTOCOL=https
NEXT_PUBLIC_IS_TESTNET=false
NEXT_PUBLIC_NETWORK_LOGO=/logos/lux-logo-white.png
NEXT_PUBLIC_NETWORK_LOGO_DARK=/logos/lux-logo-white.png
```

## Monitoring

After deployment, monitor:
- Container logs: `docker logs -f explore-lux`
- Resource usage: `docker stats explore-lux`
- Application metrics: Check API response times
- User reports: Monitor for any issues

## Rollback Plan

If issues occur:
```bash
# Quick rollback to previous image
docker pull ghcr.io/blockscout/frontend:latest
docker stop explore-lux
docker run -d --name explore-lux-temp \
  -p 3000:3000 \
  ghcr.io/blockscout/frontend:latest

# Then investigate and fix issues
```