"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, Landmark, Bitcoin, Wifi, Receipt, Building2, PiggyBank, LogOut, Search, Bell, Settings } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { toast } from "sonner";

const AppDemo = dynamic(() => import("@/components/site/sections/app-demo").then(m => m.AppDemo), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-3xl border border-border/60 bg-card/40" />,
});

type Tab = "overview" | "cards" | "foreign" | "crypto" | "esim" | "bills" | "business" | "savings";

const NAV: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "foreign", label: "Foreign", icon: Landmark },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "esim", label: "eSIM", icon: Wifi },
  { id: "bills", label: "Bills", icon: Receipt },
  { id: "business", label: "Business", icon: Building2 },
  { id: "savings", label: "Savings", icon: PiggyBank },
];

interface UserSession {
  userId: string;
  email: string;
  name?: string;
}

export function DashboardClient({ user }: { user: UserSession }) {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("overview");

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/40 py-1 pl-1 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-3 text-xs font-bold text-primary-foreground">
                {(user.name || user.email)[0].toUpperCase()}
              </div>
              <span className="hidden text-xs font-medium sm:inline">{user.name || user.email.split("@")[0]}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="border-b border-border/60 py-4 md:border-b-0 md:border-r md:py-6">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible thin-scroll">
              {NAV.map((t) => {
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActive(t.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-brand/20 to-brand-2/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    }`}
                  >
                    <t.icon className={`h-4 w-4 ${isActive ? "text-brand" : ""}`} />
                    {t.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 hidden rounded-2xl border border-border/60 bg-gradient-to-br from-brand/10 to-brand-3/10 p-3 md:block">
              <p className="text-xs font-semibold">Upgrade to Plus</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Unlock crypto, locked savings & more.</p>
              <Button size="sm" className="mt-2 w-full rounded-full bg-gradient-to-r from-brand to-brand-2 text-xs text-primary-foreground">
                Upgrade
              </Button>
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0 p-4 sm:p-6">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {user.name || user.email.split("@")[0]}
              </h1>
              <p className="text-sm text-muted-foreground">Here's what's happening across your money today.</p>
            </div>
            <AppDemo />
          </main>
        </div>
      </div>
    </div>
  );
}
