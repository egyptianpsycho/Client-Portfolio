// src/Components/SmoothScroll.js
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "locomotive-scroll/dist/locomotive-scroll.css";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    let locoScroll = null;
    let resizeObserver = null;
    // keep refs to handlers so we can remove them on cleanup
    let onRefresh = null;
    let onLoad = null;
    let onPop = null;
    const prevScrollRestoration = history.scrollRestoration;

    // Prevent browser from auto-restoring scroll while we initialize loco
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      // Initialize locomotive scroll
      locoScroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.08,
        smartphone: { smooth: false },
        tablet: { smooth: false },
      });
      window.__loco = locoScroll;

      // Sync LocomotiveScroll with ScrollTrigger on every scroll
      locoScroll.on("scroll", ScrollTrigger.update);

      // scroller proxy for ScrollTrigger -> Locomotive
      ScrollTrigger.scrollerProxy(scrollRef.current, {
        scrollTop(value) {
          if (arguments.length) {
            // immediate jump when ScrollTrigger sets position
            locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
            return;
          }
          return locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scrollRef.current.style.transform ? "transform" : "fixed",
      });

      // stable named function for refresh that we can remove later
      onRefresh = () => {
        if (locoScroll) locoScroll.update();
      };

      ScrollTrigger.addEventListener("refresh", onRefresh);

      // Observe container size changes (fixes layout issues)
      resizeObserver = new ResizeObserver(() => {
        if (locoScroll) locoScroll.update();
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(scrollRef.current);

      // Initial refresh to sync everything
      ScrollTrigger.refresh();

      // When the full page load completes, ensure loco's position matches the browser's restored Y
      onLoad = () => {
        // If browser restored to some Y, jump loco there immediately (no lerp)
        const y = window.scrollY || 0;
        if (locoScroll)
          locoScroll.scrollTo(y, { duration: 0, disableLerp: true });
        // a refresh to make sure ScrollTrigger measurements are correct after jump
        ScrollTrigger.refresh();
      };
      window.addEventListener("load", onLoad);

      // Handle back/forward navigation (popstate) - ensure loco follows restored scroll position
      onPop = () => {
        const y = window.scrollY || 0;
        if (locoScroll) {
          locoScroll.scrollTo(y, { duration: 0, disableLerp: true });
          // small timeout to allow locomotive to apply then refresh triggers
          setTimeout(() => ScrollTrigger.refresh(), 50);
        }
      };
      window.addEventListener("popstate", onPop);
    })();

    // Cleanup properly and remove the exact listeners we added
    return () => {
      // restore browser scrollRestoration
      if ("scrollRestoration" in history) {
        history.scrollRestoration = prevScrollRestoration;
      }

      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch (e) {}
        resizeObserver = null;
      }

      if (locoScroll) {
        try {
          locoScroll.destroy();
        } catch (e) {}
        locoScroll = null;
      }

      if (onRefresh) {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        onRefresh = null;
      }

      if (onLoad) {
        window.removeEventListener("load", onLoad);
        onLoad = null;
      }

      if (onPop) {
        window.removeEventListener("popstate", onPop);
        onPop = null;
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      style={{
        backgroundColor: "#000",
        willChange: "transform",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
