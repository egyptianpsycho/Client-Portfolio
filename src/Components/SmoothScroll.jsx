"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";


gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Always start a load at the top — the preloader assumes it, and a
    // restored mid-page position left pinned sections measured wrong.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: !reduceMotion,
      // Native touch scrolling (with momentum) is smoother on phones than
      // Lenis re-simulating it on the main thread.
      syncTouch: false,
      anchors: true,
    });

    // Held still until the preloader finishes (Preloader calls start()).
    if (!window.__preloaderDone) lenis.stop();

    window.__lenis = lenis;
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

    // Web fonts change text metrics after first paint; re-measure triggers
    // once they're in so pins and reveals start where they should.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // No resize handler: Lenis observes its own size, and ScrollTrigger
    // already refreshes on resize (skipping mobile address-bar resizes,
    // which a manual refresh here used to turn into mid-scroll jumps).

    return () => {
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
      delete window.__lenis;
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
