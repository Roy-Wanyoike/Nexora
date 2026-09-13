"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, KeyRound, Webhook, BookOpen, Zap, ShieldCheck,
  Copy, Check, Plus, Trash2, Globe2,
  ArrowRight, Activity, Lock, RefreshCw, GitBranch,
} from "lucide-react";
import { Section, SectionHeading } from "../section";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ============ Data ============ */

type Endpoint = {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  title: string;
  desc: string;
  params?: { name: string; type: string; required: boolean; desc: string }[];
  body?: Record<string, any>;
  response: Record<string, any>;
};

const ENDPOINTS: Endpoint[] = [
  {
    id: "create-payment",
    method: "POST",
    path: "/v1/payments",
    title: "Create a payment",
    desc: "Charge a customer via card, bank transfer, or Nexa Pay balance. Returns a payment object you can confirm, capture or refund.",
    body: {
      amount: 5000,
      currency: "NGN",
      channel: "card",
      reference: "nxp-order-90213",
      description: "Pro plan subscription",
    },
    response: {
      id: "pay_8h2k9nbQ01",
      object: "payment",
      amount: 5000,
      currency: "NGN",
      status: "succeeded",
      channel: "card",
      customer: "cus_8h2k9",
      reference: "nxp-order-90213",
      created_at: "2026-09-14T08:32:11.482Z",
      fees: 75,
      net: 4925,
    },
  },
  {
    id: "create-payment-link",
    method: "POST",
    path: "/v1/payment-links",
    title: "Create a payment link",
    desc: "Generate a hosted checkout URL you can share with anyone. Funds settle into your Nexa Pay wallet on success.",
    body: {
      amount: 100,
      currency: "USD",
      title: "Consultation fee",
      description: "1-hour strategy call",
      redirect_url: "https://yoursite.com/thanks",
      collect_billing: true,
    },
    response: {
      id: "plink_9F2kQ8",
      object: "payment_link",
      url: "https://pay.nexapay.africa/l/nxp-9F2kQ8",
      amount: 100,
      currency: "USD",
      status: "active",
      created_at: "2026-09-14T08:35:00.000Z",
    },
  },
  {
    id: "create-card",
    method: "POST",
    path: "/v1/virtual-cards",
    title: "Issue a virtual card",
    desc: "Spin up a USD or NGN virtual card in seconds. Set spending limits, freeze, or block per merchant.",
    body: {
      currency: "USD",
      type: "virtual",
      spending_limit: 2000,
      spending_interval: "monthly",
      label: "Ads · Meta",
    },
    response: {
      id: "card_9Kp2X7",
      object: "virtual_card",
      brand: "visa",
      last4: "4591",
      exp_month: 8,
      exp_year: 2029,
      currency: "USD",
      spending_limit: 2000,
      spending_interval: "monthly",
      status: "active",
      created_at: "2026-09-14T08:40:14.118Z",
    },
  },
  {
    id: "create-foreign-account",
    method: "POST",
    path: "/v1/foreign-accounts",
    title: "Open a foreign account",
    desc: "Provision a genuine USD, GBP, EUR or CNY bank account for your customer — with real routing/IBAN/sort code.",
    body: {
      currency: "USD",
      customer_type: "individual",
      customer: "cus_8h2k9",
    },
    response: {
      id: "fac_8Bn3Kp",
      object: "foreign_account",
      currency: "USD",
      account_name: "John Doe",
      account_number: "4591882134",
      routing_number: "084009519",
      bank_name: "Nexa Pay / Evolve",
      supported_rails: ["ach", "wire", "swift"],
      status: "active",
      created_at: "2026-09-14T08:42:01.000Z",
    },
  },
  {
    id: "payout",
    method: "POST",
    path: "/v1/payouts",
    title: "Send a payout",
    desc: "Push funds to any bank account, mobile money, or Nexa Pay user across 190+ countries. Single or batch.",
    body: {
      amount: 240,
      currency: "USD",
      destination: { type: "bank", country: "NG", account_number: "0123456789", bank_code: "057" },
      reference: "payout-90213",
      reason: "Vendor payment",
    },
    response: {
      id: "pout_7K9mXc",
      object: "payout",
      amount: 240,
      currency: "USD",
      status: "pending",
      destination: { type: "bank", country: "NG" },
      reference: "payout-90213",
      estimated_arrival: "2026-09-14T12:00:00.000Z",
      created_at: "2026-09-14T08:45:22.991Z",
    },
  },
  {
    id: "list-transactions",
    method: "GET",
    path: "/v1/transactions",
    title: "List transactions",
    desc: "Paginated, filterable ledger of every transaction on the account. Reconcile by date, currency, channel or status.",
    response: {
      object: "list",
      has_more: true,
      url: "/v1/transactions",
      data: [
        { id: "txn_9Kp2X7", type: "payment", amount: 5000, currency: "NGN", status: "succeeded", created_at: "2026-09-14T08:32:11Z" },
        { id: "txn_8Hk1Bn", type: "payout", amount: 240, currency: "USD", status: "pending", created_at: "2026-09-14T08:45:22Z" },
        { id: "txn_2Jd7Vq", type: "fx_conversion", amount: 2000, currency: "USD", status: "succeeded", created_at: "2026-09-13T19:08:00Z" },
      ],
    },
  },
  {
    id: "run-payroll",
    method: "POST",
    path: "/v1/payroll/runs",
    title: "Run payroll",
    desc: "Pay your whole team in one call — across NGN, USD, GBP & EUR. Schedule for now or a future date.",
    body: {
      schedule: "now",
      currency: "USD",
      items: [
        { employee: "emp_8Hk1", amount: 8400, currency: "USD" },
        { employee: "emp_9Kp2", amount: 5200, currency: "USD" },
        { employee: "emp_3Bn7", amount: 920000, currency: "NGN" },
      ],
    },
    response: {
      id: "prl_9K2nXv",
      object: "payroll_run",
      status: "scheduled",
      total_amount: 13600,
      total_currency: "USD",
      items_count: 3,
      scheduled_for: "2026-09-30T08:00:00.000Z",
      created_at: "2026-09-14T08:50:11.000Z",
    },
  },
  {
    id: "verify-webhook",
    method: "POST",
    path: "/v1/webhooks/verify",
    title: "Verify a webhook signature",
    desc: "Confirm that an incoming webhook was actually sent by Nexa Pay — never skip this on your server.",
    body: {
      signature: "t=1726298400,v1=5d41402abc4b2a76b9719d911017c592",
      payload: "{...raw body string...}",
    },
    response: {
      verified: true,
      event_type: "payment.succeeded",
      event_id: "evt_9K2nPp",
      timestamp: 1726298400,
    },
  },
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

const SDKS = [
  { lang: "Node.js", install: "npm install @nexapay/node", icon: "⬢" },
  { lang: "Python", install: "pip install nexapay", icon: "🐍" },
  { lang: "PHP", install: "composer require nexapay/sdk", icon: "🐘" },
  { lang: "Go", install: "go get github.com/nexapay/go", icon: "🦫" },
  { lang: "Ruby", install: "gem install nexapay", icon: "💎" },
];

const LANGS = ["cURL", "JavaScript", "Python", "PHP", "Go"] as const;
type Lang = (typeof LANGS)[number];

/* ============ Helpers ============ */

function jsonBody(lang: Lang, body: Record<string, any>): string {
  if (lang === "cURL") return `-d '${JSON.stringify(body, null, 0)}'`;
  const s = JSON.stringify(body, null, 2);
  if (lang === "JavaScript") return `body: ${s}`;
  if (lang === "Python") return `payload = ${s}`;
  if (lang === "PHP") return `$payload = ${s.replace(/"/g, "'").replace(/\n\s*/g, " ")};`;
  if (lang === "Go") return `payload := ${s
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, `"`)}`;
  return "";
}

function buildCodeSample(lang: Lang, ep: Endpoint, key: string): string {
  const url = `https://api.nexapay.africa${ep.path}`;
  const isGet = ep.method === "GET";

  switch (lang) {
    case "cURL":
      return [
        `curl -X ${ep.method} '${url}' \\`,
        `  -H 'Authorization: Bearer ${key}' \\`,
        `  -H 'Content-Type: application/json'${!isGet && ep.body ? ` \\` : ""}`,
        !isGet && ep.body ? `  ${jsonBody(lang, ep.body)}` : "",
      ].filter(Boolean).join("\n");

    case "JavaScript":
      return `import NexaPay from "@nexapay/node";
const nexa = new NexaPay("${key}");

const res = await nexa.${ep.id.replace(/-/g, "_").replace(/^(\w)/, (_, c) => c.toLowerCase())}(${
        !isGet && ep.body ? JSON.stringify(ep.body, null, 2).replace(/^/gm, "  ").trim() : ""
      }${isGet ? "{}" : ""});
console.log(res);`;

    case "Python":
      return `import nexapay
nexapay.api_key = "${key}"

res = nexapay.${ep.id.replace(/-/g, "_")}.${
        isGet ? "list()" : `create(${jsonBody("Python", ep.body || {}).replace(/^payload = /, "")})`
      }
print(res)`;

    case "PHP":
      return `<?php
require 'vendor/autoload.php';
$nexa = new NexaPay\\Client("${key}");

$res = $nexa->${ep.id.replace(/-/g, "')->")}(${
        !isGet && ep.body ? "$payload" : "[]"
      });
print_r($res);`;

    case "Go": {
      const fnName = ep.id.replace(/-/g, "");
      const action = isGet ? "List" : "Create";
      const arg = !isGet && ep.body ? "payload" : "nil";
      return `package main

import (
    "context"
    "fmt"
    "github.com/nexapay/go"
)

func main() {
    nexa := nexapay.NewClient("${key}")
    res, err := nexa.${fnName}.${action}(ctx, ${arg})
    if err != nil { panic(err) }
    fmt.Println(res)
}`;
    }
  }
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  POST: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  PATCH: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  DELETE: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

/* ============ Sub-components ============ */

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
        copied
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
      }`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function ApiKeysPanel() {
  const [mode, setMode] = useState<"test" | "live">("test");
  const [keys, setKeys] = useState<{ id: string; label: string; key: string; keyPrefix?: string; live: boolean; created: string; isNew?: boolean }[]>([]);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Load keys from DB on mount + whenever mode changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/v1/api-keys?mode=${mode}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const data = res.data || [];
        setKeys(
          data.map((k: any) => ({
            id: k.id,
            label: k.label,
            // GET only returns the prefix — mask it for display
            key: k.keyPrefix ? `${k.keyPrefix}••••••••••••` : "••••",
            keyPrefix: k.keyPrefix,
            live: k.mode === "live",
            created: k.created,
          }))
        );
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const create = async () => {
    try {
      const r = await fetch("/api/v1/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: `Key ${keys.length + 1}`, mode }),
      });
      const res = await r.json();
      if (!r.ok) throw new Error(res.error || "Failed to create key");
      const k = res.data;
      // The full key is returned ONLY at creation — store it locally so the
      // user can copy it once, then it's gone forever.
      setKeys((prev) => [
        {
          id: k.id,
          label: k.label,
          key: k.key, // full key — shown once
          keyPrefix: k.keyPrefix,
          live: k.mode === "live",
          created: k.created,
          isNew: true,
        },
        ...prev,
      ]);
      toast.success(`${mode === "live" ? "Live" : "Test"} API key created`, {
        description: "Copy it now — the full key won't be shown again.",
      });
    } catch (e: any) {
      toast.error("Failed to create key", { description: e.message });
    }
  };

  const revoke = async (id: string) => {
    try {
      const r = await fetch(`/api/v1/api-keys/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Failed to revoke");
      setKeys((k) => k.filter((x) => x.id !== id));
      toast.error("API key revoked", { description: "Any integration using it will stop working immediately." });
    } catch (e: any) {
      toast.error("Failed to revoke key", { description: e.message });
    }
  };

  const visibleKeys = keys;

  return (
    <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-brand" />
          <p className="text-sm font-semibold">API Keys</p>
          <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground">
            {visibleKeys.length} {mode} keys
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="inline-flex items-center rounded-full border border-border/60 bg-background/40 p-0.5">
            {(["test", "live"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  mode === m
                    ? m === "live"
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-amber-500/20 text-amber-300"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "live" ? "Live" : "Test"}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={create}
            className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-xs text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New key
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {visibleKeys.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 py-8 text-center text-xs text-muted-foreground">
            No {mode} keys yet. Create one to get started.
          </div>
        )}
        {visibleKeys.map((k) => {
          const shown = reveal[k.id];
          // For newly-created keys, show the full key. For loaded keys, only the prefix is available.
          const displayKey = k.isNew ? k.key : (k.keyPrefix ? `${k.keyPrefix}••••••••••••` : "••••••••");
          const masked = k.keyPrefix ? `${k.keyPrefix}••••••••••••` : "••••••••";
          return (
            <div key={k.id} className={`rounded-xl border p-3 ${k.isNew ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/40 bg-background/30"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold">{k.label}</p>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                        k.live ? "bg-rose-500/15 text-rose-300" : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {k.live ? "live" : "test"}
                    </span>
                    {k.isNew && (
                      <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-emerald-300">
                        New — copy now
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {k.isNew ? (shown ? displayKey : masked) : masked}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {k.isNew
                      ? "Full key shown once — store it securely."
                      : `Created ${k.created}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {k.isNew && (
                    <button
                      onClick={() => setReveal((r) => ({ ...r, [k.id]: !r[k.id] }))}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                      aria-label="Toggle reveal"
                    >
                      {shown ? "🙈" : "👁"}
                    </button>
                  )}
                  <CopyButton text={k.isNew ? k.key : (k.keyPrefix || "")} label={k.isNew ? "Copy key" : "Prefix"} />
                  <button
                    onClick={() => revoke(k.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                    aria-label="Revoke key"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EndpointExplorer() {
  const [epId, setEpId] = useState(ENDPOINTS[0].id);
  const [lang, setLang] = useState<Lang>("cURL");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const ep = useMemo(() => ENDPOINTS.find((e) => e.id === epId)!, [epId]);
  const apiKey = "nxp_test_8h2k9nbq01def456abc789";
  const code = useMemo(() => buildCodeSample(lang, ep, apiKey), [lang, ep]);

  const [response, setResponse] = useState<any>(null);
  const [respStatus, setRespStatus] = useState<number | null>(null);
  const [respMs, setRespMs] = useState<number | null>(null);

  const send = async () => {
    setLoading(true);
    setSent(false);
    setResponse(null);
    setRespStatus(null);
    setRespMs(null);
    const t0 = performance.now();
    try {
      // Map the endpoint's mock body / params to a real fetch
      const init: RequestInit = {
        method: ep.method,
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      };
      if (ep.method !== "GET" && ep.body) init.body = JSON.stringify(ep.body);

      const r = await fetch(`/api${ep.path}`, init);
      const ms = Math.round(performance.now() - t0);
      setRespMs(ms);
      setRespStatus(r.status);
      const json = await r.json();
      setResponse(json.data ?? json);
      setSent(true);
      if (r.ok) {
        toast.success(`${ep.method} ${ep.path} → ${r.status} OK`, {
          description: `Real response from database · ${ms}ms`,
        });
      } else {
        toast.error(`${ep.method} ${ep.path} → ${r.status}`, {
          description: json.error || "Request failed",
        });
      }
    } catch (e: any) {
      setRespMs(Math.round(performance.now() - t0));
      setRespStatus(0);
      setResponse({ error: e.message });
      setSent(true);
      toast.error("Network error", { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-brand" />
        <p className="text-sm font-semibold">Endpoint Explorer</p>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Sandbox
        </span>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* Endpoint list */}
        <div className="flex flex-col gap-1 thin-scroll max-h-[420px] overflow-y-auto pr-1">
          {ENDPOINTS.map((e) => (
            <button
              key={e.id}
              onClick={() => { setEpId(e.id); setSent(false); }}
              className={`flex items-start gap-2 rounded-xl border p-2.5 text-left transition-all ${
                e.id === epId
                  ? "border-brand/60 bg-gradient-to-br from-brand/10 to-brand-2/5"
                  : "border-border/40 bg-background/30 hover:border-brand/30"
              }`}
            >
              <span className={`inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${METHOD_COLORS[e.method]}`}>
                {e.method}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{e.title}</p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">{e.path}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${METHOD_COLORS[ep.method]}`}>
                {ep.method}
              </span>
              <code className="font-mono text-sm">{ep.path}</code>
            </div>
            <h4 className="mt-2 text-sm font-semibold">{ep.title}</h4>
            <p className="text-xs text-muted-foreground">{ep.desc}</p>
          </div>

          {/* Request body */}
          {ep.body && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Request body</p>
              <pre className="thin-scroll overflow-x-auto rounded-xl border border-border/40 bg-background/40 p-3 font-mono text-[11px] leading-relaxed">
{JSON.stringify(ep.body, null, 2)}
              </pre>
            </div>
          )}

          {/* Code sample */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Code sample</p>
              <div className="flex items-center gap-1">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-all ${
                      lang === l
                        ? "bg-gradient-to-r from-brand/30 to-brand-2/20 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <pre className="thin-scroll max-h-64 overflow-auto rounded-xl border border-border/40 bg-background/40 p-3 pr-12 font-mono text-[11px] leading-relaxed">
{code}
              </pre>
              <div className="absolute right-2 top-2">
                <CopyButton text={code} />
              </div>
            </div>
          </div>

          {/* Send + response */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Response</p>
              <button
                onClick={send}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 px-3 py-1 text-[11px] font-semibold text-primary-foreground disabled:opacity-60"
              >
                {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/40 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  !sent
                    ? "bg-muted text-muted-foreground"
                    : respStatus && respStatus >= 200 && respStatus < 300
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                }`}>
                  {sent ? `${respStatus} ${respStatus && respStatus >= 200 && respStatus < 300 ? "OK" : "Error"}` : "—"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {sent ? `${respMs}ms · real DB response` : "Click Send to run a real request against the database"}
                </span>
              </div>
              <pre className="thin-scroll max-h-56 overflow-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
{sent ? JSON.stringify(response, null, 2) : "// Response will appear here"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebhooksPanel() {
  const [sel, setSel] = useState(WEBHOOKS[0].event);
  const sample = {
    id: "evt_9K2nPp",
    object: "event",
    type: sel,
    api_version: "2026-09-14",
    created: 1726298400,
    data: { object: { id: "pay_8h2k9nbQ01", amount: 5000, currency: "NGN", status: "succeeded" } },
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur">
        <div className="flex items-center gap-2">
          <Webhook className="h-4 w-4 text-brand" />
          <p className="text-sm font-semibold">Webhook events</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Subscribe to 8 event types. Sign every webhook with HMAC-SHA256.</p>
        <div className="mt-3 flex flex-col gap-1 thin-scroll max-h-72 overflow-y-auto pr-1">
          {WEBHOOKS.map((w) => (
            <button
              key={w.event}
              onClick={() => setSel(w.event)}
              className={`flex flex-col items-start gap-0.5 rounded-xl border p-2.5 text-left transition-all ${
                sel === w.event ? "border-brand/60 bg-brand/10" : "border-border/40 bg-background/30 hover:border-brand/30"
              }`}
            >
              <code className="font-mono text-xs font-semibold text-brand">{w.event}</code>
              <p className="text-[11px] text-muted-foreground">{w.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Sample payload</p>
          <CopyButton text={JSON.stringify(sample, null, 2)} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">POST to your endpoint · header: <code className="font-mono text-brand">NexaPay-Signature</code></p>
        <pre className="mt-3 thin-scroll max-h-72 overflow-auto rounded-xl border border-border/40 bg-background/40 p-3 font-mono text-[11px] leading-relaxed">
{JSON.stringify(sample, null, 2)}
        </pre>
        <div className="mt-3 rounded-xl border border-border/40 bg-background/30 p-3 text-[11px]">
          <p className="font-semibold">Verify signature (Node.js)</p>
          <pre className="mt-1.5 thin-scroll overflow-x-auto font-mono text-[10px] text-muted-foreground">
{`const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', process.env.NEXA_WEBHOOK_SECRET);
const digest = 'v1=' + hmac.update(rawBody).digest('hex');
if (digest === signature) {
  // ✅ verified — process the event
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ============ Main ============ */

export function DeveloperGateway() {
  return (
    <Section id="developers" className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Developers"
        title={<>Build on the <span className="text-gradient">Nexa Pay API</span></>}
        desc="One REST API for payments, cards, foreign accounts, payouts, payroll and more. Test in the sandbox, ship to live — with SDKs in 5 languages and HMAC-signed webhooks."
      />

      {/* Hero strip */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Globe2, label: "REST API", v: "v1 · JSON" },
          { icon: ShieldCheck, label: "Auth", v: "Bearer API keys" },
          { icon: Activity, label: "Uptime", v: "99.98% SLA" },
          { icon: Zap, label: "P95 latency", v: "< 180ms" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
            <s.icon className="h-4 w-4 text-brand" />
            <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="font-display text-base font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Quickstart / SDKs */}
      <div className="mt-6 rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 to-background/40 p-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold">Quickstart in 3 steps</p>
            <p className="text-xs text-muted-foreground">Install the SDK → set your API key → make your first call.</p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <BookOpen className="h-3.5 w-3.5" /> Read full docs
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.1fr_1fr]">
          {/* SDK tabs */}
          <div className="rounded-2xl border border-border/40 bg-background/30 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">1. Install SDK</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {SDKS.map((s) => (
                <span key={s.lang} className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-[11px]">
                  <span>{s.icon}</span>
                  {s.lang}
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-3 py-2">
                <code className="font-mono text-[11px]">$ npm install @nexapay/node</code>
                <CopyButton text="npm install @nexapay/node" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-3 py-2">
                <code className="font-mono text-[11px]">$ pip install nexapay</code>
                <CopyButton text="pip install nexapay" />
              </div>
            </div>
          </div>

          {/* First call */}
          <div className="rounded-2xl border border-border/40 bg-background/30 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">2. Make your first call</p>
            <pre className="mt-2 thin-scroll overflow-x-auto rounded-lg border border-border/40 bg-background/40 p-3 font-mono text-[11px] leading-relaxed">
{`import NexaPay from "@nexapay/node";
const nexa = new NexaPay(process.env.NEXA_KEY);

const payment = await nexa.createPayment({
  amount: 5000,
  currency: "NGN",
  channel: "card",
  reference: "nxp-order-90213",
});
console.log(payment.status); // → "succeeded"`}
            </pre>
            <p className="mt-2 text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground">3.</span> Add a webhook URL in the dashboard, sign every event with your secret, and you're live.
            </p>
          </div>
        </div>
      </div>

      {/* API Keys panel */}
      <div className="mt-6">
        <ApiKeysPanel />
      </div>

      {/* Endpoint explorer */}
      <div className="mt-6">
        <EndpointExplorer />
      </div>

      {/* Webhooks */}
      <div className="mt-6">
        <WebhooksPanel />
      </div>

      {/* Rate limits + status */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand" />
            <p className="text-sm font-semibold">Rate limits</p>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Test mode</span><code className="font-mono">100 req/min</code></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Live · standard</span><code className="font-mono">1,000 req/min</code></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Live · scale</span><code className="font-mono">10,000 req/min</code></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Burst</span><code className="font-mono">2x for 5s</code></div>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">429 response includes <code className="font-mono">Retry-After</code> header.</p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-brand" />
            <p className="text-sm font-semibold">API versioning</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Pin to a specific version per request. Breaking changes ship as new dated versions — your integration never breaks silently.</p>
          <div className="mt-3 flex items-center gap-2">
            <code className="rounded-md border border-border/40 bg-background/40 px-2 py-1 font-mono text-[11px]">NexaPay-Version: 2026-09-14</code>
            <CopyButton text="NexaPay-Version: 2026-09-14" />
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">Current: <code className="font-mono">2026-09-14</code> · 2 supported versions</p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-emerald-500/10 to-brand/5 p-5 backdrop-blur">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold">System status</p>
          </div>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> All systems operational
          </p>
          <div className="mt-3 flex items-end gap-1">
            {[100, 100, 100, 99.9, 100, 100, 99.95, 100, 100, 100, 99.99, 100, 100, 100].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-emerald-400/70"
                style={{ height: `${Math.max(20, v)}%`, aspectRatio: "1/2" }}
                title={`${v}%`}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Last 14 days · 99.98% uptime</p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-6 backdrop-blur sm:flex-row">
        <div>
          <p className="font-display text-lg font-semibold">Ready to build?</p>
          <p className="text-sm text-muted-foreground">Get free test API keys — no credit card, no setup call, no friction.</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => toast.success("Dashboard opened", { description: "Create your free account to get live keys." })}
            className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
          >
            <KeyRound className="h-3.5 w-3.5" /> Get API keys
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("API reference — demo only")}
            className="gap-1.5 rounded-full border-border/60 bg-card/40 backdrop-blur"
          >
            <BookOpen className="h-3.5 w-3.5" /> Full reference
          </Button>
        </div>
      </div>
    </Section>
  );
}
