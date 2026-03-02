#!/usr/bin/env bash
# Warm up address balances by hitting the explorer API for each known address.
# This triggers the on-demand balance fetcher which queries at "latest" block.
set -euo pipefail

API="https://api-explore.lux.network/api/v2"
ADDR_FILE=$(mktemp)
UNIQUE_FILE=$(mktemp)
trap 'rm -f "$ADDR_FILE" "$UNIQUE_FILE"' EXIT

echo "=== Collecting addresses from tokens ==="
curl -sf "$API/tokens" \
  | python3 -c "
import json,sys
for t in json.load(sys.stdin).get('items',[]):
  h = t.get('address_hash')
  if h: print(h)
" 2>/dev/null >> "$ADDR_FILE" || true
token_count=$(wc -l < "$ADDR_FILE" | tr -d ' ')
echo "  Found $token_count addresses from tokens"

echo "=== Collecting addresses from transactions (5 pages, cursor-based) ==="
next_params=""
for page in 1 2 3 4 5; do
  if [ -z "$next_params" ]; then
    url="$API/transactions"
  else
    url="$API/transactions?$next_params"
  fi

  response=$(curl -sf "$url" 2>/dev/null) || { echo "  Page $page failed"; break; }

  echo "$response" | python3 -c "
import json,sys
for tx in json.load(sys.stdin).get('items',[]):
  f = tx.get('from')
  t = tx.get('to')
  if f and f.get('hash'): print(f['hash'])
  if t and t.get('hash'): print(t['hash'])
  cc = tx.get('created_contract')
  if cc and cc.get('hash'): print(cc['hash'])
" 2>/dev/null >> "$ADDR_FILE" || true

  next_params=$(echo "$response" | python3 -c "
import json,sys,urllib.parse
npp = json.load(sys.stdin).get('next_page_params')
if npp: print(urllib.parse.urlencode(npp))
else: print('')
" 2>/dev/null) || true

  printf "  Page %d done\n" "$page"
  [ -z "$next_params" ] && break
  sleep 0.1
done

echo "=== Collecting addresses from blocks (miners/validators) ==="
curl -sf "$API/blocks" \
  | python3 -c "
import json,sys
for b in json.load(sys.stdin).get('items',[]):
  m = b.get('miner')
  if m and m.get('hash'): print(m['hash'])
" 2>/dev/null >> "$ADDR_FILE" || true

# Deduplicate
sort -u "$ADDR_FILE" | grep -v '^$' > "$UNIQUE_FILE"
total=$(wc -l < "$UNIQUE_FILE" | tr -d ' ')
echo "=== Total unique addresses: $total ==="

echo "=== Warming up balances ==="
count=0
errors=0
while IFS= read -r addr; do
  [ -z "$addr" ] && continue
  count=$((count + 1))

  http_code=$(curl -sf -o /dev/null -w "%{http_code}" "$API/addresses/$addr" 2>/dev/null || echo "000")
  if [ "$http_code" != "200" ]; then
    errors=$((errors + 1))
  fi

  if [ $((count % 50)) -eq 0 ] || [ "$count" -eq "$total" ]; then
    printf "  Progress: %d/%d (errors: %d)\n" "$count" "$total" "$errors"
  fi
  sleep 0.1
done < "$UNIQUE_FILE"

printf "  Completed: %d/%d addresses warmed (errors: %d)\n" "$count" "$total" "$errors"

echo ""
echo "=== Checking accounts page ==="
curl -sf "$API/addresses?sort=balance&order=desc" \
  | python3 -c "
import json,sys
data = json.load(sys.stdin)
items = data.get('items',[])
print(f'Accounts with balance: {len(items)}')
for a in items[:10]:
  bal = int(a.get('coin_balance','0') or '0') / 1e18
  print(f'  {a[\"hash\"][:20]}... {bal:>20,.2f} LUX')
"

echo ""
echo "Done."
