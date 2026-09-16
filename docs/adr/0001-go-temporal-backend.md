# ADR-0001: Adopt Golang + Temporal for Payment Orchestration

## Status

Accepted — 2026-09-16

## Context

Nexa Pay's current backend is Next.js API routes + Prisma + SQLite. This works for the MVP but has three existential limitations for a fintech processing real money:

1. **No durable execution**: Payment workflows (create → gateway initiate → 3DS → callback → settle) span minutes to hours. If the process dies mid-workflow, the payment is stuck in `pending` forever. There's no retry, no compensation, no replay.

2. **No saga pattern**: Multi-step financial operations (debit wallet → convert FX → send payout → update ledger) need atomic-all-or-compensate semantics. If step 3 fails, steps 1-2 must roll back. We're currently using `db.$transaction` which only covers a single DB — not cross-service or cross-gateway operations.

3. **TOCTOU idempotency race**: The read-then-write pattern in `checkIdempotency()` has a time-of-check-to-time-of-use window. Two concurrent requests with the same `Idempotency-Key` can both pass the check and both execute, causing double-charges. The P2002 catch only papers over the symptom.

Additionally:
- SQLite has a single-writer lock → concurrent payment creation serializes or fails
- In-memory rate limiter → N× bypass with horizontal scaling
- Inline `setTimeout` webhook backoff → dies with the process
- No background workers → payroll runs sit in "scheduled" forever

## Decision

Adopt **Golang** as the primary language for payment orchestration, with **Temporal** as the workflow engine.

### Stack
| Layer | Technology | Rationale |
|---|---|---|
| Orchestration core | **Golang** | High concurrency (goroutines), low memory, fast startup, strong typing, excellent for network-heavy services |
| Workflow engine | **Temporal** | Durable execution, saga pattern, automatic retry, compensation logic, replay, versioning |
| Database | **PostgreSQL 16** | Row-level locks, JSONB, RLS, LISTEN/NOTIFY, point-in-time recovery |
| Cache/Queue | **Redis 7** | Rate limiting (sliding window), BullMQ for short-lived jobs, Temporal for durable workflows |
| BFF/Dashboard | **Next.js 16** (existing) | Keep as the API gateway + frontend; calls the Go service via gRPC/HTTP |
| SDK | **TypeScript** (existing) | `@nexapay/node` client library |

### Why Golang + Temporal?

**Golang** solves:
- Concurrency: goroutines are ~4KB each vs Node.js's ~1MB threads → 250× more concurrent connections
- Memory: Go binary is ~15MB vs Node.js's ~150MB runtime → 10× smaller container
- Startup: Go starts in <100ms vs Node.js's ~2s cold start → no cold-start latency
- Type safety: Go's type system is stricter than TypeScript → fewer runtime errors
- Cross-compilation: `GOOS=linux GOARCH=amd64 go build` → easy multi-arch builds

**Temporal** solves:
- **Durable execution**: If the worker dies, Temporal replays the workflow from the last checkpoint. No stuck payments.
- **Saga pattern**: Each workflow step has a compensation function. If step 3 fails, Temporal automatically calls steps 2 and 1's compensations.
- **Automatic retry**: Configurable retry policies per activity. Transient failures (network, gateway timeout) are retried automatically.
- **Versioning**: Workflow code changes can be versioned. Old in-flight workflows continue with old code; new workflows use new code.
- **Observability**: Every workflow step is visible in Temporal Web UI. You can see exactly where a payment is stuck.
- **Long-running**: Workflows can run for days (e.g., SEPA settlement takes 1 business day). Temporal keeps them alive across worker restarts.

### Alternatives Considered

| Alternative | Verdict | Why |
|---|---|---|
| Rust + Tokio | ❌ Overkill | Bottleneck is gateway round-trips (~50–500ms), not CPU. No Temporal-quality workflow engine in Rust — you'd build saga/replay from scratch. |
| Elixir + Phoenix | ⚠️ Viable but risky | BEAM is excellent, but smaller W. African talent pool + Oban/Broadway are not workflow engines. |
| Node.js + BullMQ | ⚠️ Underpowered | Great for fire-and-forget jobs; not a workflow engine. By the time you hand-roll saga/compensation/replay you've reinvented a worse Temporal. |
| Java + Spring Cloud | ⚠️ Enterprise overkill | Solid but heavyweight; 200–500ms JVM warmup; poor culture fit with a Next.js shop. |

## Migration Plan (Strangler-Fig, 6 Phases, 6 Months)

### Phase 0: Infrastructure (Week 1-2)
- Provision PostgreSQL 16 (managed RDS/Cloud SQL)
- Provision Redis 7 (Upstash or self-hosted)
- Provision Temporal (Temporal Cloud for first 12 months → self-host at 10M workflows/mo)
- Switch Prisma from SQLite → PostgreSQL
- Add Redis-backed rate limiter (Upstash REST, Edge-compatible)

### Phase 1: Webhook Extraction (Week 3-4)
- Move webhook dispatcher from inline `setTimeout` → Temporal workflow
- Each webhook delivery becomes a Temporal activity with automatic retry
- The Next.js route enqueues the workflow; Temporal handles delivery + backoff
- Zero downtime: old inline dispatcher continues while Temporal takes over new events

### Phase 2: Go Payment Workflow (Week 5-8)
- Build Go service: `services/payment-worker/`
- Implement `PaymentWorkflow` in Temporal:
  1. `initiatePayment` activity → calls TheTeller
  2. `waitForCallback` activity → waits for gateway callback (up to 15 min)
  3. `verifyTransaction` activity → confirms with gateway
  4. `updateLedger` activity → atomic DB write
  5. `dispatchWebhook` activity → notify merchant
  - Compensation: refund if verify fails after debit
- Next.js `/api/v1/payments` starts the Temporal workflow instead of inline processing
- Zero downtime: both paths active during migration

### Phase 3: Payout + Payroll (Week 9-12)
- Implement `PayoutWorkflow` in Temporal (bank transfer → verify → settle)
- Implement `PayrollWorkflow` in Temporal (batch payouts with per-employee retry)
- This unblocks the "scheduled" payroll runs that currently never execute

### Phase 4: Missing CRUD + 405 Fixes (Week 13-14)
- Add GET-list, GET-by-ID, PATCH, DELETE endpoints for all resources
- Add 405 with `Allow` header on all POST-only routes
- Add CORS middleware
- Add structured logging (pino) with request-ID correlation
- Add Sentry integration

### Phase 5: Real KYC + Security Hardening (Week 15-16)
- Integrate Youverify/Smile Identity for real BVN verification
- Add sanctions/PEP screening
- Implement immutable audit log (hash chain)
- Add request body size limit
- Tighten CSP (remove unsafe-inline, add nonces)

## Consequences

### Positive
- **Zero downtime**: Durable workflows survive process crashes, deploys, and scaling events
- **No double-charges**: Temporal's idempotency + replay eliminates the TOCTOU race
- **Automatic retry**: Transient gateway failures are retried without manual intervention
- **Saga pattern**: Failed multi-step operations automatically compensate
- **Observability**: Temporal Web UI shows every workflow step — no more "where is my payment stuck?"
- **Scalability**: Go + Postgres handles 10,000+ concurrent workflows per worker
- **Smaller footprint**: Go binary is 10× smaller than Node.js runtime

### Negative
- **Complexity**: Temporal adds a new dependency and operational surface
- **Learning curve**: Team needs to learn Go + Temporal workflow patterns
- **Cost**: Temporal Cloud is ~$0.30 per 1,000 workflow executions (or self-host)
- **Two languages**: TypeScript (BFF) + Go (orchestration) — but this is standard for fintech

### Neutral
- Next.js remains the BFF + frontend — no rewrite of the marketing site or dashboard
- Prisma remains for the BFF; Go uses pgx + sqlc for the orchestration layer
- The SDK stays in TypeScript

## References

- [Temporal documentation](https://docs.temporal.io)
- [Go documentation](https://go.dev/doc/)
- [Saga pattern](https://microservices.io/patterns/data/saga.html)
- [Strangler-fig pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)
