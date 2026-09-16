"use client";

import { motion } from "framer-motion";
import { Bitcoin, ArrowDownLeft, ArrowUpRight, RefreshCw, AlertTriangle } from "lucide-react";
import { Section, SectionHeading } from "../section";

const COINS = [
  { sym: "$", ticker: "USDC", name: "USD Coin", desc: "Fully-reserved USD stablecoin by Circle" },
  { sym: "₮", ticker: "USDT", name: "Tether", desc: "The most widely-used USD stablecoin" },
  { sym: "$", ticker: "PYUSD", name: "PayPal USD", desc: "USD stablecoin issued by PayPal" },
];

const FEES = [
  ["Wallet creation", "Free"],
  ["Buy / Fund", "1% · min $0.25"],
  ["Sell / Send", "1% · min $0.25"],
  ["Receive (deposit)", "1% · min $0.25"],
  ["Withdraw → NGN", "1.25% · min $0.25"],
  ["Monthly maintenance", "Free"],
  ["Network fees", "Passed on at cost"],
];

const ACTIONS = [
  { icon: ArrowDownLeft, label: "Buy" },
  { icon: ArrowUpRight, label: "Sell" },
  { icon: RefreshCw, label: "Swap" },
  { icon: ArrowUpRight, label: "Send" },
];

export function Crypto() {
  return (
    <Section id="crypto" className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Crypto"
        title={<>Buy, Hold & Send <span className="text-gradient">Stablecoins</span></>}
        desc="Spin up a crypto wallet right inside the Nexa Pay app — buy, sell, send, receive and store dollar stablecoins, and convert to Naira whenever you need."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Wallet card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 to-background/40 p-6 backdrop-blur"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Crypto Wallet · Fees Live</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                <span className="text-gradient">$12,438.50</span>
              </p>
              <p className="text-xs text-muted-foreground">≈ ₦20,025,905 NGN</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/15 text-amber-400">
              <Bitcoin className="h-6 w-6" />
            </div>
          </div>

          {/* Coin list */}
          <div className="mt-6 space-y-2">
            {COINS.map((c) => (
              <div
                key={c.ticker}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand/30 to-brand-2/20 text-sm font-bold text-brand">
                  {c.sym}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{c.ticker} · {c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.desc}</p>
                </div>
                <span className="rounded-full border border-border/60 bg-card/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                  Stablecoin
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.label}
                className="inline-flex flex-col items-center gap-1 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-2 py-2.5 text-[11px] font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_var(--brand)]"
              >
                <a.icon className="h-3.5 w-3.5" />
                {a.label}
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />
        </motion.div>

        {/* Fees + risk */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
            <p className="text-sm font-semibold">Fees</p>
            <p className="text-xs text-muted-foreground">No spread or conversion markup · See full pricing</p>
            <div className="mt-3 divide-y divide-border/40">
              {FEES.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold text-amber-300">Risk disclosure</p>
            </div>
            <p className="mt-2 text-xs text-amber-200/80">
              Crypto assets are volatile and their value can fall as well as rise — you may get back less than you put
              in. Stablecoins aim to track the US Dollar but are not guaranteed to hold their peg. Crypto holdings are
              not bank deposits and are not covered by any deposit-protection or investor-compensation scheme. Only
              transact with funds you can afford to lose.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-xs text-muted-foreground">
            For individuals in Nigeria, aged 18 and over · BVN verification required · Up to $10,000 per transaction ·
            Buy, sell, send, receive & store — all in-app.
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
