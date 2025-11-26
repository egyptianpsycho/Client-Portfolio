"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function useAnimate(gsapInit) {
  const ran = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (ran.current) return;
    
    let timer;
    let rafId;

    const start = () => {
      if (ran.current) return;
      ran.current = true;

      // Use gsap.context for automatic cleanup
      const ctx = gsap.context(() => {
        gsapInit();
      });

      // Use RAF for better timing with render cycle
      rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            if (window.__loco) {
              window.__loco.update();
            }
            ScrollTrigger.refresh();
          } catch (e) {
            console.warn("ScrollTrigger refresh failed:", e);
          }
        });
      });

      cleanupRef.current = () => {
        ctx.revert();
        if (rafId) cancelAnimationFrame(rafId);
      };
    };

    const wait = () => {
      // Check if both loco and preloader are ready
      if (window.__loco && window.__preloaderDone) {
        // Add small delay to ensure DOM is fully painted
        timer = setTimeout(start, 100);
      } else {
        timer = setTimeout(wait, 50);
      }
    };

    wait();

    return () => {
      if (timer) clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [gsapInit]);
}