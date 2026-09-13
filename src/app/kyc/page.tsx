"use client";

import { ShieldCheck, Lock, FileCheck, Eye } from "lucide-react";
import { ThemeProvider } from "@/components/site/theme-provider";
import { AuroraBackground } from "@/components/site/aurora-background";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/sections/footer";
import { KycForm } from "@/components/site/sections/kyc-form";

const TRUST = [
  {
    icon: Lock,
    title: "Never stored in plain text",
    desc: "Your BVN is hashed with SHA-256 before it touches our database. We never see or persist the raw 11-digit value.",
  },
  {
    icon: FileCheck,
    title: "NDPR-compliant",
    desc: "Verification is carried out under the Nigeria Data Protection Act 2023 and CBN AML/CFT Reg. 26.",
  },
  {
    icon: Eye,
    title: "Audited & logged",
    desc: "Every verification is recorded in an immutable audit log. You can request a copy from our DPO at any time.",
  },
];

export default function KycPage() {
  return (
    <ThemeProvider>
      <AuroraBackground />
      <Nav />
      <main className="relative flex min-h-screen flex-col">
        <section className="relative pt-28 pb-12 sm:pt-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              Identity Verification
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Verify your <span className="text-gradient">identity</span>
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Complete Tier 1 KYC verification to unlock all payment methods — domestic transfers,
              foreign accounts, virtual cards, payouts, and crypto. We verify your Bank Verification
              Number (BVN) against CBN / NIMC databases and screen against sanctions and PEP lists,
              in line with CBN AML/CFT Regulations.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <KycForm />

              <aside className="flex flex-col gap-4">
                {TRUST.map((t) => (
                  <div
                    key={t.title}
                    className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand/30 to-brand-2/20 text-brand">
                        <t.icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold">{t.title}</p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                ))}

                <div className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-brand" />
                    Why we ask
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    BVN verification is required under the CBN Anti-Money Laundering, Combating the
                    Financing of Terrorism and Countering Proliferation Financing (AML/CFT/CPF)
                    Regulations 2022 for all payment service providers operating in Nigeria.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </ThemeProvider>
  );
}
