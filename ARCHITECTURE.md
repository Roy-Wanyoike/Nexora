# Nexa Pay Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                       │
│                  Next.js 16 App Router (RSC)                  │
├─────────────────────────────────────────────────────────────┤
│  Marketing Pages    │  Dashboard  │  Docs  │  Auth (signup)  │
│  (/, /pricing)      │  (/dashboard)│ (/docs)│  (/login)       │
└──────────┬──────────┴──────┬──────┴───┬────┴────────┬────────┘
           │                 │          │             │
           ▼                 ▼          ▼             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Next.js API Routes (BFF)                   │
│  /api/v1/payments · /payouts · /virtual-cards · /transactions  │
│  /api/v1/foreign-accounts · /payroll/runs · /webhooks/*       │
│  /api/v1/kyc/verify-bvn · /api-keys · /health                 │
├──────────────────────────────────────────────────────────────┤
│  Middleware: Rate Limiting + Request ID + Security Headers    │
└──────────┬───────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Prisma ORM + SQLite (dev)                   │
│                    Prisma ORM + PostgreSQL (prod)              │
│  12 Models: User · ApiKey · Customer · Payment · VirtualCard  │
│  · ForeignAccount · Payout · Transaction · PayrollRun         │
│  · WebhookEvent · WebhookEndpoint · AuditLog · IdempotencyRecord │
└──────────────────────────────────────────────────────────────┘
```

## Request Lifecycle

1. **Browser** → Next.js page (Server Component for SSR, Client Component for interactivity)
2. **API call** → Next.js Route Handler at `/api/v1/*`
3. **Middleware** → Rate limit check → Request ID generation → Security headers
4. **Route Handler** → `authenticate()` (Bearer token → SHA-256 hash → DB lookup)
5. **Validation** → Zod schema validation (returns 422 with field details on failure)
6. **Idempotency** → Check `IdempotencyRecord` by `Idempotency-Key` header
7. **Business Logic** → `db.$transaction` for atomic writes (Payment + Transaction ledger)
8. **Audit Log** → `auditLog()` fire-and-forget records the action
9. **Webhook** → `dispatchToUserEndpoints()` sends HMAC-signed events to merchants
10. **Response** → `{ data: ... }` envelope with 201 on create, 200 on read/replay

## Authentication

- **API Keys**: `nxp_test_*` / `nxp_live_*` → SHA-256 hashed → stored in `ApiKey.keyHash`
- **Master Key**: `NEXORA_MASTER_KEY` env var → required for `/api/v1/api-keys` management
- **Webhook Secret**: `NEXORA_WEBHOOK_SECRET` → HMAC-SHA256 signing for outbound webhooks

## Idempotency

- `Idempotency-Key` header → `IdempotencyRecord` table (24h TTL)
- Same key + same body hash → returns cached response (200)
- Same key + different body → 409 conflict
- Reference dedup: same `reference` field → returns existing payment

## Data Model

See `prisma/schema.prisma` for the full schema. Key relationships:

- `User` 1:N `ApiKey` (hashed keys for API access)
- `User` 1:N `Customer` (tenant isolation)
- `Customer` 1:N `Payment`, `VirtualCard`, `ForeignAccount`
- `Payment` 1:1 `Transaction` (ledger mirror)
- `User` 1:N `WebhookEndpoint` (merchant callback URLs)
- `WebhookEndpoint` 1:N `WebhookEvent` (delivery tracking)

## Payment Gateway Integration

- **TheTeller (PaySwitch Ghana)**: `src/lib/gateways/theteller.ts`
  - `initiatePayment()` → POST to TheTeller `/initiate` with HTTP Basic auth
  - `verifyTransaction()` → GET `/v1.1/users/transactions/{id}/status`
  - Callback at `/api/v1/payments/callback` verifies + updates payment status

## Webhook Delivery

- `src/lib/webhooks/dispatcher.ts`
- Signs payload with `x-nexapay-signature: t=<unix>,v1=<hmac>` header
- Exponential backoff: 1m, 5m, 30m, 2h, 6h (5 attempts max)
- Records `delivered`, `attempts`, `lastAttemptAt`, `responseCode` on `WebhookEvent`

## Future Architecture (Go + Temporal)

See `docs/adr/0001-go-temporal-backend.md` for the decision to adopt Golang + Temporal for payment orchestration. The migration plan uses the strangler-fig pattern over 6 phases.

## Deployment

- **Docker**: Multi-stage build (`Dockerfile`) → `oven/bun:1.1-alpine` runtime
- **Compose**: `docker-compose.yml` with Postgres 16 + Redis 7
- **CI/CD**: `.github/workflows/ci.yml` (lint + typecheck + build + API tests)
- **Health**: `/api/health` endpoint for k8s probes (exempt from rate limiting)
