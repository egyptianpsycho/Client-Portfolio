// src/Hooks/useAnimate.js
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Every section initialises in the same tick once the preloader is done.
// One refresh after the last of them is enough — a refresh per section
// re-measured every pin on the page ten-plus times in a row.
let refreshTimer = null;
function queueRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    // Sections don't always init top-to-bottom (Testimonials mounts late),
    // and pins must be measured before anything below them.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 120);
}

export default function useAnimate(gsapInit) {
  const initRef = useRef(gsapInit);
  initRef.current = gsapInit;

  useEffect(() => {
    let ctx = null;
    let timer = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;

      ctx = gsap.context(() => initRef.current());
      queueRefresh();
    };

    const poll = () => {
      if (cancelled) return;
      if (window.__loco && window.__preloaderDone) {
        // Small delay so all sibling components have mounted
        timer = setTimeout(start, 50);
      } else {
        timer = setTimeout(poll, 50);
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      ctx?.revert();
    };
  }, []);
}
