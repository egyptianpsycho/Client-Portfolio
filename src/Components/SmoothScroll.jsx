"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";


gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
    });

    // Keep the same global API shape the rest of the codebase expects
    window.__loco = {
      stop:     ()        => lenis.stop(),
      start:    ()        => lenis.start(),
      scrollTo: (y, opts) => lenis.scrollTo(y, { immediate: true, ...opts }),
      update:   ()        => ScrollTrigger.refresh(),
    };

    // Drive Lenis from GSAP's RAF so they're always in sync
    const lenisRaf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Debounced resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    ScrollTrigger.refresh();

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
      delete window.__loco;
    };
  }, []);

  // Keep data-scroll-container for any CSS that targets it, but it's just a div now
  return (
    <div data-scroll-container style={{ backgroundColor: "#000" }}>
      {children}
    </div>
  );
}