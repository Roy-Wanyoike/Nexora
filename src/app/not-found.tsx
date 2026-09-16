"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <p className="font-display text-7xl font-extrabold tracking-tight sm:text-9xl">
          <span className="text-gradient">404</span>
        </p>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_var(--brand)]"
        >
          <Home className="h-4 w-4" />
          Back to home
        </a>
      </motion.div>
    </div>
  );
}
