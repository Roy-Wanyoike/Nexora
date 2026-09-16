"use client";

import Link from "next/link";
import {
  Terminal,
  KeyRound,
  Webhook,
  ArrowLeft,
  Zap,
  ShieldCheck,
  Globe2,
  Activity,
  BookOpen,
} from "lucide-react";
import { Logo } from "@/components/site/logo";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

type EndpointDoc = {
  method: Method;
  path: string;
  title: string;
  desc: string;
};

// Pulled from the ENDPOINTS array pattern in developer-gateway.tsx.
// Includes every public API route the Nexa Pay platform exposes.
const ENDPOINTS: EndpointDoc[] = [
  {
    method: "POST",
    path: "/v1/payments",
    title: "Create a payment",
    desc: "Charge a customer via card, bank transfer, or Nexa Pay balance. Returns a payment object you can confirm, capture or refund.",
  },
  {
    method: "POST",
    path: "/v1/payment-links",
    title: "Create a payment link",
    desc: "Generate a hosted checkout URL you can share with anyone. Funds settle into your Nexa Pay wallet on success.",
  },
  {
    method: "POST",
    path: "/v1/virtual-cards",
    title: "Issue a virtual card",
    desc: "Spin up a USD or NGN virtual card in seconds. Set spending limits, freeze, or block per merchant.",
  },
  {
    method: "POST",
    path: "/v1/foreign-accounts",
    title: "Open a foreign account",
    desc: "Provision a genuine USD, GBP, EUR or CNY bank account for your customer — with real routing/IBAN/sort code.",
  },
  {
    method: "POST",
    path: "/v1/payouts",
    title: "Send a payout",
    desc: "Push funds to any bank account, mobile money, or Nexa Pay user across 190+ countries. Single or batch.",
  },
  {
    method: "GET",
    path: "/v1/transactions",
    title: "List transactions",
    desc: "Paginated, filterable ledger of every transaction on the account. Reconcile by date, currency, channel or status.",
  },
  {
    method: "POST",
    path: "/v1/payroll/runs",
    title: "Run payroll",
    desc: "Pay your whole team in one call — across NGN, USD, GBP & EUR. Schedule for now or a future date.",
  },
  {
    method: "POST",
    path: "/v1/webhooks/verify",
    title: "Verify a webhook signature",
    desc: "Confirm that an incoming webhook was actually sent by Nexa Pay — never skip this on your server.",
  },
  {
    method: "GET",
    path: "/v1/api-keys",
    title: "List API keys",
    desc: "List your test or live API keys. Returns only the key prefix — full keys are shown once at creation time.",
  },
  {
    method: "POST",
    path: "/v1/api-keys",
    title: "Create an API key",
    desc: "Create a new test or live API key. The full key is returned exactly once — store it securely.",
  },
];

const METHOD_COLORS: Record<Method, string> = {
  GET: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  POST: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  PATCH: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  DELETE: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const STATS = [
  { icon: Globe2, label: "REST API", v: "v1 · JSON" },
  { icon: ShieldCheck, label: "Auth", v: "Bearer API keys" },
  { icon: Activity, label: "Uptime", v: "99.98% SLA" },
  { icon: BookOpen, label: "Endpoints", v: `${ENDPOINTS.length} core` },
];

const WEBHOOKS = [
  { event: "payment.succeeded", desc: "A payment was successfully captured." },
  { event: "payment.failed", desc: "A payment was declined or failed to capture." },
  { event: "payout.pending", desc: "A payout has been queued for processing." },
  { event: "payout.paid", desc: "A payout has arrived at the destination." },
  { event: "card.issued", desc: "A virtual card was successfully created." },
  { event: "card.frozen", desc: "A card was frozen via API or dashboard." },
  { event: "foreign_account.opened", desc: "A new foreign account was provisioned." },
  { event: "payroll.scheduled", desc: "A payroll run was scheduled for a future date." },
];

export default function DocsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="aurora a1" style={{ top: -200, left: -120, opacity: 0.35 }} />
      <div className="aurora a3" style={{ top: 80, left: "55%", opacity: 0.3 }} />

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" aria-label="Nexa Pay home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </header>

        {/* Title */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
            <BookOpen className="h-3.5 w-3.5 text-brand" />
            API Reference
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Build on the <span className="text-gradient">Nexa Pay API</span>
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
            One REST API for payments, cards, foreign accounts, payouts, payroll and more.
            Test in the sandbox, ship to live — with SDKs in 5 languages and HMAC-signed webhooks.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur"
            >
              <div className="flex items-center gap-2">
                <s.icon className="h-4 w-4 text-brand" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
              <p className="mt-2 font-display text-lg font-bold">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Quickstart */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-brand" />
            <h2 className="font-display text-xl font-bold">Quickstart</h2>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
            <p className="text-sm text-muted-foreground">
              Authenticate every request with a bearer token. Test keys use the{" "}
              <code className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-xs text-brand">
                nxp_test_
              </code>{" "}
              prefix — use the live endpoint with{" "}
              <code className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-xs text-brand">
                nxp_live_
              </code>{" "}
              keys in production.
            </p>
            <pre className="thin-scroll mt-3 overflow-x-auto rounded-xl border border-border/40 bg-background/40 p-3 font-mono text-xs leading-relaxed">
{`curl -X POST 'https://api.nexapay.africa/v1/payments' \\
  -H 'Authorization: Bearer nxp_test_xxxxxxxxxxxx' \\
  -H 'Content-Type: application/json' \\
  -d '{"amount":5000,"currency":"NGN","channel":"card"}'`}
            </pre>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand" />
            <h2 className="font-display text-xl font-bold">Endpoints</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {ENDPOINTS.length} endpoints
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ENDPOINTS.map((ep) => (
              <div
                key={`${ep.method} ${ep.path}`}
                className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur sm:flex-row sm:items-start"
              >
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${METHOD_COLORS[ep.method]}`}
                  >
                    {ep.method}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <code className="font-mono text-sm font-semibold">{ep.path}</code>
                    <p className="text-sm font-medium">{ep.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{ep.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Webhooks */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Webhook className="h-4 w-4 text-brand" />
            <h2 className="font-display text-xl font-bold">Webhooks</h2>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Subscribe to {WEBHOOKS.length} event types. Every webhook is signed with HMAC-SHA256 —
            verify the <code className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-xs text-brand">NexaPay-Signature</code> header on your server.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {WEBHOOKS.map((w) => (
              <div
                key={w.event}
                className="rounded-2xl border border-border/60 bg-card/40 p-3 backdrop-blur"
              >
                <code className="font-mono text-xs font-semibold text-brand">{w.event}</code>
                <p className="mt-1 text-xs text-muted-foreground">{w.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Auth */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-brand" />
            <h2 className="font-display text-xl font-bold">Authentication</h2>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                • Test keys (<code className="font-mono text-xs text-brand">nxp_test_…</code>) hit the sandbox — no real money moves.
              </li>
              <li>
                • Live keys (<code className="font-mono text-xs text-brand">nxp_live_…</code>) settle real funds. Rotate regularly.
              </li>
              <li>• Keys are stored only as SHA-256 hashes — never in plaintext.</li>
              <li>• Revoke keys instantly from the dashboard or via <code className="font-mono text-xs text-brand">DELETE /v1/api-keys/:id</code>.</li>
            </ul>
          </div>
        </section>

        <footer className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          <p>
            Need help?{" "}
            <Link href="/" className="text-foreground underline-offset-4 hover:underline">
              Back to home
            </Link>{" "}
            · © {new Date().getFullYear()} Nexa Pay
          </p>
        </footer>
      </div>
    </div>
  );
}
