"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error tracking service (Sentry, etc.) in production
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            An unexpected error occurred. Our team has been notified. You can try
            again or head back to the homepage.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_var(--brand)]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:border-brand/50"
          >
            <Home className="h-4 w-4" />
            Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
