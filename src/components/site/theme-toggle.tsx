"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      title="Toggle theme"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/40 backdrop-blur transition-colors hover:border-brand/60 hover:text-brand ${className}`}
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
