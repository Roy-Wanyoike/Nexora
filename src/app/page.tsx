"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/site/theme-provider";
import { AuroraBackground } from "@/components/site/aurora-background";
import { CursorGlow } from "@/components/site/cursor-glow";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/sections/hero";
import { Stats } from "@/components/site/sections/stats";
import { Features } from "@/components/site/sections/features";
import { CardControl } from "@/components/site/sections/card-control";
import { VirtualCards } from "@/components/site/sections/virtual-cards";
import { ForeignAccounts } from "@/components/site/sections/foreign-accounts";
import { Crypto } from "@/components/site/sections/crypto";
import { ESIM } from "@/components/site/sections/esim";
import { Business } from "@/components/site/sections/business";
import { Bills } from "@/components/site/sections/bills";
import { Savings } from "@/components/site/sections/savings";
import { Pricing } from "@/components/site/sections/pricing";
import { Testimonials } from "@/components/site/sections/testimonials";
import { FAQ } from "@/components/site/sections/faq";
import { CTA } from "@/components/site/sections/cta";
import { Footer } from "@/components/site/sections/footer";

// Lazy-load heavy below-the-fold components (AppDemo: 1000+ LOC, DeveloperGateway: 980+ LOC)
// These are never needed on first paint — saves ~200KB from the initial bundle
const AppDemo = dynamic(() => import("@/components/site/sections/app-demo").then(m => m.AppDemo), {
  ssr: false,
  loading: () => (
    <section id="app-demo" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-3xl border border-border/60 bg-card/40" />
      </div>
    </section>
  ),
});

const DeveloperGateway = dynamic(() => import("@/components/site/sections/developer-gateway").then(m => m.DeveloperGateway), {
  ssr: false,
  loading: () => (
    <section id="developers" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-3xl border border-border/60 bg-card/40" />
      </div>
    </section>
  ),
});

export default function Home() {
  return (
    <ThemeProvider>
      <AuroraBackground />
      <CursorGlow />
      <Nav />
      <main className="relative flex min-h-screen flex-col">
        <Hero />
        <Stats />
        <Features />
        <CardControl />
        <VirtualCards />
        <ForeignAccounts />
        <Crypto />
        <ESIM />
        <Business />
        <Bills />
        <Savings />
        <AppDemo />
        <DeveloperGateway />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </ThemeProvider>
  );
}
