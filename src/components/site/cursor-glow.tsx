"use client";

import { useEffect, useRef } from "react";

/** Soft cursor-follow glow. Disabled on touch devices. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      el.style.display = "none";
      return;
    }
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow hidden md:block" aria-hidden />;
}
