# Changelog

All notable changes to Nexa Pay are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-09-16

### Added
- 5 new pages: /cookies, /contact, /help, /status, /security
- Catch-all JSON 404 handler for /api/v1/*
- LICENSE (MIT), CHANGELOG.md, CONTRIBUTING.md, ARCHITECTURE.md

### Fixed
- Brand consistency: all "Nexora" references unified to "Nexa Pay"
- Security: removed hardcoded sandbox key fallback (fail-closed if unset)
- Security: removed "dev-secret" webhook fallback (fail-closed if unset)
- Security: removed master-key dev bypass (always require NEXORA_MASTER_KEY)
- Security: removed payment callback force-succeed in non-prod
- /api/health excluded from rate limiting (k8s probes won't get 429)
- Mobile horizontal scroll (overflow-x: hidden on html/body)
- Webhook signature header: x-nexora-signature → x-nexapay-signature

## [0.2.1] - 2026-09-13

### Added
- Zod validation on all API routes with field-level error details
- AuditLog model with fire-and-forget logging
- Idempotency-Key header support (24h cache, 409 on conflict)
- Tenant isolation (userId on all financial models)
- Master-key auth on /api/v1/api-keys endpoints
- Real HMAC-SHA256 webhook signature verification
- Outbound webhook dispatcher with HMAC signing + exponential backoff
- TheTeller (PaySwitch Ghana) gateway integration
- /api/health endpoint with DB ping
- GET list, GET by ID, PATCH endpoints for all resources
- Error boundaries (error.tsx, not-found.tsx)
- Rate limiting middleware (30/min anon, 100/min test, 1000/min live)
- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy)
- CI/CD pipeline (.github/workflows/ci.yml + deploy.yml)
- Multi-stage Dockerfile + docker-compose.yml (Postgres + Redis)
- /signup, /login, /dashboard, /docs pages
- /terms (Nigerian-law ToS), /privacy (NDPR-compliant), /kyc (BVN verification)
- KYC scaffold: Customer.bvnHash, /api/v1/kyc/verify-bvn
- Sandbox key endpoint (replaces hardcoded key in client bundle)

### Fixed
- API keys now stored as SHA-256 hashes (never plaintext)
- GET /api-keys returns only key prefix (never full key)
- POST /api-keys returns full key ONCE at creation
- node:crypto.randomBytes replaces Math.random for all IDs
- Amount validation (positive, finite, ≤1M)
- Currency whitelisting on virtual cards
- Pagination NaN validation
- All POST creates return 201, replays return 200

## [0.1.0] - 2026-09-13

### Added
- Initial Nexa Pay payment switch platform
- Next.js 16 + TypeScript + Tailwind CSS 4 + Prisma + shadcn/ui
- 16 marketing sections (hero, features, cards, foreign accounts, crypto, eSIM, business, bills, savings, app demo, developer gateway, pricing, testimonials, FAQ, CTA, footer)
- Interactive app demo with 8 dashboard tabs
- Developer Gateway: API keys, endpoint explorer (8 endpoints), webhooks, SDKs
- Real REST API at /api/v1/* with Prisma/SQLite persistence
- Bearer auth on all /v1/* routes
- 10 Prisma models (User, ApiKey, Customer, Payment, VirtualCard, ForeignAccount, Payout, Transaction, PayrollRun, WebhookEvent)
- Demo data seeder
