# Contributing to Nexa Pay

Thank you for your interest in contributing! This guide covers setup, conventions, and the PR process.

## Quick Start

```bash
git clone https://github.com/Roy-Wanyoike/Nexa Pay.git
cd Nexa Pay
bun install
cp env.example .env  # Fill in required values
bun run db:push
bun run db:generate
bun run scripts/seed.ts
bun run dev
```

## Prerequisites

- Bun ≥ 1.3
- Node.js ≥ 20
- SQLite (dev) or PostgreSQL 16 (prod)

## Development Commands

```bash
bun run dev          # Start dev server (port 3000)
bun run lint         # ESLint
bun run db:push      # Push schema to DB (dev only)
bun run db:generate  # Regenerate Prisma client
bun run scripts/seed.ts  # Seed demo data
bun run scripts/test-api.sh  # Run API smoke tests
```

## Adding a New API Route

1. **Schema**: Add the model to `prisma/schema.prisma` with `@@index` on query patterns
2. **Validation**: Add a Zod schema in `src/lib/schemas.ts`
3. **Route**: Create `src/app/api/v1/<resource>/route.ts` — call `authenticate()`, validate with Zod, wrap DB writes in `db.$transaction`, call `auditLog()`
4. **GET/PATCH**: Add `[id]/route.ts` for retrieve + update, scoped by `key.userId`
5. **Docs**: Update `src/app/docs/page.tsx` with the new endpoint
6. **Tests**: Add curl tests to `scripts/test-api.sh`

## Adding a New Webhook Event

1. Add the event type to the `WEBHOOKS` array in `src/components/site/sections/developer-gateway.tsx`
2. Call `dispatchToUserEndpoints(userId, "event.name", payload)` in the route after the state change
3. Document in `src/app/docs/page.tsx`

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add refund endpoint
fix: prevent double-charge on idempotency replay
docs: add webhook retry policy
chore: remove unused dependencies
security: remove hardcoded sandbox key fallback
```

## Pull Request Process

1. Create a branch: `git checkout -b feat/your-feature`
2. Make your changes, ensure `bun run lint` passes
3. Write tests in `scripts/test-api.sh` or add unit tests
4. Update documentation (README, docs page, CHANGELOG)
5. Open a PR with a clear description linking to the issue
6. CI must pass (lint + typecheck + build)
7. Request review from at least one team member
8. Squash-merge to main

## Security

- **Never** commit secrets, API keys, or passwords
- **Never** store raw card numbers (PAN) or CVV
- **Always** hash API keys with SHA-256 before storing
- **Always** use `timingSafeEqual` for key comparison
- **Always** validate input with Zod schemas
- **Always** wrap multi-step DB operations in `db.$transaction`
- **Report** security vulnerabilities to security@nexapay.africa (do not open public issues)
