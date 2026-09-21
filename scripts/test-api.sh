#!/bin/bash
# Comprehensive API test suite for Nexa Pay.
# Run after `bun run dev` is up on port 3000 (or after `bun run scripts/seed.ts`).
#
# Assertions fail the script when expected HTTP codes don't match — set -e
# combined with explicit `assert_code` calls catches regressions.
set -euo pipefail

BASE="${BASE_URL:-http://localhost:3000}"
AUTH="Authorization: Bearer nxp_test_8h2k9nbq01def456abc789"
JSON="Content-Type: application/json"

# assert_code <expected> <actual> <label>
assert_code() {
  local expected="$1" actual="$2" label="$3"
  if [ "$actual" = "$expected" ]; then
    echo "  ✓ $label — got $actual"
  else
    echo "  ✗ $label — expected $expected, got $actual"
    exit 1
  fi
}

echo "=== 1. Happy path: valid payment (expect 201) ==="
RESP=$(curl -s -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" \
  -d '{"amount":500,"currency":"NGN","channel":"card","description":"Test"}' -w "\n%{http_code}")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
echo "  Body: $(echo "$BODY" | head -c 200)"
assert_code 201 "$CODE" "POST /payments returns 201"

echo ""
echo "=== 2. Validation: negative amount (expect 422) ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" \
  -d '{"amount":-500,"currency":"NGN"}')
assert_code 422 "$CODE" "negative-amount rejected"

echo ""
echo "=== 3. Validation: invalid currency (expect 422) ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" \
  -d '{"amount":500,"currency":"XYZ"}')
assert_code 422 "$CODE" "invalid-currency rejected"

echo ""
echo "=== 4. Idempotency: same key + same body → same ID ==="
IDEM_KEY="test-key-$(date +%s)"
R1=$(curl -s -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" -H "Idempotency-Key: $IDEM_KEY" \
  -d '{"amount":300,"currency":"USD","channel":"card","description":"Idem test"}')
R2=$(curl -s -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" -H "Idempotency-Key: $IDEM_KEY" \
  -d '{"amount":300,"currency":"USD","channel":"card","description":"Idem test"}')
ID1=$(echo "$R1" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "ERR")
ID2=$(echo "$R2" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "ERR")
echo "  ID 1: $ID1"
echo "  ID 2: $ID2"
if [ "$ID1" = "$ID2" ] && [ "$ID1" != "ERR" ]; then
  echo "  ✓ Idempotent (same ID)"
else
  echo "  ✗ NOT idempotent (different IDs)"
  exit 1
fi

echo ""
echo "=== 5. Idempotency: same key, different body → 409 conflict ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" -H "Idempotency-Key: $IDEM_KEY" \
  -d '{"amount":999,"currency":"USD","channel":"card","description":"Different body"}')
assert_code 409 "$CODE" "idempotency-key collision returns 409"

echo ""
echo "=== 6. Virtual card with invalid currency (expect 422) ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/virtual-cards" -H "$AUTH" -H "$JSON" \
  -d '{"currency":"XYZ"}')
assert_code 422 "$CODE" "invalid-card-currency rejected"

echo ""
echo "=== 7. Payroll with mixed currencies (expect 422) ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payroll/runs" -H "$AUTH" -H "$JSON" \
  -d '{"schedule":"now","currency":"USD","items":[{"employee":"e1","amount":8400,"currency":"USD"},{"employee":"e2","amount":920000,"currency":"NGN"}]}')
assert_code 422 "$CODE" "mixed-currency payroll rejected"

echo ""
echo "=== 8. Transactions endpoint (expect 200) ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/v1/transactions?limit=1" -H "$AUTH")
assert_code 200 "$CODE" "GET /transactions returns 200"

echo ""
echo "=== 9. Health endpoint (expect 200) ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/health")
assert_code 200 "$CODE" "GET /health returns 200"

echo ""
echo "=== 10. Auth: missing API key → 401 ==="
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments" -H "$JSON" \
  -d '{"amount":500,"currency":"NGN"}')
assert_code 401 "$CODE" "missing API key rejected"

echo ""
echo "=== All API smoke tests passed ✓ ==="
