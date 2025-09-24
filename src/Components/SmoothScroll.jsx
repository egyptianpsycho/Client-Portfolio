"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "locomotive-scroll/dist/locomotive-scroll.css";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    let locoScroll;

    (async () => {
      // dynamically import LocomotiveScroll (client-only)
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      locoScroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.08, // lower = smoother
      });

      // tell ScrollTrigger to use locomotive’s scroll
      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(scrollRef.current, {
        scrollTop(value) {
          return arguments.length
            ? locoScroll.scrollTo(value, 0, 0)
            : locoScroll.scroll.instance.scroll.y;
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

      ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
      ScrollTrigger.refresh();
    })();

    return () => {
      if (locoScroll) locoScroll.destroy();
      ScrollTrigger.removeEventListener("refresh", () => locoScroll.update());
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
}
