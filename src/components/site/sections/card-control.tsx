"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertCircle, Ban as BanIcon, ShieldX } from "lucide-react";
import { Section, SectionHeading } from "../section";

const STATES = [
  {
    key: "inactive",
    icon: Lock,
    title: "Inactive Card",
    desc: "Set a card to inactive to block online charges you didn't authorize — then reactivate the moment you're ready to transact.",
  },
  {
    key: "stolen",
    icon: AlertCircle,
    title: "Stolen Card",
    desc: "Mark a stolen card as stolen instantly to stop any unauthorized use — no need to visit the bank or wait on hold.",
  },
  {
    key: "damaged",
    icon: ShieldX,
    title: "Damaged Card",
    desc: "Report a damaged card and we'll prevent any further charges on it right away, so nothing slips through the cracks.",
  },
  {
    key: "blocked",
    icon: BanIcon,
    title: "Block & Deactivate",
    desc: "Deactivate or block any card in a single tap, and stop specific merchants from ever charging it again.",
  },
];

export function CardControl() {
  const [active, setActive] = useState(0);
  const s = STATES[active];

  return (
    <Section id="cards" className="py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Card Control"
            title={<>Total Control Over Your <span className="text-gradient">Debit Cards</span></>}
            desc="Manage every card straight from the app — freeze, flag or block it in one tap, with no trip to the bank required."
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {STATES.map((st, i) => {
              const isActive = i === active;
              return (
                <button
                  key={st.key}
                  onClick={() => setActive(i)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-brand/50 bg-gradient-to-br from-brand/10 to-brand-2/5"
                      : "border-border/60 bg-card/40 hover:border-brand/30"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive ? "bg-brand text-primary-foreground" : "bg-accent text-muted-foreground"
                    }`}
                  >
                    <st.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{st.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{st.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual: card with state overlay */}
        <div className="relative mx-auto w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 12, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[1.6/1] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-brand to-emerald-400 p-6 text-white shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-80">Nexa Pay · Debit</p>
                  <p className="mt-2 text-xs opacity-80">{s.title}</p>
                </div>
                <s.icon className="h-6 w-6 opacity-90" />
              </div>

              <div className="mt-6 mb-3 h-9 w-12 rounded-md bg-yellow-300/80" />
              <p className="font-mono text-base tracking-widest sm:text-lg">4123 •••• •••• 4591</p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase opacity-70">Card holder</p>
                  <p className="text-sm font-medium">JOHN DOE</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase opacity-70">Expires</p>
                  <p className="text-sm font-medium">08/29</p>
                </div>
              </div>

              {/* overlay banner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
              >
                <div className="rounded-full border-2 border-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                  {s.title}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <p className="mt-4 text-center text-sm text-muted-foreground">{s.desc}</p>
        </div>
      </div>
    </Section>
  );
}
