# syntax=docker/dockerfile:1.6

# ──────────────────────────────────────────────────────────────────────
# Stage 1 — deps
# Install production + dev dependencies in a reproducible layer.
# ──────────────────────────────────────────────────────────────────────
FROM oven/bun:1.1 AS deps

WORKDIR /app

# Copy lockfile + manifest first to maximise layer caching.
COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# ──────────────────────────────────────────────────────────────────────
# Stage 2 — builder
# Generate the Prisma client, then run the Next.js production build.
# ──────────────────────────────────────────────────────────────────────
FROM oven/bun:1.1 AS builder

WORKDIR /app

# Bring deps in from the previous stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source.
COPY . .

# Prisma client is imported by the app at build time.
RUN bun run db:generate

# Build the standalone Next.js server.
# `next build` with `output: "standalone"` emits `.next/standalone`,
# `.next/static`, and we copy `public/` next to it (see package.json build).
RUN bun run build

# ──────────────────────────────────────────────────────────────────────
# Stage 3 — runner
# Slim runtime image. Runs as the non-root `bun` user.
# ──────────────────────────────────────────────────────────────────────
FROM oven/bun:1.1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Create a non-root user (the bun image already ships a `bun` user with
# uid 1000, but make sure /app is owned by it).
RUN chown -R bun:bun /app

# Standalone Next.js output bundles the minimal server + node_modules.
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
COPY --from=builder --chown=bun:bun /app/public ./public

USER bun

EXPOSE 3000

CMD ["bun", ".next/standalone/server.js"]
