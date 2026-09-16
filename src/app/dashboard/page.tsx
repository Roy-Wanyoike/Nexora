"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  Landmark,
  Bitcoin,
  Wifi,
  Receipt,
  Building2,
  PiggyBank,
  Bell,
  Search,
  Settings,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { AppDemo } from "@/components/site/sections/app-demo";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, active: true },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "foreign", label: "Foreign", icon: Landmark },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "esim", label: "eSIM", icon: Wifi },
  { id: "bills", label: "Bills", icon: Receipt },
  { id: "business", label: "Business", icon: Building2 },
  { id: "savings", label: "Savings", icon: PiggyBank },
];

export default function DashboardPage() {
  const [active, setActive] = useState("overview");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient aurora — dark navy + light green */}
      <div className="aurora a1" style={{ top: -200, left: -120, opacity: 0.35 }} />
      <div className="aurora a3" style={{ top: 80, left: "55%", opacity: 0.3 }} />

      <div className="relative flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Logo />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="ml-1 flex items-center gap-2 rounded-full border border-border/60 bg-card/40 py-1 pl-1 pr-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand to-brand-3" />
                <span className="text-xs font-medium">John D.</span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-0 px-4 py-6 sm:px-6 md:grid-cols-[220px_1fr] lg:px-8">
          {/* Sidebar */}
          <aside className="border-b border-border/60 bg-background/30 p-3 md:sticky md:top-20 md:h-[calc(100vh-7rem)] md:rounded-3xl md:border md:border-border/60 md:border-b md:border-r">
            <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible thin-scroll">
              {NAV.map((t) => {
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-brand/20 to-brand-2/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    }`}
                  >
                    <t.icon className={`h-4 w-4 ${isActive ? "text-brand" : ""}`} />
                    {t.label}
                    {isActive && (
                      <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-brand md:inline-block" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 hidden rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-3 md:block">
              <p className="text-xs font-semibold">Upgrade to Plus</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Unlock crypto, locked savings &amp; more.
              </p>
              <Button
                size="sm"
                asChild
                className="mt-2 w-full gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 text-xs text-primary-foreground"
              >
                <Link href="/signup">
                  <Zap className="h-3 w-3" />
                  Upgrade
                </Link>
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 bg-gradient-to-br from-background/40 to-card/20 p-4 sm:p-6 md:rounded-3xl md:border md:border-border/60">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Welcome to your <span className="text-gradient">dashboard</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Here&apos;s what&apos;s happening across your money today.
                </p>
              </div>
            </div>

            {/* Reuse the existing interactive app demo */}
            <AppDemo />
          </main>
        </div>
      </div>
    </div>
  );
}
