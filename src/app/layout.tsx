import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/site/theme-provider";
import { AuroraBackground } from "@/components/site/aurora-background";

// Self-hosted variable fonts (latin subset) — replaces next/font/google so
// cold builds are hermetic. next/font/google fetches from fonts.googleapis.com
// at build time; that fetch is the only network-dependent step in `next build`
// and it intermittently fails Vercel cold builds ("Deployment has failed",
// reproduced locally 2026-10-13: jetbrains_mono module-not-found on a cold
// build that passed on retry). Same CSS variables, same subsets, zero fetch.

const inter = localFont({
  src: "./fonts/inter-latin-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const sora = localFont({
  src: "./fonts/sora-latin-var.woff2",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});

const jbm = localFont({
  src: "./fonts/jetbrains-mono-latin-var.woff2",
  variable: "--font-jbm",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "Nexa Pay — One switch for every payment.",
  description:
    "The African payment switch. Manage every payment method from one secure API — send money, open real USD, GBP and EUR bank accounts, create virtual cards, buy eSIMs and run business payroll. Build with our REST API, webhooks and SDKs.",
  keywords: [
    "Nexa Pay", "payment API Africa", "payment gateway Africa", "centralized payments Africa",
    "USD bank account", "GBP account", "EUR account", "virtual dollar card",
    "naira virtual card", "send money Africa", "eSIM data plans", "business payroll",
    "payment links", "fintech API", "developer API", "payment switch",
  ],
  authors: [{ name: "Nexa Pay" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Nexa Pay — One switch for every payment.",
    description:
      "The African payment switch. One API for cards, foreign accounts, crypto, eSIM, payroll and payment links. Build with REST, webhooks and SDKs.",
    siteName: "Nexa Pay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa Pay — One switch for every payment.",
    description:
      "The African payment switch. One API for cards, foreign accounts, crypto, eSIM, payroll and payment links. Build with REST, webhooks and SDKs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${jbm.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider>
          <AuroraBackground />
          {children}
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
