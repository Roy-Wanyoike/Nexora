#!/bin/bash
# Comprehensive API test suite for Nexa Pay
set -e

BASE="http://localhost:3000"
AUTH="Authorization: Bearer nxp_test_8h2k9nbq01def456abc789"
JSON="Content-Type: application/json"

echo "=== 1. Happy path: valid payment ==="
RESP=$(curl -s -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" \
  -d '{"amount":500,"currency":"NGN","channel":"card","description":"Test"}' -w "\n%{http_code}")
CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
echo "HTTP: $CODE"
echo "Body: $(echo $BODY | head -c 200)"
echo ""

echo "=== 2. Validation: negative amount (expect 422) ==="
curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" \
  -d '{"amount":-500,"currency":"NGN"}'

echo ""
echo "=== 3. Validation: invalid currency (expect 422) ==="
curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" \
  -d '{"amount":500,"currency":"XYZ"}'

echo ""
echo "=== 4. Idempotency: same key + same body → same ID ==="
IDEM_KEY="test-key-$(date +%s)"
R1=$(curl -s -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" -H "Idempotency-Key: $IDEM_KEY" \
  -d '{"amount":300,"currency":"USD","channel":"card","description":"Idem test"}')
R2=$(curl -s -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" -H "Idempotency-Key: $IDEM_KEY" \
  -d '{"amount":300,"currency":"USD","channel":"card","description":"Idem test"}')
ID1=$(echo "$R1" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "ERR")
ID2=$(echo "$R2" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "ERR")
echo "ID 1: $ID1"
echo "ID 2: $ID2"
[ "$ID1" = "$ID2" ] && echo "RESULT: ✓ Idempotent (same ID)" || echo "RESULT: ✗ NOT idempotent (different IDs)"

echo ""
echo "=== 5. Idempotency: same key, different body → 409 conflict ==="
curl -s -o /dev/null -w "HTTP: %{http_code} (expect 409)\n" -X POST "$BASE/api/v1/payments" -H "$AUTH" -H "$JSON" -H "Idempotency-Key: $IDEM_KEY" \
  -d '{"amount":999,"currency":"USD","channel":"card","description":"Different body"}'

echo ""
echo "=== 6. Virtual card with invalid currency (expect 422) ==="
curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$BASE/api/v1/virtual-cards" -H "$AUTH" -H "$JSON" \
  -d '{"currency":"XYZ"}'

echo ""
echo "=== 7. Payroll with mixed currencies (expect 422) ==="
curl -s -o /dev/null -w "HTTP: %{http_code}\n" -X POST "$BASE/api/v1/payroll/runs" -H "$AUTH" -H "$JSON" \
  -d '{"schedule":"now","currency":"USD","items":[{"employee":"e1","amount":8400,"currency":"USD"},{"employee":"e2","amount":920000,"currency":"NGN"}]}'

echo ""
echo "=== 8. Audit log check: count entries ==="
curl -s "$BASE/api/v1/transactions?limit=1" -H "$AUTH" -o /dev/null -w "Transactions endpoint: %{http_code}\n"

echo ""
echo "=== Done ==="
