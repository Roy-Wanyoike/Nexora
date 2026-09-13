"use client";

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
import { AppDemo } from "@/components/site/sections/app-demo";
import { DeveloperGateway } from "@/components/site/sections/developer-gateway";
import { Pricing } from "@/components/site/sections/pricing";
import { Testimonials } from "@/components/site/sections/testimonials";
import { FAQ } from "@/components/site/sections/faq";
import { CTA } from "@/components/site/sections/cta";
import { Footer } from "@/components/site/sections/footer";

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
