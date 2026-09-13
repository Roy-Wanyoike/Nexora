"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CreditCard, Landmark, Bitcoin, Wifi,
  Receipt, Building2, PiggyBank, Bell, Search, Settings,
  ArrowUpRight, ArrowDownLeft, Plus, Send, Eye, EyeOff,
  Snowflake, MoreHorizontal, Check, TrendingUp, RefreshCw,
  QrCode, Zap, Tv, Smartphone, Users, Link2,
} from "lucide-react";
import { Section, SectionHeading } from "../section";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab =
  | "overview" | "cards" | "foreign" | "crypto" | "esim"
  | "bills" | "business" | "savings";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "foreign", label: "Foreign", icon: Landmark },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "esim", label: "eSIM", icon: Wifi },
  { id: "bills", label: "Bills", icon: Receipt },
  { id: "business", label: "Business", icon: Building2 },
  { id: "savings", label: "Savings", icon: PiggyBank },
];

export function AppDemo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [hidden, setHidden] = useState(false);

  return (
    <Section id="app-demo" className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Live Demo"
        title={<>Try The <span className="text-gradient">Nexa Pay Dashboard</span></>}
        desc="This is a working interactive demo — click around the tabs, freeze a card, top up an eSIM, run payroll. No sign-up required."
      />

      <div className="mt-12 overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-background/40 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="mx-auto hidden items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            app.nexapay.africa/dashboard
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/40 py-1 pl-1 pr-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand to-brand-3" />
              <span className="text-xs font-medium">John D.</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="border-b border-border/60 bg-background/30 p-3 md:border-b-0 md:border-r">
            <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible thin-scroll">
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                      active
                        ? "bg-gradient-to-r from-brand/20 to-brand-2/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    }`}
                  >
                    <t.icon className={`h-4 w-4 ${active ? "text-brand" : ""}`} />
                    {t.label}
                    {active && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-brand md:inline-block" />}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 hidden rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-3 md:block">
              <p className="text-xs font-semibold">Upgrade to Plus</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Unlock crypto, locked savings & more.</p>
              <Button
                size="sm"
                className="mt-2 w-full rounded-full bg-gradient-to-r from-brand to-brand-2 text-xs text-primary-foreground"
                onClick={() => toast.success("Upgrade flow opened", { description: "This is a demo — no real upgrade." })}
              >
                Upgrade
              </Button>
            </div>
          </aside>

          {/* Main */}
          <div className="min-h-[640px] bg-gradient-to-br from-background/40 to-card/20 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {tab === "overview" && <Overview hidden={hidden} setHidden={setHidden} />}
                {tab === "cards" && <Cards />}
                {tab === "foreign" && <Foreign />}
                {tab === "crypto" && <CryptoPanel />}
                {tab === "esim" && <ESIMPanel />}
                {tab === "bills" && <BillsPanel />}
                {tab === "business" && <BusinessPanel />}
                {tab === "savings" && <SavingsPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ====== Panels ====== */

function PanelHeader({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {action}
    </div>
  );
}

function Overview({ hidden, setHidden }: { hidden: boolean; setHidden: (v: boolean) => void }) {
  return (
    <div>
      <PanelHeader
        title="Welcome back, John"
        desc="Here's what's happening across your money today."
        action={
          <Button
            size="sm"
            className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
            onClick={() => toast.success("Top-up modal opened", { description: "Demo only — no real funds moved." })}
          >
            <Plus className="h-3.5 w-3.5" /> Top up
          </Button>
        }
      />

      {/* Balance cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total balance", value: "$12,438.50", sub: "≈ ₦20,025,905", grad: "from-brand/20 to-brand-2/10" },
          { label: "USD account", value: "$4,876,907.65", sub: "≈ ₦7,859,861,365", grad: "from-emerald-500/20 to-teal-500/10" },
          { label: "GBP account", value: "£214,508.10", sub: "≈ ₦431,853,612", grad: "from-cyan-500/20 to-blue-500/10" },
          { label: "EUR account", value: "€98,217.40", sub: "≈ ₦173,904,788", grad: "from-violet-500/20 to-purple-500/10" },
        ].map((b) => (
          <div key={b.label} className={`rounded-2xl border border-border/60 bg-gradient-to-br ${b.grad} p-4 backdrop-blur`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{b.label}</p>
              <button
                onClick={() => setHidden(!hidden)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Toggle balance visibility"
              >
                {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className={`mt-1 font-display text-xl font-bold ${hidden ? "blur-sm select-none" : ""}`}>
              {b.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{b.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + activity */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Cash flow · last 30 days</p>
              <p className="text-xs text-muted-foreground">In vs Out, in USD</p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-emerald-300">
              <TrendingUp className="h-3 w-3" /> +18.4% vs last month
            </div>
          </div>
          <MiniChart />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <p className="text-sm font-semibold">Recent activity</p>
          <div className="mt-3 flex flex-col gap-2 thin-scroll max-h-[300px] overflow-y-auto pr-1">
            {[
              { icon: ArrowUpRight, name: "To Sarah · USD", time: "Today, 14:02", amt: "-$240.00", color: "text-rose-400" },
              { icon: ArrowDownLeft, name: "Stripe payout", time: "Today, 09:55", amt: "+$1,820.00", color: "text-emerald-400" },
              { icon: Wifi, name: "eSIM · UK 10GB", time: "Yesterday", amt: "-$8.99", color: "text-rose-400" },
              { icon: Receipt, name: "DStv renewal", time: "Yesterday", amt: "-₦14,250", color: "text-rose-400" },
              { icon: ArrowDownLeft, name: "From client · GBP", time: "2 days ago", amt: "+£880.00", color: "text-emerald-400" },
              { icon: Bitcoin, name: "Bought USDC", time: "2 days ago", amt: "-$500.00", color: "text-rose-400" },
              { icon: ArrowUpRight, name: "Payroll · Sept", time: "3 days ago", amt: "-$48,210.00", color: "text-rose-400" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <t.icon className={`h-3.5 w-3.5 ${t.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{t.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{t.time}</p>
                </div>
                <p className={`text-xs font-semibold ${t.color}`}>{t.amt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Send, label: "Send money" },
          { icon: ArrowDownLeft, label: "Request" },
          { icon: QrCode, label: "Scan & pay" },
          { icon: Plus, label: "Add card" },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => toast.info(`${a.label} — demo only`)}
            className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/40 p-3 text-sm font-medium backdrop-blur transition-colors hover:border-brand/50 hover:text-brand"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand/25 to-brand-2/15 text-brand">
              <a.icon className="h-4 w-4" />
            </div>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniChart() {
  // simple SVG area chart
  const pts = [22, 30, 26, 38, 32, 48, 44, 58, 52, 70, 64, 82];
  const w = 100;
  const h = 32;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const path = pts
    .map((p, i) => `${(i / (pts.length - 1)) * w},${h - ((p - min) / range) * (h - 4) - 2}`)
    .join(" ");
  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-32 w-full">
        <defs>
          <linearGradient id="chartg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.16 165)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.82 0.16 165)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={path} fill="none" stroke="oklch(0.82 0.16 165)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        <polygon points={`0,${h} ${path} ${w},${h}`} fill="url(#chartg)" />
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
        {["Aug 15", "Aug 22", "Aug 29", "Sep 5", "Sep 12"].map((d) => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
}

function Cards() {
  const [frozen, setFrozen] = useState(false);
  const [cards] = useState([
    { name: "USD Virtual", last4: "4591", brand: "Nexa Pay · Visa", grad: "from-emerald-600 via-brand to-cyan-500", active: true },
    { name: "Naira Virtual", last4: "8821", brand: "Nexa Pay · Verve", grad: "from-violet-700 via-fuchsia-600 to-rose-500", active: true },
    { name: "Physical Debit", last4: "7720", brand: "Nexa Pay · Mastercard", grad: "from-slate-700 via-slate-600 to-slate-500", active: false },
  ]);
  const [sel, setSel] = useState(0);
  const c = cards[sel];

  return (
    <div>
      <PanelHeader
        title="My Cards"
        desc="Freeze, flag, block or create cards in seconds."
        action={
          <Button
            size="sm"
            className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
            onClick={() => toast.success("Card creation started", { description: "Choose USD or NGN — demo only." })}
          >
            <Plus className="h-3.5 w-3.5" /> New card
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Card visual */}
        <div>
          <motion.div
            key={sel}
            initial={{ opacity: 0, rotateY: 12 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.4 }}
            className={`relative aspect-[1.6/1] w-full overflow-hidden rounded-3xl bg-gradient-to-br ${c.grad} p-6 text-white shadow-2xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-80">{c.brand}</p>
                <p className="mt-1 text-xs font-semibold opacity-90">{c.name}</p>
              </div>
              <CreditCard className="h-5 w-5 opacity-80" />
            </div>
            <div className="mt-6 mb-3 h-9 w-12 rounded-md bg-yellow-300/80" />
            <p className="font-mono text-base tracking-widest sm:text-lg">4123 •••• •••• {c.last4}</p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-[11px] font-medium">JOHN DOE</p>
              <p className="text-[10px] opacity-80">08/29</p>
            </div>
            {frozen && (
              <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/20 backdrop-blur-[2px]">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                  <Snowflake className="h-3.5 w-3.5" /> Frozen
                </div>
              </div>
            )}
          </motion.div>

          {/* Card selector */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {cards.map((cc, i) => (
              <button
                key={cc.last4}
                onClick={() => { setSel(i); setFrozen(false); }}
                className={`rounded-xl border p-2 text-left transition-all ${
                  i === sel ? "border-brand/60 bg-brand/10" : "border-border/60 bg-card/40 hover:border-brand/30"
                }`}
              >
                <p className="text-[10px] text-muted-foreground">{cc.name}</p>
                <p className="text-xs font-mono">••{cc.last4}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setFrozen((v) => !v); toast.success(frozen ? "Card unfrozen" : "Card frozen", { description: `•••• ${c.last4}` }); }}
              className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition-all ${
                frozen ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300" : "border-border/60 bg-card/40 hover:border-brand/50"
              }`}
            >
              <Snowflake className="h-4 w-4" />
              {frozen ? "Unfreeze" : "Freeze"}
            </button>
            <button
              onClick={() => toast.info("Spending limits — demo only")}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 p-3 text-sm hover:border-brand/50"
            >
              <Settings className="h-4 w-4" /> Limits
            </button>
            <button
              onClick={() => toast.info("Card details — demo only")}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 p-3 text-sm hover:border-brand/50"
            >
              <Eye className="h-4 w-4" /> Details
            </button>
            <button
              onClick={() => toast.error("Card deleted (demo)", { description: "This action is reversible in production." })}
              className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300 hover:bg-rose-500/20"
            >
              <MoreHorizontal className="h-4 w-4" /> Delete
            </button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
            <p className="text-xs font-semibold">Recent charges · {c.name}</p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { m: "Netflix", t: "Today", a: "-$15.99" },
                { m: "AWS", t: "Yesterday", a: "-$84.20" },
                { m: "Spotify", t: "3 days ago", a: "-$9.99" },
                { m: "Apple iCloud", t: "5 days ago", a: "-$2.99" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/30 p-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-[10px] font-bold">
                    {r.m[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{r.m}</p>
                    <p className="text-[10px] text-muted-foreground">{r.t}</p>
                  </div>
                  <p className="text-xs font-semibold text-rose-400">{r.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Foreign() {
  const [cur, setCur] = useState<"USD" | "GBP" | "EUR" | "CNY">("USD");
  const data: Record<string, any> = {
    USD: { bal: "$4,876,907.65", ngn: "≈ ₦7,859,861,365", num: "•••• 4591", routing: "084009519", bank: "Nexa Pay / Evolve", type: "Routing & account · ACH, wire & SWIFT" },
    GBP: { bal: "£214,508.10", ngn: "≈ ₦431,853,612", num: "•••• 8821", routing: "Sort 04-00-19", bank: "Nexa Pay UK Ltd", type: "UK sort code · Faster Payments & CHAPS" },
    EUR: { bal: "€98,217.40", ngn: "≈ ₦173,904,788", num: "DE89 •••• 4591", routing: "BIC PAYSDEMM", bank: "Nexa Pay EU GmbH", type: "IBAN · SEPA across 36 countries" },
    CNY: { bal: "¥328,490.00", ngn: "≈ ₦71,924,924", num: "•••• 7720", routing: "CNAPS 104100000004", bank: "Nexa Pay China", type: "RMB · CNAPS & CIPS · UnionPay" },
  };
  const d = data[cur];

  return (
    <div>
      <PanelHeader
        title="Foreign Accounts"
        desc="Real foreign bank accounts — not just wallets."
        action={
          <Button
            size="sm"
            className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
            onClick={() => toast.success("Account details copied", { description: `Share with sender to receive ${cur}.` })}
          >
            <Check className="h-3.5 w-3.5" /> Copy details
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["USD", "GBP", "EUR", "CNY"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCur(c)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all ${
              cur === c ? "border-brand/60 bg-gradient-to-r from-brand/15 to-brand-2/10" : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-semibold">{c}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-background/40 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{d.type}</p>
          <p className="mt-2 font-display text-4xl font-bold">
            <span className="text-gradient">{d.bal}</span>
          </p>
          <p className="text-xs text-muted-foreground">{d.ngn}</p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              { k: "Account name", v: "John Doe" },
              { k: "Account number", v: d.num },
              { k: "Routing / BIC", v: d.routing },
              { k: "Bank", v: d.bank },
            ].map((r) => (
              <div key={r.k} className="rounded-xl border border-border/40 bg-background/30 p-3">
                <p className="text-[10px] uppercase text-muted-foreground">{r.k}</p>
                <p className="font-mono text-sm">{r.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: ArrowDownLeft, label: "Top up", toast: "Top-up instructions shared" },
              { icon: ArrowUpRight, label: "Withdraw", toast: "Withdrawal initiated — demo only" },
              { icon: RefreshCw, label: "Convert", toast: "FX conversion opened" },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => toast.success(b.toast, { description: `${cur} account · demo only` })}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_var(--brand)]"
              >
                <b.icon className="h-3.5 w-3.5" />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <p className="text-sm font-semibold">Recent transfers</p>
          <div className="mt-3 flex flex-col gap-2">
            {[
              { icon: ArrowDownLeft, name: "Stripe payout", t: "Today", a: "+$1,820.00", c: "text-emerald-400" },
              { icon: ArrowUpRight, name: "To vendor · PayPal", t: "Yesterday", a: "-$340.00", c: "text-rose-400" },
              { icon: ArrowDownLeft, name: "Client wire · SWIFT", t: "3 days ago", a: "+$8,200.00", c: "text-emerald-400" },
              { icon: RefreshCw, name: "FX → NGN", t: "5 days ago", a: "-$2,000.00", c: "text-rose-400" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
                  <r.icon className={`h-3.5 w-3.5 ${r.c}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{r.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{r.t}</p>
                </div>
                <p className={`text-xs font-semibold ${r.c}`}>{r.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CryptoPanel() {
  const [coin, setCoin] = useState<"USDC" | "USDT" | "PYUSD">("USDC");
  const coins = {
    USDC: { sym: "$", name: "USD Coin", bal: "8,420.50", sub: "≈ $8,420.50", desc: "Fully-reserved USD stablecoin by Circle" },
    USDT: { sym: "₮", name: "Tether", bal: "3,200.00", sub: "≈ $3,200.00", desc: "The most widely-used USD stablecoin" },
    PYUSD: { sym: "$", name: "PayPal USD", bal: "818.00", sub: "≈ $818.00", desc: "USD stablecoin issued by PayPal" },
  };
  const c = coins[coin];

  return (
    <div>
      <PanelHeader
        title="Crypto Wallet"
        desc="Buy, hold & send USDC, USDT and PYUSD — convert to NGN anytime."
        action={
          <Button size="sm" className="gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Plus className="h-3.5 w-3.5" /> Buy
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.name}</p>
            <Bitcoin className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-2 font-display text-3xl font-bold">
            <span className="text-gradient">{c.sym}{c.bal}</span>
          </p>
          <p className="text-xs text-muted-foreground">{c.sub}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{c.desc}</p>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { icon: ArrowDownLeft, label: "Buy", t: "Buy order opened" },
              { icon: ArrowUpRight, label: "Sell", t: "Sell order opened" },
              { icon: RefreshCw, label: "Swap", t: "Swap widget opened" },
              { icon: Send, label: "Send", t: "Send form opened" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => toast.success(a.t, { description: `${coin} · demo only` })}
                className="flex flex-col items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-2.5 text-[11px] font-semibold text-white"
              >
                <a.icon className="h-3.5 w-3.5" />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <p className="text-sm font-semibold">Holdings</p>
          <div className="mt-3 flex flex-col gap-2">
            {(Object.keys(coins) as Array<keyof typeof coins>).map((k) => {
              const cc = coins[k];
              return (
                <button
                  key={k}
                  onClick={() => setCoin(k as any)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    coin === k ? "border-amber-500/60 bg-amber-500/10" : "border-border/40 bg-background/30 hover:border-amber-500/30"
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/20 text-sm font-bold text-amber-400">
                    {cc.sym}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{k}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{cc.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{cc.sym}{cc.bal}</p>
                    <p className="text-[10px] text-muted-foreground">{cc.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-border/40 bg-background/30 p-3 text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">Fees:</span> 1% buy/sell (min $0.25) · 1.25% withdraw to NGN ·
            No spread markup · Network fees passed at cost.
          </div>
        </div>
      </div>
    </div>
  );
}

function ESIMPanel() {
  const [installed, setInstalled] = useState(true);
  return (
    <div>
      <PanelHeader
        title="eSIM Data Plans"
        desc="190+ countries. Install in seconds, top up on the fly."
        action={
          <Button size="sm" className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> New plan
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Active plan */}
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Active plan</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold">🇬🇧 United Kingdom · 10GB</p>
          <p className="text-xs text-muted-foreground">30-day plan · expires in 23 days</p>

          <div className="mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">6.2GB used</span>
              <span className="font-semibold">3.8GB left</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-accent">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-brand to-brand-2" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: Plus, label: "Top up", t: "Top-up options opened" },
              { icon: RefreshCw, label: "Extend", t: "Plan extended — demo only" },
              { icon: QrCode, label: "Install QR", t: "Install QR shown" },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => toast.success(b.t, { description: "eSIM · demo only" })}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-3 py-2.5 text-xs font-semibold text-primary-foreground"
              >
                <b.icon className="h-3.5 w-3.5" />
                {b.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setInstalled(false)}
            className="mt-3 w-full rounded-xl border border-border/60 bg-card/40 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Deactivate plan
          </button>
        </div>

        {/* Browse plans */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <p className="text-sm font-semibold">Popular destinations</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { f: "🇺🇸", n: "United States", d: "10GB / 30d", p: "$12.00" },
              { f: "🇨🇦", n: "Canada", d: "8GB / 30d", p: "$10.50" },
              { f: "🇩🇪", n: "Germany", d: "12GB / 30d", p: "$9.20" },
              { f: "🇦🇪", n: "UAE", d: "5GB / 30d", p: "$14.00" },
              { f: "🇯🇵", n: "Japan", d: "10GB / 30d", p: "$11.30" },
              { f: "🇿🇦", n: "South Africa", d: "12GB / 30d", p: "$7.40" },
            ].map((c) => (
              <button
                key={c.n}
                onClick={() => toast.success(`Installed ${c.n} plan`, { description: `${c.d} · ${c.p} — demo only` })}
                className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/30 p-3 text-left transition-all hover:border-brand/50"
              >
                <span className="text-2xl">{c.f}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{c.n}</p>
                  <p className="text-[10px] text-muted-foreground">{c.d}</p>
                </div>
                <p className="text-xs font-semibold text-brand">{c.p}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BillsPanel() {
  const [paid, setPaid] = useState<string | null>(null);
  const items = [
    { icon: Smartphone, name: "MTN · 0803 ••• 4521", amt: "₦2,000", cat: "Airtime" },
    { icon: Zap, name: "IKEDC · prepaid meter", amt: "₦10,000", cat: "Electricity" },
    { icon: Tv, name: "DStv Compact Plus", amt: "₦14,250", cat: "Subscription" },
    { icon: Smartphone, name: "Glo · 0805 ••• 8820", amt: "₦1,500", cat: "Data" },
  ];
  return (
    <div>
      <PanelHeader
        title="Bills & Top-ups"
        desc="Airtime, data, electricity, DStv, GOtv, StarTimes & more."
        action={
          <Button size="sm" className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> New payment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Smartphone, label: "Airtime", color: "from-emerald-500/20 to-teal-500/10" },
          { icon: Zap, label: "Electricity", color: "from-amber-500/20 to-orange-500/10" },
          { icon: Tv, label: "TV & streaming", color: "from-violet-500/20 to-purple-500/10" },
          { icon: Receipt, label: "Internet & water", color: "from-cyan-500/20 to-blue-500/10" },
        ].map((c) => (
          <button
            key={c.label}
            onClick={() => toast.info(`${c.label} — choose beneficiary`)}
            className={`rounded-2xl border border-border/60 bg-gradient-to-br ${c.color} p-4 text-left backdrop-blur lift`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/60 text-brand">
              <c.icon className="h-4 w-4" />
            </div>
            <p className="mt-2 text-sm font-semibold">{c.label}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
        <p className="text-sm font-semibold">Saved beneficiaries · 1-tap repeat</p>
        <div className="mt-3 flex flex-col gap-2">
          {items.map((it) => (
            <div key={it.name} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <it.icon className="h-4 w-4 text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{it.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{it.cat}</p>
              </div>
              <p className="text-xs font-semibold">{it.amt}</p>
              <button
                onClick={() => {
                  setPaid(it.name);
                  toast.success("Payment sent", { description: `${it.name} · ${it.amt}` });
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  paid === it.name
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
                }`}
              >
                {paid === it.name ? (
                  <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> Paid</span>
                ) : (
                  "Pay"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessPanel() {
  const [run, setRun] = useState(false);
  const employees = [
    { name: "Sarah Adeyemi", role: "Engineering Lead", amt: "$8,400.00", cur: "USD", status: "approved" },
    { name: "Tunde Bello", role: "Product Designer", amt: "$5,200.00", cur: "USD", status: "approved" },
    { name: "Aisha Mohammed", role: "Customer Success", amt: "₦920,000", cur: "NGN", status: "pending" },
    { name: "Kwame Mensah", role: "Operations", amt: "£3,800.00", cur: "GBP", status: "approved" },
    { name: "Chiamaka Eze", role: "Marketing", amt: "₦640,000", cur: "NGN", status: "pending" },
  ];
  return (
    <div>
      <PanelHeader
        title="Business · Payroll"
        desc="Pay your team in one click — across NGN, USD, GBP & EUR."
        action={
          <Button
            size="sm"
            onClick={() => {
              setRun(true);
              toast.success("Payroll run started", { description: "5 employees · $48,210.00 total — demo only" });
            }}
            className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
          >
            <Check className="h-3.5 w-3.5" /> Run payroll
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "This month", v: "$48,210.00", s: "28 employees" },
          { label: "Approved", v: "20", s: "ready to pay" },
          { label: "Pending", v: "5", s: "needs review" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.s}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">September 2026 · Payroll run</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" /> 5 of 28 shown
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {employees.map((e) => (
            <div key={e.name} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand/30 to-brand-3/20 text-xs font-bold text-brand">
                {e.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{e.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{e.role}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold">{e.amt}</p>
                <p className="text-[10px] text-muted-foreground">{e.cur}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                e.status === "approved" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
              }`}>
                {e.status}
              </span>
            </div>
          ))}
        </div>
        {run && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300"
          >
            ✓ Payroll scheduled — 20 employees will be paid on Sept 30, 2026. Total: $48,210.00.
          </motion.div>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Link2, label: "Payment links", v: "12 active" },
          { icon: Receipt, label: "Invoices", v: "8 outstanding" },
          { icon: TrendingUp, label: "Spend this month", v: "$28,420" },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => toast.info(`${s.label} view — demo only`)}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 text-left backdrop-blur lift"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand/25 to-brand-2/15 text-brand">
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold">{s.v}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SavingsPanel() {
  const vaults = [
    { name: "Emergency Fund", saved: 840000, goal: 1500000, apy: "8% APY", locked: false, color: "from-emerald-500/20 to-teal-500/10" },
    { name: "Lagos Rent 2027", saved: 2100000, goal: 3000000, apy: "12% APY", locked: true, color: "from-amber-500/20 to-orange-500/10" },
    { name: "New MacBook", saved: 540000, goal: 1200000, apy: "6% APY", locked: false, color: "from-violet-500/20 to-purple-500/10" },
  ];
  const fmt = (n: number) => "₦" + n.toLocaleString();
  const total = vaults.reduce((a, v) => a + v.saved, 0);

  return (
    <div>
      <PanelHeader
        title="Piggy Savings"
        desc="Auto-save, lock funds, earn up to 12% APY paid daily."
        action={
          <Button
            size="sm"
            onClick={() => toast.success("New vault created", { description: "Demo only" })}
            className="gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New vault
          </Button>
        }
      />

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total saved</p>
            <p className="font-display text-3xl font-bold"><span className="text-gradient">{fmt(total)}</span></p>
            <p className="inline-flex items-center gap-1 text-xs text-emerald-300">
              <TrendingUp className="h-3 w-3" /> +₦48,210 earned this month
            </p>
          </div>
          <PiggyBank className="h-10 w-10 text-brand" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Auto-save rules", v: "3 active" },
          { label: "Earned this year", v: "₦412,800" },
          { label: "Avg APY", v: "9.4%" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-xl font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {vaults.map((v) => {
          const pct = Math.min(100, Math.round((v.saved / v.goal) * 100));
          return (
            <div key={v.name} className={`rounded-2xl border border-border/60 bg-gradient-to-br ${v.color} p-5 backdrop-blur`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{v.name}</p>
                {v.locked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    <Snowflake className="h-2.5 w-2.5" /> Locked
                  </span>
                )}
              </div>
              <p className="mt-2 font-display text-2xl font-bold">{fmt(v.saved)}</p>
              <p className="text-[10px] text-muted-foreground">Goal {fmt(v.goal)}</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-accent">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{pct}%</span>
                <span className="text-emerald-300">{v.apy}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => toast.success("Top-up opened", { description: `${v.name} · demo only` })}
                  className="rounded-lg bg-gradient-to-r from-brand to-brand-2 py-2 text-[11px] font-semibold text-primary-foreground"
                >
                  Add funds
                </button>
                <button
                  onClick={() => toast.info(v.locked ? "Locked until maturity" : "Withdraw opened")}
                  className="rounded-lg border border-border/60 bg-card/40 py-2 text-[11px] font-semibold"
                >
                  {v.locked ? "Locked" : "Withdraw"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
