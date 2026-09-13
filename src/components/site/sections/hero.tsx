"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Smartphone, Send, Wifi,
  CreditCard, Building2, Zap, Star, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneMock } from "../phone-mock";

const CHIPS = [
  { label: "USD account", icon: Building2 },
  { label: "GBP account", icon: Building2 },
  { label: "EUR account", icon: Building2 },
  { label: "Instant transfers", icon: Send },
  { label: "190+ eSIM countries", icon: Wifi },
  { label: "Business banking", icon: CreditCard },
  { label: "Automated payroll", icon: Zap },
  { label: "Payment links", icon: ArrowRight },
  { label: "Bank-grade security", icon: ShieldCheck },
  { label: "24/7 support", icon: Check },
];

const FLOAT_CARDS = [
  {
    title: "Payment sent",
    value: "$1,204.00",
    sub: "instant · free",
    icon: Send,
    className: "left-[-3%] top-[14%]",
    delay: 0.15,
  },
  {
    title: "Secured",
    value: "Bank-grade",
    sub: "end-to-end encryption",
    icon: ShieldCheck,
    className: "right-[-2%] top-[10%]",
    delay: 0.25,
  },
  {
    title: "eSIM active",
    value: "190+ countries",
    sub: "data plan · 10GB",
    icon: Wifi,
    className: "right-[-4%] bottom-[18%]",
    delay: 0.35,
  },
  {
    title: "USD balance",
    value: "$4,876.90",
    sub: "≈ ₦7,859,861",
    icon: CreditCard,
    className: "left-[-5%] bottom-[14%]",
    delay: 0.45,
  },
];

export function Hero() {
  return (
    <section id="top" className="relative pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="pulse-dot absolute inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              Payment Switch · Africa
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            >
              One Switch for <span className="text-gradient">Every Payment</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
            >
              One intelligent, secure dashboard to manage every payment method, send money,
              open real foreign bank accounts, and run your business finances — all in your pocket.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-6 text-primary-foreground shadow-[0_14px_40px_-18px_var(--brand)] hover:opacity-95"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 rounded-full border-border/70 bg-card/40 backdrop-blur hover:bg-accent/60"
              >
                <a href="#app-demo">
                  <Smartphone className="h-4 w-4" />
                  See the App
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <strong className="font-semibold text-foreground ticker-num">50K+</strong> active users
              </span>
              <span className="inline-flex items-center gap-2">
                <strong className="font-semibold text-foreground ticker-num">190+</strong> countries
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <strong className="font-semibold text-foreground">4.8</strong> rating
              </span>
            </motion.div>
          </div>

          {/* Phone + floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative mx-auto hidden w-full max-w-md sm:block"
          >
            <div className="phone-tilt">
              <PhoneMock />
            </div>

            {FLOAT_CARDS.map((c) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: c.delay + 0.4 }}
                className={`absolute ${c.className} z-20 w-44 rounded-2xl glass p-3 shadow-2xl`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand/30 to-brand-2/20 text-brand">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.title}
                    </p>
                    <p className="truncate text-sm font-semibold">{c.value}</p>
                  </div>
                </div>
                <p className="mt-1.5 truncate text-[10px] text-muted-foreground">{c.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature chips marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-12 overflow-hidden sm:mt-16"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
          <div className="marquee gap-3">
            {[...CHIPS, ...CHIPS].map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur"
              >
                <c.icon className="h-3.5 w-3.5 text-brand" />
                {c.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
