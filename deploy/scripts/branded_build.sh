#!/usr/bin/env bash
# Build all per-brand × per-env Blockscout overlay images and push to the
# brand-owning GHCR namespace. Lux → ghcr.io/luxfi/, Zoo → ghcr.io/zooai/,
# Hanzo → ghcr.io/hanzoai/, Pars → ghcr.io/parsdao/. Per ~/.claude/CLAUDE.md:
# brand images live in the brand's org, never mixed across orgs.
#
# Build is delegated to a Kaniko pod (no Docker on the dev machine). Caller
# passes --kubectl-context and --namespace; the script tars the build
# context and submits one Kaniko pod per tuple.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DOCKERFILE="${ROOT}/Dockerfile.branded"
VERSION="${VERSION:-v1.0.0}"

# Per-tuple build args. Format:
#   BRAND ENV IMAGE_REPO -- key=value ...
# Note: this matches what the Dockerfile ARGs expect.

tuples() {
  cat <<'EOF'
lux mainnet ghcr.io/luxfi/explore-mainnet
lux testnet ghcr.io/luxfi/explore-testnet
zoo mainnet ghcr.io/zooai/explore-mainnet
zoo testnet ghcr.io/zooai/explore-testnet
hanzo mainnet ghcr.io/hanzoai/explore-mainnet
hanzo testnet ghcr.io/hanzoai/explore-testnet
pars mainnet ghcr.io/parsdao/explore-mainnet
pars testnet ghcr.io/parsdao/explore-testnet
EOF
}

build_args_for() {
  local brand="$1" env="$2"
  local is_testnet="false"; [ "$env" = "testnet" ] && is_testnet="true"
  case "${brand}-${env}" in
    lux-mainnet)
      cat <<'EOF'
NETWORK_NAME=Lux Network
NETWORK_SHORT_NAME=LUX
NETWORK_ID=96369
NETWORK_CURRENCY_NAME=LUX
NETWORK_CURRENCY_SYMBOL=LUX
NETWORK_RPC_URL=https://api.lux.network/ext/bc/C/rpc
API_HOST=api-explore.lux.network
APP_HOST=explore.lux.network
NETWORK_ORG_NAME=Lux Industries Inc.
NETWORK_WEBSITE_URL=https://lux.network
NETWORK_DESCRIPTION=High-performance blockchain for decentralized applications.
NETWORK_GITHUB_URL=https://github.com/luxfi
NETWORK_TWITTER_URL=https://x.com/luxdefi
NETWORK_DISCORD_URL=https://discord.gg/luxnetwork
OIDC_SERVER_URL=https://lux.id
OIDC_CLIENT_ID=lux-explore-client-id
EOF
      ;;
    lux-testnet)
      cat <<'EOF'
NETWORK_NAME=Lux Testnet
NETWORK_SHORT_NAME=LUX
NETWORK_ID=96368
NETWORK_CURRENCY_NAME=LUX
NETWORK_CURRENCY_SYMBOL=LUX
NETWORK_RPC_URL=https://api.lux-test.network/ext/bc/C/rpc
API_HOST=api-explorer.lux-test.network
APP_HOST=explorer.lux-test.network
NETWORK_ORG_NAME=Lux Industries Inc.
NETWORK_WEBSITE_URL=https://lux.network
NETWORK_DESCRIPTION=Lux Testnet — staging for the Lux Network.
NETWORK_GITHUB_URL=https://github.com/luxfi
NETWORK_TWITTER_URL=https://x.com/luxdefi
NETWORK_DISCORD_URL=https://discord.gg/luxnetwork
OIDC_SERVER_URL=https://lux.id
OIDC_CLIENT_ID=lux-explore-client-id
EOF
      ;;
    zoo-mainnet)
      cat <<'EOF'
NETWORK_NAME=Zoo Network
NETWORK_SHORT_NAME=ZOO
NETWORK_ID=200200
NETWORK_CURRENCY_NAME=Zoo
NETWORK_CURRENCY_SYMBOL=ZOO
NETWORK_RPC_URL=https://api.zoo.network/ext/bc/zoo/rpc
API_HOST=api-explore.zoo.network
APP_HOST=explore.zoo.network
NETWORK_ORG_NAME=Zoo Labs Foundation
NETWORK_WEBSITE_URL=https://zoo.network
NETWORK_DESCRIPTION=Zoo Network — decentralized AI research blockchain.
NETWORK_GITHUB_URL=https://github.com/zooai
NETWORK_TWITTER_URL=https://x.com/zoo_network
NETWORK_DISCORD_URL=https://discord.gg/zoonetwork
OIDC_SERVER_URL=https://zoo.id
OIDC_CLIENT_ID=zoo-explore-client-id
EOF
      ;;
    zoo-testnet)
      cat <<'EOF'
NETWORK_NAME=Zoo Testnet
NETWORK_SHORT_NAME=ZOO
NETWORK_ID=200201
NETWORK_CURRENCY_NAME=Zoo
NETWORK_CURRENCY_SYMBOL=ZOO
NETWORK_RPC_URL=https://api.zoo-test.network/ext/bc/zoo/rpc
API_HOST=api-explorer.zoo-test.network
APP_HOST=explorer.zoo-test.network
NETWORK_ORG_NAME=Zoo Labs Foundation
NETWORK_WEBSITE_URL=https://zoo.network
NETWORK_DESCRIPTION=Zoo Testnet — staging for Zoo Network.
NETWORK_GITHUB_URL=https://github.com/zooai
NETWORK_TWITTER_URL=https://x.com/zoo_network
NETWORK_DISCORD_URL=https://discord.gg/zoonetwork
OIDC_SERVER_URL=https://zoo.id
OIDC_CLIENT_ID=zoo-explore-client-id
EOF
      ;;
    hanzo-mainnet)
      cat <<'EOF'
NETWORK_NAME=Hanzo Network
NETWORK_SHORT_NAME=AI
NETWORK_ID=36963
NETWORK_CURRENCY_NAME=AI
NETWORK_CURRENCY_SYMBOL=AI
NETWORK_RPC_URL=https://api.hanzo.network/ext/bc/hanzo/rpc
API_HOST=api-explore.hanzo.network
APP_HOST=explore.hanzo.network
NETWORK_ORG_NAME=Hanzo AI Inc.
NETWORK_WEBSITE_URL=https://hanzo.ai
NETWORK_DESCRIPTION=Hanzo Network — AI infrastructure blockchain.
NETWORK_GITHUB_URL=https://github.com/hanzoai
NETWORK_TWITTER_URL=https://x.com/hanzoai
NETWORK_DISCORD_URL=https://discord.gg/hanzoai
OIDC_SERVER_URL=https://hanzo.id
OIDC_CLIENT_ID=hanzo-explore-client-id
EOF
      ;;
    hanzo-testnet)
      cat <<'EOF'
NETWORK_NAME=Hanzo Testnet
NETWORK_SHORT_NAME=AI
NETWORK_ID=36962
NETWORK_CURRENCY_NAME=AI
NETWORK_CURRENCY_SYMBOL=AI
NETWORK_RPC_URL=https://api.hanzo-test.network/ext/bc/hanzo/rpc
API_HOST=api-explorer.hanzo-test.network
APP_HOST=explorer.hanzo-test.network
NETWORK_ORG_NAME=Hanzo AI Inc.
NETWORK_WEBSITE_URL=https://hanzo.ai
NETWORK_DESCRIPTION=Hanzo Testnet — staging for Hanzo Network.
NETWORK_GITHUB_URL=https://github.com/hanzoai
NETWORK_TWITTER_URL=https://x.com/hanzoai
NETWORK_DISCORD_URL=https://discord.gg/hanzoai
OIDC_SERVER_URL=https://hanzo.id
OIDC_CLIENT_ID=hanzo-explore-client-id
EOF
      ;;
    pars-mainnet)
      cat <<'EOF'
NETWORK_NAME=Pars Network
NETWORK_SHORT_NAME=PARS
NETWORK_ID=7070
NETWORK_CURRENCY_NAME=Pars
NETWORK_CURRENCY_SYMBOL=PARS
NETWORK_RPC_URL=https://api.pars.network/ext/bc/pars/rpc
API_HOST=api-explore.pars.network
APP_HOST=explore.pars.network
NETWORK_ORG_NAME=Pars DAO
NETWORK_WEBSITE_URL=https://pars.network
NETWORK_DESCRIPTION=Pars Network — Persian community L1 blockchain.
NETWORK_GITHUB_URL=https://github.com/parsdao
NETWORK_TWITTER_URL=https://x.com/parsdao
NETWORK_DISCORD_URL=https://discord.gg/parsdao
OIDC_SERVER_URL=https://pars.id
OIDC_CLIENT_ID=pars-explore-client-id
EOF
      ;;
    pars-testnet)
      cat <<'EOF'
NETWORK_NAME=Pars Testnet
NETWORK_SHORT_NAME=PARS
NETWORK_ID=7071
NETWORK_CURRENCY_NAME=Pars
NETWORK_CURRENCY_SYMBOL=PARS
NETWORK_RPC_URL=https://api.pars-test.network/ext/bc/pars/rpc
API_HOST=api-explorer.pars-test.network
APP_HOST=explorer.pars-test.network
NETWORK_ORG_NAME=Pars DAO
NETWORK_WEBSITE_URL=https://pars.network
NETWORK_DESCRIPTION=Pars Testnet — staging for Pars Network.
NETWORK_GITHUB_URL=https://github.com/parsdao
NETWORK_TWITTER_URL=https://x.com/parsdao
NETWORK_DISCORD_URL=https://discord.gg/parsdao
OIDC_SERVER_URL=https://pars.id
OIDC_CLIENT_ID=pars-explore-client-id
EOF
      ;;
    *) echo "unknown tuple ${brand}-${env}" >&2; exit 1;;
  esac
  printf 'BRAND=%s\nIS_TESTNET=%s\n' "$brand" "$is_testnet"
}

print_tuples_only() {
  tuples | while read brand env repo; do
    [ -z "$brand" ] && continue
    echo "${brand} ${env} ${repo}:${VERSION}"
  done
}

if [ "${1:-}" = "--list" ]; then
  print_tuples_only
  exit 0
fi

if [ "${1:-}" = "--build-args" ] && [ -n "${2:-}" ] && [ -n "${3:-}" ]; then
  build_args_for "$2" "$3"
  exit 0
fi

echo "usage: $0 --list" >&2
echo "       $0 --build-args BRAND ENV" >&2
exit 1
