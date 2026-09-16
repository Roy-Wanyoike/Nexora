"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, ArrowDownLeft, Wifi, Send, CreditCard,
  Plus, MoreHorizontal, Eye, EyeOff, Bell, QrCode,
} from "lucide-react";

const SCREENS = [
  // Home
  {
    id: "home",
    body: (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand to-brand-3" />
            <div>
              <p className="text-[10px] text-muted-foreground">Welcome back</p>
              <p className="text-xs font-semibold">John Doe</p>
            </div>
          </div>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-brand/20 via-brand-2/15 to-brand-3/20 p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total balance</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-display text-2xl font-bold">$12,438.50</span>
          </div>
          <p className="text-[10px] text-muted-foreground">≈ ₦20,025,905 NGN</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { icon: Send, label: "Send" },
              { icon: ArrowDownLeft, label: "Receive" },
              { icon: Plus, label: "Top up" },
              { icon: QrCode, label: "Pay" },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1 rounded-xl bg-card/60 p-2">
                <a.icon className="h-3.5 w-3.5 text-brand" />
                <span className="text-[9px] text-muted-foreground">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Recent activity</p>
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {[
              { icon: ArrowUpRight, name: "To Sarah · USD", time: "Today, 14:02", amt: "-$240.00", color: "text-rose-400" },
              { icon: ArrowDownLeft, name: "From Stripe payout", time: "Today, 09:55", amt: "+$1,820.00", color: "text-emerald-400" },
              { icon: Wifi, name: "eSIM · UK 10GB", time: "Yesterday", amt: "-$8.99", color: "text-rose-400" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/60">
                  <t.icon className={`h-3.5 w-3.5 ${t.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium">{t.name}</p>
                  <p className="truncate text-[9px] text-muted-foreground">{t.time}</p>
                </div>
                <p className={`text-[11px] font-semibold ${t.color}`}>{t.amt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Cards
  {
    id: "cards",
    body: (
      <div className="flex flex-col gap-3 p-4">
        <p className="text-xs font-semibold">My Cards</p>
        <div className="relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-brand to-emerald-400 p-4 text-white shadow-2xl">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider opacity-80">Nexa Pay · Virtual</span>
            <Wifi className="h-4 w-4 rotate-90 opacity-80" />
          </div>
          <p className="mt-4 font-mono text-sm tracking-widest">4123 •••• •••• 4591</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[8px] uppercase opacity-70">Card holder</p>
              <p className="text-[11px] font-medium">JOHN DOE</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-5 w-5 rounded-full bg-rose-500/80" />
              <div className="-ml-2 h-5 w-5 rounded-full bg-amber-400/80" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Freeze", "Limits", "Details", "Delete"].map((b) => (
            <div key={b} className="rounded-xl border border-border/60 bg-card/40 p-2 text-center text-[10px] font-medium">
              {b}
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-3.5 w-3.5 text-brand" />
            <p className="text-[11px] font-medium">Create new card</p>
          </div>
          <p className="mt-1 text-[9px] text-muted-foreground">USD or Naira virtual card · instant</p>
        </div>
      </div>
    ),
  },
  // Foreign
  {
    id: "foreign",
    body: (
      <div className="flex flex-col gap-3 p-4">
        <p className="text-xs font-semibold">Foreign Accounts</p>
        <div className="grid grid-cols-4 gap-1.5">
          {["USD", "GBP", "EUR", "CNY"].map((c, i) => (
            <div
              key={c}
              className={`rounded-lg p-1.5 text-center text-[10px] font-semibold ${
                i === 0 ? "bg-brand text-primary-foreground" : "border border-border/60 bg-card/40 text-muted-foreground"
              }`}
            >
              {c}
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-brand/15 to-brand-3/15 p-4">
          <p className="text-[10px] text-muted-foreground">US Dollar · Individual</p>
          <p className="mt-1 font-display text-2xl font-bold">$4,876,907.65</p>
          <p className="text-[10px] text-muted-foreground">≈ ₦7,859,861,365 NGN</p>
          <div className="mt-3 space-y-1.5 text-[10px]">
            <div className="flex justify-between"><span className="text-muted-foreground">Account Name</span><span>John Doe</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Account Number</span><span className="font-mono">•••• 4591</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Routing</span><span className="font-mono">084009519</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span>Nexa Pay / Evolve</span></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Top Up", "Cash Out", "Transfer"].map((b) => (
            <div key={b} className="rounded-xl bg-gradient-to-r from-brand to-brand-2 p-2 text-center text-[10px] font-semibold text-primary-foreground">
              {b}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function PhoneMock() {
  const [idx, setIdx] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SCREENS.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto w-[280px]">
      {/* Phone frame */}
      <div className="relative aspect-[9/19] w-full rounded-[2.6rem] border border-border/60 bg-gradient-to-b from-card to-background p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-background/80 backdrop-blur" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] border border-border/40 bg-background">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1 text-[9px] text-muted-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-1.5">
              {SCREENS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-5 bg-brand" : "w-1.5 bg-muted-foreground/40"
                  }`}
                  aria-label={`Switch to ${s.id} screen`}
                />
              ))}
            </div>
            <button
              onClick={() => setHidden((v) => !v)}
              className="text-muted-foreground"
              aria-label="Toggle balance visibility"
            >
              {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Screen body */}
          <div className={`relative h-[calc(100%-90px)] overflow-hidden ${hidden ? "blur-sm select-none" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={SCREENS[idx].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {SCREENS[idx].body}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-border/40 bg-card/60 backdrop-blur px-2 py-2">
            {["Home", "Cards", "Send", "Wallet", "More"].map((n, i) => (
              <div
                key={n}
                className={`flex flex-col items-center gap-0.5 ${
                  i === 0 ? "text-brand" : "text-muted-foreground"
                }`}
              >
                <div className="h-3.5 w-3.5 rounded bg-current opacity-70" />
                <span className="text-[8px]">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
