import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const jbm = JetBrains_Mono({
  variable: "--font-jbm",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
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
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${sora.variable} ${jbm.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}
