"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";

type Theme = "dark" | "light";
type ThemeCtx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const Ctx = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}

function getInitialTheme(): Theme {
  const auto = (() => {
    const h = new Date().getHours();
    return h >= 7 && h < 19 ? "light" : "dark";
  })();
  if (typeof window === "undefined") return auto;
  try {
    const s = localStorage.getItem("ps-theme") as Theme | null;
    const p = localStorage.getItem("ps-theme-period");
    if (s && p === auto) return s;
    localStorage.removeItem("ps-theme");
    localStorage.removeItem("ps-theme-period");
  } catch {}
  return auto;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [hydrated, setHydrated] = useState(false);

  // Read initial theme once on mount (avoids SSR mismatch by not touching DOM before hydration)
  useEffect(() => {
    // deferred to next tick so it's not a synchronous setState in effect body
    queueMicrotask(() => {
      setThemeState(getInitialTheme());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme, hydrated]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      const auto = (() => {
        const h = new Date().getHours();
        return h >= 7 && h < 19 ? "light" : "dark";
      })();
      localStorage.setItem("ps-theme", t);
      localStorage.setItem("ps-theme-period", auto);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setThemeState((cur) => {
      const next = cur === "dark" ? "light" : "dark";
      try {
        const auto = (() => {
          const h = new Date().getHours();
          return h >= 7 && h < 19 ? "light" : "dark";
        })();
        localStorage.setItem("ps-theme", next);
        localStorage.setItem("ps-theme-period", auto);
      } catch {}
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}
