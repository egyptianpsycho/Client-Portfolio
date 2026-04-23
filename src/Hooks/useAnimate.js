// src/Hooks/useAnimate.js
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function useAnimate(gsapInit) {
  const initRef = useRef(gsapInit);
  initRef.current = gsapInit;

  useEffect(() => {
    let ctx = null;
    let timer = null;
    let rafId = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        initRef.current();
      });

      // One rAF is enough — Lenis + GSAP ticker are already in sync
      rafId = requestAnimationFrame(() => {
        if (cancelled) return;
        try {
          ScrollTrigger.refresh();
        } catch (e) {
          // ignore
        }
      });
    };

    const poll = () => {
      if (cancelled) return;
      if (window.__loco && window.__preloaderDone) {
        // Small delay so all sibling components have mounted
        timer = setTimeout(start, 50); // was 100ms, 50 is fine with Lenis
      } else {
        timer = setTimeout(poll, 50);
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);
}