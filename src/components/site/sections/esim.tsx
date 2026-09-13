"use client";

import { motion } from "framer-motion";
import { Wifi, Globe2, QrCode, Check } from "lucide-react";
import { Section, SectionHeading } from "../section";

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States", data: "10GB / 30 days", price: "$12.00" },
  { flag: "🇬🇧", name: "United Kingdom", data: "10GB / 30 days", price: "$8.99" },
  { flag: "🇨🇦", name: "Canada", data: "8GB / 30 days", price: "$10.50" },
  { flag: "🇩🇪", name: "Germany", data: "12GB / 30 days", price: "$9.20" },
  { flag: "🇦🇪", name: "United Arab Emirates", data: "5GB / 30 days", price: "$14.00" },
  { flag: "🇯🇵", name: "Japan", data: "10GB / 30 days", price: "$11.30" },
  { flag: "🇰🇪", name: "Kenya", data: "15GB / 30 days", price: "$6.80" },
  { flag: "🇿🇦", name: "South Africa", data: "12GB / 30 days", price: "$7.40" },
];

export function ESIM() {
  return (
    <Section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="eSIM"
        title={<>Stay Connected in <span className="text-gradient">190+ Countries</span></>}
        desc="Buy eSIM data plans for travel across 190+ countries and stay connected wherever you go. Install in seconds, top up on the fly — no physical SIM required."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: phone with eSIM UI */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Globe2 className="h-3.5 w-3.5 text-brand" />
              190+ countries
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              eSIM active
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">UK · 10GB / 30 days</p>
              <QrCode className="h-8 w-8 text-brand" />
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-accent">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-brand to-brand-2" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">6.2GB used · 23 days left</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Top up", "Extend", "Share"].map((b) => (
              <div key={b} className="rounded-xl border border-border/60 bg-card/40 p-2 text-center text-[11px] font-medium backdrop-blur">
                {b}
              </div>
            ))}
          </div>

          <ul className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground">
            {[
              "Install in seconds — scan a QR code",
              "Top up on the fly, anywhere",
              "No physical SIM swap required",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-brand" />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: country plans list */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-3xl border border-border/60 bg-card/40 p-2 backdrop-blur"
        >
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold">Popular plans</p>
            <span className="text-xs text-muted-foreground">Tap to install</span>
          </div>
          <div className="thin-scroll max-h-[28rem] overflow-y-auto pr-1">
            <div className="grid gap-2 sm:grid-cols-2">
              {COUNTRIES.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 p-3 lift"
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.data}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand">{c.price}</p>
                    <Wifi className="ml-auto h-3 w-3 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
