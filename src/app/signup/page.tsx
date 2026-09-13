"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { toast } from "sonner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [bvn, setBvn] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (bvn && !/^\d{11}$/.test(bvn)) {
      toast.error("BVN must be 11 digits");
      return;
    }
    setSubmitting(true);
    // No real auth yet — simulate a brief delay for UX feedback
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Account created — check your email");
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
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Create account
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Open your <span className="text-gradient">free account</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join 44,000+ Africans already using Nexa Pay. No paperwork, no minimum balance.
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg bg-background/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-10 rounded-lg bg-background/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bvn">
                BVN{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (optional · 11 digits)
                </span>
              </Label>
              <Input
                id="bvn"
                inputMode="numeric"
                pattern="\d{11}"
                maxLength={11}
                placeholder="00000000000"
                value={bvn}
                onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
                className="h-10 rounded-lg bg-background/40"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 h-11 gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 text-primary-foreground shadow-[0_14px_40px_-18px_var(--brand)] hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create account"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Bank-grade encryption · your data stays private
          </p>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
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
