"use client";

import { Twitter, Instagram, Youtube, Facebook, Send } from "lucide-react";
import { Logo } from "../logo";

const COLS = [
  {
    title: "Product",
    links: ["Features", "Foreign Accounts", "Virtual Cards", "Crypto", "eSIM", "Business", "Pricing"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Press", "Blog", "Contact"],
  },
  {
    title: "Resources",
    links: ["Help center", "Developer API", "Status", "Community", "Security"],
  },
  {
    title: "Legal",
    links: ["Terms of service", "Privacy policy", "Cookie policy", "Risk disclosure", "Compliance"],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Centralizing payment for Africa. One intelligent, secure dashboard for every way you pay and get paid.
            </p>
            <form className="mt-2 flex items-center gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="h-10 flex-1 rounded-full border border-border/60 bg-card/40 px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60"
              />
              <button
                type="submit"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center gap-2">
              {[Twitter, Instagram, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
                  aria-label="social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold">{c.title}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Nexa Pay. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </p>
          <p>Made in Africa, for Africa.</p>
        </div>
      </div>
    </footer>
  );
}
