"use client";

import { motion } from "framer-motion";
import { PiggyBank, TrendingUp, Lock, Target } from "lucide-react";
import { Section, SectionHeading } from "../section";

const VAULTS = [
  { name: "Emergency Fund", saved: 840000, goal: 1500000, apy: "8% APY", locked: false },
  { name: "Lagos Rent 2027", saved: 2100000, goal: 3000000, apy: "12% APY", locked: true },
  { name: "New MacBook", saved: 540000, goal: 1200000, apy: "6% APY", locked: false },
];

const fmt = (n: number) => "₦" + n.toLocaleString();

export function Savings() {
  return (
    <Section className="py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Piggy Savings"
            title={<>Set Money Aside & <span className="text-gradient">Watch It Grow</span></>}
            desc="Save automatically, lock funds toward a goal, and build a healthy saving habit right inside the app. Earn up to 12% APY on locked savings, paid daily."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: PiggyBank, title: "Auto-save", desc: "Daily, weekly, or on every spend" },
              { icon: Lock, title: "Locked vaults", desc: "Up to 12% APY, paid daily" },
              { icon: Target, title: "Goal tracking", desc: "See progress in real time" },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur lift"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand/25 to-brand-2/15 text-brand">
                  <p.icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-semibold">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vaults */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 to-background/40 p-6 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total saved</p>
              <p className="font-display text-3xl font-bold">
                <span className="text-gradient">{fmt(VAULTS.reduce((a, v) => a + v.saved, 0))}</span>
              </p>
              <p className="inline-flex items-center gap-1 text-xs text-emerald-300">
                <TrendingUp className="h-3 w-3" /> +₦48,210 earned this month
              </p>
            </div>
            <PiggyBank className="h-10 w-10 text-brand" />
          </div>

          <div className="mt-6 space-y-3">
            {VAULTS.map((v) => {
              const pct = Math.min(100, Math.round((v.saved / v.goal) * 100));
              return (
                <div key={v.name} className="rounded-2xl border border-border/40 bg-background/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{v.name}</p>
                      {v.locked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          <Lock className="h-2.5 w-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {v.apy}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-accent">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{fmt(v.saved)} saved</span>
                    <span>Goal {fmt(v.goal)} · {pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
