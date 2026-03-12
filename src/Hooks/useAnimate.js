// src/Hooks/useAnimate.js
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function useAnimate(gsapInit) {
  // Stable ref so we always call the latest version of the callback
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

      rafId = requestAnimationFrame(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          try {
            window.__loco?.update();
            ScrollTrigger.refresh();
          } catch (e) {
            // ignore
          }
        });
      });
    };

    const poll = () => {
      if (cancelled) return;
      if (window.__loco && window.__preloaderDone) {
        timer = setTimeout(start, 100);
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
  }, []); // Empty deps — initRef always holds latest callback
}