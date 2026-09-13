"use client";

import { motion } from "framer-motion";
import {
  Layers, ShieldCheck, FileText, Wifi, Zap,
  PhoneCall, Link2, PiggyBank,
} from "lucide-react";
import { Section, SectionHeading } from "../section";

const FEATURES = [
  {
    icon: Layers,
    title: "Centralized Payments",
    desc: "Connect all your bank cards into one Nexa Pay card, then pay, transfer or withdraw from any linked account — from a single dashboard with one tap. No more carrying multiple cards, no app-switching, no friction.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Merchant Controls",
    desc: "Restrict merchants from charging your card, and remove compromised methods instantly with one click. Block specific categories, set per-merchant spending caps, and get notified the moment something looks off.",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
  {
    icon: FileText,
    title: "Full Transparency",
    desc: "Every receipt shows the merchant, amount, and charges — no surprises, no hidden fees, ever. Export statements in PDF or CSV, reconcile in seconds, and trace every naira and cent back to its source.",
    accent: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Wifi,
    title: "eSIM for 190+ Countries",
    desc: "Buy eSIM data plans for travel across 190+ countries and stay connected wherever you go. Install in seconds, top up on the fly, and never hunt for a local SIM again — perfect for digital nomads and frequent flyers.",
    accent: "from-emerald-500/20 to-cyan-500/10",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    desc: "Money moves in real time. Send, receive and convert without waiting on slow legacy rails. payouts to other Nexa Pay users settle in milliseconds, and bank transfers typically clear within minutes — not days.",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    icon: PhoneCall,
    title: "Airtime, Data & Bills",
    desc: "Top up airtime and data, pay electricity bills, and renew DStv, GOtv & StarTimes subscriptions — all in a few taps. Save beneficiary details, schedule recurring payments, and never miss a due date again.",
    accent: "from-rose-500/20 to-pink-500/10",
  },
  {
    icon: Link2,
    title: "Payment & Payout Links",
    desc: "Collect money from anyone with Payment Links, and send funds to vendors or staff with Payout Links — no code or integration required. Share a single URL, get paid in any currency, and reconcile everything automatically.",
    accent: "from-teal-500/20 to-emerald-500/10",
  },
  {
    icon: PiggyBank,
    title: "Piggy Savings",
    desc: "Set money aside and watch it grow — save automatically, lock funds toward a goal, and build a healthy saving habit right inside the app. Earn up to 12% APY on locked savings, paid daily, with no hidden fees.",
    accent: "from-yellow-500/20 to-amber-500/10",
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Core Features"
        title={<>All Your Payment Methods. <span className="text-gradient">One Intelligent Dashboard.</span></>}
        desc="Connect every card, wallet and foreign account — then control them all from one secure, lightning-fast interface."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur lift"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-foreground`}>
              <f.icon className="h-5 w-5 text-brand" />
            </div>
            <h3 className="font-display text-base font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
