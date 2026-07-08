#!/usr/bin/env bash
# Build 4 canonical, brand-only Blockscout overlay images. One image per brand —
# env-specific config (NETWORK_ID, IS_TESTNET, API_HOST, …) lives in K8s
# ConfigMaps and lands on the pod via Deployment `envFrom`. Brand identity
# (NETWORK_NAME, OIDC client ID, currency, brand colors) is baked here.
#
# Outputs:
#   ghcr.io/luxfi/explore:v1.0.0
#   ghcr.io/zooai/explore:v1.0.0
#   ghcr.io/hanzoai/explore:v1.0.0
#   ghcr.io/parsdao/explore:v1.0.0
#
# Replaces the older 8-image `explore-{env}` scheme. See env-specific
# ConfigMaps under deploy/k8s/explore-fe/configmap-*.yaml.

set -euo pipefail

VERSION="${VERSION:-v1.0.0}"
BASE_IMAGE="${BASE_IMAGE:-ghcr.io/luxfi/explore:latest}"

TMPDIR_BASE="${TMPDIR:-/tmp}/canonical-build-$$"
mkdir -p "$TMPDIR_BASE"
trap "rm -rf '$TMPDIR_BASE'" EXIT

# Per-brand identity. Values that must vary by env (NETWORK_ID, IS_TESTNET,
# API_HOST, RPC_URL, APP_HOST) are intentionally OMITTED here — they come
# from ConfigMaps at runtime via Deployment `envFrom`.
brands() {
  cat <<'EOF'
lux   ghcr.io/luxfi/explore
zoo   ghcr.io/zooai/explore
hanzo ghcr.io/hanzoai/explore
pars  ghcr.io/parsdao/explore
EOF
}

brand_args_for() {
  case "$1" in
    lux)
      cat <<'EOF'
NEXT_PUBLIC_BRAND=lux
NEXT_PUBLIC_NETWORK_NAME=Lux Network
NEXT_PUBLIC_NETWORK_SHORT_NAME=LUX
NEXT_PUBLIC_NETWORK_CURRENCY_NAME=LUX
NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL=LUX
NEXT_PUBLIC_NETWORK_ORG_NAME=Lux Industries Inc.
NEXT_PUBLIC_NETWORK_WEBSITE_URL=https://lux.network
NEXT_PUBLIC_NETWORK_DESCRIPTION=High-performance blockchain for decentralized applications.
NEXT_PUBLIC_NETWORK_GITHUB_URL=https://github.com/luxfi
NEXT_PUBLIC_NETWORK_TWITTER_URL=https://x.com/luxdefi
NEXT_PUBLIC_NETWORK_DISCORD_URL=https://discord.gg/luxnetwork
NEXT_PUBLIC_OIDC_SERVER_URL=https://lux.id
NEXT_PUBLIC_OIDC_CLIENT_ID=lux-explore-client-id
EOF
      ;;
    zoo)
      cat <<'EOF'
NEXT_PUBLIC_BRAND=zoo
NEXT_PUBLIC_NETWORK_NAME=Zoo Network
NEXT_PUBLIC_NETWORK_SHORT_NAME=ZOO
NEXT_PUBLIC_NETWORK_CURRENCY_NAME=Zoo
NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL=ZOO
NEXT_PUBLIC_NETWORK_ORG_NAME=Zoo Labs Foundation
NEXT_PUBLIC_NETWORK_WEBSITE_URL=https://zoo.network
NEXT_PUBLIC_NETWORK_DESCRIPTION=Zoo Network — decentralized AI research blockchain.
NEXT_PUBLIC_NETWORK_GITHUB_URL=https://github.com/zooai
NEXT_PUBLIC_NETWORK_TWITTER_URL=https://x.com/zoo_network
NEXT_PUBLIC_NETWORK_DISCORD_URL=https://discord.gg/zoonetwork
NEXT_PUBLIC_OIDC_SERVER_URL=https://zoo.id
NEXT_PUBLIC_OIDC_CLIENT_ID=zoo-explore-client-id
EOF
      ;;
    hanzo)
      cat <<'EOF'
NEXT_PUBLIC_BRAND=hanzo
NEXT_PUBLIC_NETWORK_NAME=Hanzo Network
NEXT_PUBLIC_NETWORK_SHORT_NAME=AI
NEXT_PUBLIC_NETWORK_CURRENCY_NAME=AI
NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL=AI
NEXT_PUBLIC_NETWORK_ORG_NAME=Hanzo AI Inc.
NEXT_PUBLIC_NETWORK_WEBSITE_URL=https://hanzo.ai
NEXT_PUBLIC_NETWORK_DESCRIPTION=Hanzo Network — AI infrastructure blockchain.
NEXT_PUBLIC_NETWORK_GITHUB_URL=https://github.com/hanzoai
NEXT_PUBLIC_NETWORK_TWITTER_URL=https://x.com/hanzoai
NEXT_PUBLIC_NETWORK_DISCORD_URL=https://discord.gg/hanzoai
NEXT_PUBLIC_OIDC_SERVER_URL=https://hanzo.id
NEXT_PUBLIC_OIDC_CLIENT_ID=hanzo-explore-client-id
EOF
      ;;
    pars)
      cat <<'EOF'
NEXT_PUBLIC_BRAND=pars
NEXT_PUBLIC_NETWORK_NAME=Pars Network
NEXT_PUBLIC_NETWORK_SHORT_NAME=PARS
NEXT_PUBLIC_NETWORK_CURRENCY_NAME=Pars
NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL=PARS
NEXT_PUBLIC_NETWORK_ORG_NAME=Pars DAO
NEXT_PUBLIC_NETWORK_WEBSITE_URL=https://pars.network
NEXT_PUBLIC_NETWORK_DESCRIPTION=Pars Network — Persian community L1 blockchain.
NEXT_PUBLIC_NETWORK_GITHUB_URL=https://github.com/parsdao
NEXT_PUBLIC_NETWORK_TWITTER_URL=https://x.com/parsdao
NEXT_PUBLIC_NETWORK_DISCORD_URL=https://discord.gg/parsdao
NEXT_PUBLIC_OIDC_SERVER_URL=https://pars.id
NEXT_PUBLIC_OIDC_CLIENT_ID=pars-explore-client-id
EOF
      ;;
    *) echo "unknown brand: $1" >&2; return 1;;
  esac
  # Common, brand-invariant runtime defaults that don't vary per env.
  cat <<'EOF'
NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS=18
NEXT_PUBLIC_API_PROTOCOL=https
NEXT_PUBLIC_API_BASE_PATH=/
NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL=wss
NEXT_PUBLIC_APP_PROTOCOL=https
NEXT_PUBLIC_NETWORK_LOGO=/logo.svg
NEXT_PUBLIC_NETWORK_ICON=/icon.svg
NEXT_PUBLIC_HOMEPAGE_CHARTS=["daily_txs","coin_price","market_cap"]
NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED=true
NEXT_PUBLIC_COLOR_THEME_DEFAULT=dark
NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER=oidc
NEXT_TELEMETRY_DISABLED=1
ENVS_PRESET=none
SKIP_ENVS_VALIDATION=true
EOF
}

if [ "${1:-}" = "--list" ]; then
  brands | while read -r brand target; do
    [ -z "${brand:-}" ] && continue
    echo "${brand} ${target}:${VERSION}"
  done
  exit 0
fi

if [ "${1:-}" = "--brand-args" ] && [ -n "${2:-}" ]; then
  brand_args_for "$2"
  exit 0
fi

FAIL=""
SUCCESS=""

while read -r brand target; do
  [ -z "${brand:-}" ] && continue
  full="${target}:${VERSION}"
  echo "=== ${brand} → ${full} ==="

  # Step 1: mutate process env for child processes (Next.js server reads via env).
  env_flags=()
  brand_kv="$(brand_args_for "$brand")"
  while IFS='=' read -r k v; do
    [ -z "$k" ] && continue
    env_flags+=("-e" "${k}=${v}")
  done <<< "$brand_kv"

  # Mutate to a temp tag, then append a /app/.env overlay so Blockscout's
  # entrypoint `source .env` exports brand identity vars into the shell
  # before make_envs_script.sh iterates env. ConfigMap-supplied env vars
  # (NETWORK_ID, IS_TESTNET, *_HOST, RPC_URL) are NOT in .env so they
  # come from process env at runtime, which the iteration also picks up.
  tmp_image="ghcr.io/luxfi/explore-tmp:${brand}-$$"
  if ! crane mutate "$BASE_IMAGE" "${env_flags[@]}" -t "$tmp_image" 2>&1 | tail -1; then
    FAIL="${FAIL}${full}: mutate-failed
"
    continue
  fi

  # Step 2: build a layer tar containing /app/.env with brand identity values.
  tuple_dir="${TMPDIR_BASE}/${brand}"
  mkdir -p "${tuple_dir}/app"
  while IFS='=' read -r k v; do
    [ -z "$k" ] && continue
    # JSON-array vals like NEXT_PUBLIC_HOMEPAGE_CHARTS need single-quoting
    # so bash `source` preserves the embedded double quotes.
    if [[ "$v" == \[* ]]; then
      echo "$k='$v'"
    else
      echo "$k=$v"
    fi
  done <<< "$brand_kv" > "${tuple_dir}/app/.env"

  tarfile="${tuple_dir}/layer.tar"
  tar -C "$tuple_dir" -cf "$tarfile" app

  if ! crane append -b "$tmp_image" -f "$tarfile" -t "$full" 2>&1 | tail -1; then
    FAIL="${FAIL}${full}: append-failed
"
    continue
  fi

  digest=$(crane digest "$full" 2>/dev/null || echo "?")
  SUCCESS="${SUCCESS}${full}@${digest}
"
  echo "OK: ${full}@${digest}"
done < <(brands)

echo
echo "=== Canonical brand images ==="
printf '%s' "$SUCCESS" | sed 's/^/  + /'
if [ -n "$FAIL" ]; then
  echo "Failed:"
  printf '%s' "$FAIL" | sed 's/^/  - /'
  exit 1
fi
