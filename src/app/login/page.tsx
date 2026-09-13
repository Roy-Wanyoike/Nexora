"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setSubmitting(true);
    // No real auth yet — simulate a brief delay for UX feedback
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Welcome back");
    }, 400);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient aurora — dark navy + light green palette */}
      <div className="aurora a1" style={{ top: -200, left: -120, opacity: 0.45 }} />
      <div className="aurora a3" style={{ top: 120, left: "60%", opacity: 0.35 }} />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center justify-center">
          <Link href="/" aria-label="Nexa Pay home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl sm:p-8">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Welcome back
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Sign in to <span className="text-gradient">Nexa Pay</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick up right where you left off.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg bg-background/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/signup"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg bg-background/40"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 h-11 gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground shadow-[0_14px_40px_-18px_var(--brand)] hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
