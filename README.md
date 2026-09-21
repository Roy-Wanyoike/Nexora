# Nexa Pay — One switch for every payment

> The African payment switch platform. Centralize cards, foreign accounts (USD/GBP/EUR/CNY), crypto, eSIM, payroll, and developer APIs in one dashboard.

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **Prisma**, and **shadcn/ui**.

---

## ✨ Features

### Consumer / Business App
- **Centralized payments** — one dashboard for every card, wallet, and bank account
- **Foreign accounts** — real USD (routing + ACH/wire/SWIFT), GBP (sort code + Faster Payments), EUR (IBAN + SEPA), CNY (CNAPS/CIPS)
- **Virtual cards** — USD & NGN virtual cards in seconds, with freeze/limits/per-merchant controls
- **Crypto** — buy, hold, send USDC / USDT / PYUSD stablecoins; convert to NGN
- **eSIM** — data plans in 190+ countries
- **Bills & top-ups** — airtime, data, electricity, DStv/GOtv/StarTimes
- **Piggy savings** — auto-save, locked vaults up to 12% APY
- **Business** — multi-currency payroll, payment links, payout links, spend analytics

### Developer Gateway
- **REST API** (`/api/v1/*`) with Bearer auth
- **8 core endpoints**: payments, payment-links, virtual-cards, foreign-accounts, payouts, transactions, payroll/runs, webhooks/verify (plus api-keys, auth, KYC, fraud/score, routing, sandbox-key, health)
- **API key management** — create/revoke test & live keys (master-key protected)
- **HMAC-signed webhooks** — 8 event types, per-endpoint secrets, exponential backoff
- **SDKs** — cURL, JavaScript, Python, PHP, Go code samples
- **Live endpoint explorer** — send real requests against the DB

### Design
- **Color palette**: deep navy (`oklch(0.16 0.035 255)`) + light green (`oklch(0.88 0.18 145)`) + pale grey (`oklch(0.78 0.010 220)`)
- **Aurora background** — animated particle canvas with drifting gradient blobs
- **Dark/Light theme** with auto time-of-day detection
- **Fully responsive** — mobile, tablet, desktop

---

## 🚀 Quick start

```bash
# 1. Install dependencies
bun install

# 2. Copy env and fill in values
cp env.example .env
# Edit .env with your keys

# 3. Create the database
bun run db:push

# 4. Seed demo data (2 API keys, customer, cards, accounts, transactions, payroll run)
bun run scripts/seed.ts

# 5. Start dev server
bun run dev
```

Open http://localhost:3000 (or the preview URL in your sandbox).

### Test API keys (from seed)

```
Test: nxp_test_8h2k9nbq01def456abc789
```

Use this in the Endpoint Explorer or in your own API calls:

```bash
curl -X POST http://localhost:3000/api/v1/payments \
  -H "Authorization: Bearer nxp_test_8h2k9nbq01def456abc789" \
  -H "Content-Type: application/json" \
  -d '{"amount":5000,"currency":"NGN","channel":"card","description":"Test payment"}'
```

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/v1/                    # REST API routes
│   │   ├── payments/               # POST /, GET /[id], GET /callback
│   │   ├── payment-links/route.ts  # POST /v1/payment-links
│   │   ├── virtual-cards/          # POST /, GET /, GET /[id], PATCH /[id]
│   │   ├── foreign-accounts/       # POST /, GET /, GET /[id]
│   │   ├── payouts/                # POST /, GET /, GET /[id], PATCH /[id]
│   │   ├── transactions/route.ts   # GET /v1/transactions
│   │   ├── payroll/runs/           # POST /, GET /, GET /[id]
│   │   ├── webhooks/               # POST /verify, GET+POST /endpoints
│   │   ├── api-keys/               # GET+POST /, DELETE /[id]  (master-key auth)
│   │   ├── auth/                   # POST /login, /signup, /logout; GET /me (cookie auth)
│   │   ├── kyc/                   # POST /verify-bvn, POST /verify-bvn-public
│   │   ├── fraud/score/route.ts   # POST (stateless fraud score)
│   │   ├── routing/route.ts       # POST (stateless routing decision)
│   │   ├── sandbox-key/route.ts   # GET (public, returns key prefix only)
│   │   └── [...path]/route.ts     # catch-all JSON 404
│   ├── health/route.ts            # GET /api/health (k8s probe)
│   ├── (page routes)              # /, /login, /signup, /dashboard, /docs, /kyc, /contact, /help, /status, /security, /privacy, /terms, /cookies
│   ├── globals.css                # Tailwind + theme tokens
│   ├── layout.tsx                 # Fonts (Inter + Sora + JetBrains Mono)
│   ├── error.tsx                  # Error boundary
│   └── not-found.tsx              # 404 page
├── components/
│   ├── site/                      # Nav, Footer, AuroraBackground, ThemeProvider, etc.
│   │   └── sections/              # Hero, Features, AppDemo, DeveloperGateway, etc. (19 sections)
│   └── ui/                        # shadcn/ui primitives
├── lib/
│   ├── api.ts                     # Shared API helpers (auth, parseBody, idempotency, auditLog)
│   ├── auth.ts                    # JWT sessions (jose) + bcrypt password hashing
│   ├── db.ts                      # Prisma client (singleton)
│   ├── schemas.ts                 # Zod validation schemas
│   ├── smart-router.ts            # Multi-rail payment routing
│   ├── fraud-detection.ts         # Rule-based fraud scoring
│   ├── gateways/theteller.ts      # TheTeller (PaySwitch Ghana) integration
│   ├── webhooks/dispatcher.ts     # Outbound HMAC-signed webhook dispatcher
│   └── utils.ts                   # cn() helper
├── middleware.ts                  # Rate limiting, request IDs, security headers
prisma/
└── schema.prisma                  # 13 models (User, ApiKey, Customer, Payment, VirtualCard, ForeignAccount, Payout, Transaction, PayrollRun, WebhookEndpoint, WebhookEvent, AuditLog, IdempotencyRecord)
scripts/
├── seed.ts                        # Demo data seeder
└── test-api.sh                    # API smoke tests
```

---

## 🔌 Payment Gateway Integrations

### PaySwitch.africa (Quidvis)
⚠️ **payswitch.africa has NO public developer API.** It's a consumer mobile app by Quidvis Ltd (Nigeria). For partnership access, contact `hi@payswitch.africa`.

### TheTeller (PaySwitch Ghana — the actual gateway)
The public "PaySwitch" payment gateway API is **TheTeller** at `theteller.net`:

```bash
# Auth: HTTP Basic with base64(apiuser:API_Key)
Authorization: Basic <base64(THETELLER_API_USER:THETELLER_API_KEY)>

# Flow:
# 1. POST /initiate → get checkout_url → redirect user
# 2. User pays on TheTeller checkout
# 3. Redirect back to your THETELLER_REDIRECT_URL?code=000&status=successful
# 4. GET /v1.1/users/transactions/{id}/status → verify (never trust redirect params)
```

**Required env vars** (in `.env`):
```
THETELLER_API_USER=TTM-xxxxxx
THETELLER_API_KEY=your_api_key
THETELLER_MERCHANT_ID=TTM-xxxxxx
THETELLER_BASE_URL=https://test.theteller.net      # or https://prod.theteller.net
THETELLER_CHECKOUT_URL=https://checkout-test.theteller.net
THETELLER_REDIRECT_URL=https://yourapp.com/payment/callback
```

### Paystack (recommended for Nigeria)
Self-serve, official webhooks, Bearer auth. Sign up at `dashboard.paystack.com`.

### Flutterwave (pan-African)
Official Node/PHP SDKs, encryption key required. Sign up at `dashboard.flutterwave.com`.

---

## 🔐 Environment Variables

See **[env.example](./env.example)** for the full list. Critical ones:

| Variable | Purpose | Required? |
|---|---|---|
| `DATABASE_URL` | Prisma database connection | ✅ Yes |
| `NEXORA_MASTER_KEY` | Mint/revoke API keys | ✅ Yes |
| `NEXORA_WEBHOOK_SECRET` | Sign outbound webhooks | ✅ Yes |
| `THETELLER_API_USER` / `_API_KEY` / `_MERCHANT_ID` | PaySwitch Ghana gateway | For payments |
| `PAYSTACK_SECRET_KEY` | Paystack gateway | For payments (alt) |
| `FLW_SECRET_KEY` | Flutterwave gateway | For payments (alt) |
| `NEXTAUTH_SECRET` | User JWT session signing (jose) | For auth |
| `RESEND_API_KEY` | Transactional email | For notifications |
| `SENTRY_DSN` | Error tracking | For prod |

---

## 🛠️ Scripts

```bash
bun run dev                # Start dev server (port 3000)
bun run lint               # ESLint
bun run typecheck          # TypeScript type-check (no emit)
bun run db:push            # Push schema to DB (dev only)
bun run db:generate        # Regenerate Prisma client
bun run db:migrate         # Create a migration (dev)
bun run db:reset           # Drop all data (dev only!)
bun run scripts/seed.ts    # Seed demo data
bash scripts/test-api.sh   # API smoke tests
```

---

## 📦 Current State

This is a working demo build. Already implemented:

- **API key security** — SHA-256 hashed at rest, timing-safe comparison, no plaintext storage
- **Rate limiting** — 30/min anon, 100/min test, 1000/min live (in-memory; wire Upstash for prod)
- **Idempotency-Key** — 24h cache, 409 on key+body mismatch, reference dedup
- **User auth** — JWT sessions via `jose` + bcrypt, cookie-based for the web app
- **Error boundaries** — `error.tsx` and `not-found.tsx`
- **Zod validation** — on all API routes with field-level error details
- **Security headers** — HSTS (preload, 2y), CSP, X-Frame-Options DENY, nosniff, Referrer-Policy
- **Audit log** — `AuditLog` model with fire-and-forget writes on all state-changing actions
- **Outbound webhooks** — HMAC-SHA256 signed, exponential backoff (1m, 5m, 30m, 2h, 6h)
- **TheTeller gateway** — initiate + verify + callback

Before production, harden:

- [ ] **Switch SQLite → Postgres** for concurrent writes (schema is provider-portable)
- [ ] **Wire Upstash Redis** for cross-instance rate limiting
- [ ] **Encrypt `WebhookEndpoint.secret`** at rest (currently plaintext for demo)
- [ ] **Real KYC vendor** (Youverify/Smile Identity) — `verifyBvnViaVendor()` is a stub
- [ ] **Per-tenant Customer records** — demo currently shares a single `getOrCreateDemoCustomer` row
- [ ] **Brute-force protection** on `/auth/login` (per-email lockout)
- [ ] **CSP nonces** instead of `unsafe-inline`

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

---

## 🙏 Credits

Inspired by [payswitch.africa](https://payswitch.africa/) (Quidvis Ltd). "Nexa Pay" is an independent project.
