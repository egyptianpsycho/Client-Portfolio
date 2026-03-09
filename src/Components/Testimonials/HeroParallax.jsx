"use client";
import React, { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialCard } from "../UI/TestimonialCard";
import Image from "next/image";
import SplitText from "gsap/SplitText";
import useAnimate from "@/Hooks/useAnimate";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ─────────────────────────────────────────────
   Hook — resolves true device type once on mount.
   Returns null during SSR / before hydration so
   neither layout renders until we know for sure.
───────────────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);

    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

/* ─────────────────────────────────────────────
   Mobile Marquee Row
   dir: "left" | "right"
───────────────────────────────────────────── */
function MobileMarqueeRow({ items, dir = "left" }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const SPEED = 0.3;
    let offset = 0;
    let rafId;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let loopWidth = 0;

    const originals = Array.from(el.children);
    [0, 1].forEach(() => {
      originals.forEach((child) => {
        const clone = child.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        el.appendChild(clone);
      });
    });

    rafId = requestAnimationFrame(() => {
      loopWidth = el.scrollWidth / 3;
      offset = loopWidth;

      function tick() {
        if (!isDragging) {
          if (dir === "left") {
            offset += SPEED;
          } else {
            offset -= SPEED;
          }
        }

        if (offset >= loopWidth * 2) offset -= loopWidth;
        if (offset < loopWidth) offset += loopWidth;

        el.style.transform = `translateX(${-offset}px)`;
        rafId = requestAnimationFrame(tick);
      }

      rafId = requestAnimationFrame(tick);
    });

    function onTouchStart(e) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartOffset = offset;
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      const delta = dragStartX - e.touches[0].clientX;
      offset = dragStartOffset + delta;
    }

    function onTouchEnd() {
      isDragging = false;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [dir]);

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "stretch",
          gap: "12px",
          width: "max-content",
          willChange: "transform",
          touchAction: "pan-x",
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              width: "260px",
              height: "320px",
              flexShrink: 0,
              flexGrow: 0,
              display: "flex",
            }}
          >
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Desktop layout
───────────────────────────────────────────── */
function DesktopLayout({ testimonials, containerRef }) {
  const animationsCreated = useRef(false);
  const triggersRef = useRef([]);

  const firstRow = testimonials.slice(0, 5);
  const secondRow = testimonials.slice(5, 10);
  const thirdRow = testimonials.slice(10, 15);

  const createAnimations = useCallback(() => {
    if (!containerRef.current || animationsCreated.current) return;

    const container = containerRef.current;
    const testTitle = container.querySelector(".Test-Title");
    const heroContent = container.querySelector(".hero-content");
    const rows = container.querySelectorAll(".row");

    if (testTitle) {
      const titleSplit = new SplitText(testTitle, { type: "words" });
      gsap.from(titleSplit.words, {
        opacity: 0,
        yPercent: 150,
        duration: 2.5,
        filter: "blur(10px)",
        ease: "expo.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#Testimonials",
          scroller: "[data-scroll-container]",
          start: "top 30%",
          onComplete: () => titleSplit.revert(),
        },
      });
    }

    if (heroContent) {
      const heroTrigger = gsap.fromTo(
        heroContent,
        { rotateX: 15, rotateZ: 20, y: -700, opacity: 0.2 },
        {
          rotateX: 0,
          rotateZ: 0,
          y: 500,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      if (heroTrigger.scrollTrigger)
        triggersRef.current.push(heroTrigger.scrollTrigger);
    }

    rows.forEach((row, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const trigger = gsap.fromTo(
        row,
        { x: 0 },
        {
          x: direction * 1000,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      if (trigger.scrollTrigger)
        triggersRef.current.push(trigger.scrollTrigger);
    });

    ScrollTrigger.refresh();
    animationsCreated.current = true;
  }, [containerRef]);

  useAnimate(() => {
    createAnimations();
    return () => {
      triggersRef.current.forEach((t) => t?.kill());
      triggersRef.current = [];
      animationsCreated.current = false;
    };
  });

  return (
    <div className="hero-content testo-tests">
      <div className="row flex flex-row-reverse space-x-reverse space-x-20 mb-20 will-change-transform">
        {firstRow.map((t) => <TestimonialCard key={t.id} {...t} />)}
      </div>
      <div className="row flex flex-row mb-20 space-x-20 will-change-transform">
        {secondRow.map((t) => <TestimonialCard key={t.id} {...t} />)}
      </div>
      <div className="row flex flex-row-reverse space-x-reverse space-x-20 will-change-transform">
        {thirdRow.map((t) => <TestimonialCard key={t.id} {...t} />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile layout
───────────────────────────────────────────── */
function MobileLayout({ testimonials }) {
  const firstRow = testimonials.slice(0, 5);
  const secondRow = testimonials.slice(5, 10);
  const thirdRow = testimonials.slice(10, 15);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginTop: "16px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <MobileMarqueeRow items={firstRow} dir="left" />
      <MobileMarqueeRow items={secondRow} dir="right" />
      <MobileMarqueeRow items={thirdRow} dir="left" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export const HeroParallax = ({ testimonials }) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  return (
    <div
      ref={ref}
      className="h-[160vh] sm:h-[305vh] sm:py-110 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-black via-slate-600 to-slate-900/20 -mt-0.5"
      id="Testimonials"
    >
      {/* Background gradients */}
      <Image src="/gradients/sky_gradient_white.png" alt="" width={400} height={400} className="-z-20 absolute inset-0 opacity-40 scale-150 top-[40%] left-[91%] object-contain" loading="lazy" />
      <Image src="/gradients/sky_gradient_white.png" alt="" width={400} height={400} className="-z-20 absolute inset-0 opacity-20 scale-150 top-[18%] left-[17%] object-contain" loading="lazy" />
      <Image src="/gradients/sky_gradient_white.png" alt="" width={400} height={400} className="-z-20 absolute inset-0 opacity-30 scale-150 top-[85%] left-[-14%] object-contain max-sm:top-[0%] max-sm:left-[-40%]" loading="lazy" />
      <Image src="/gradients/sky_gradient_white.png" alt="" width={400} height={400} className="-z-20 absolute inset-0 opacity-15 scale-150 top-[67%] left-[30%] object-contain" loading="lazy" />

      <Header />

      {/* Render nothing until device is known — avoids flash of wrong layout */}
      {isMobile === null ? null : isMobile ? (
        <MobileLayout testimonials={testimonials} />
      ) : (
        <DesktopLayout testimonials={testimonials} containerRef={ref} />
      )}
    </div>
  );
};

export const Header = React.memo(() => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 z-[1]">
    <h1 className="text-4xl md:text-7xl font-bold Test-Title opacity-60 text-white glowy-text">
      WHAT THEY SAY <br /> ABOUT US
    </h1>
  </div>
));

Header.displayName = "Header";

export const ProductCard = ({ product }) => (
  <div className="group/product h-96 w-[30rem] relative shrink-0 cursor-pointer">
    <a href={product.link} className="block group-hover/product:shadow-2xl">
      <Image
        src={product.thumbnail}
        width={200}
        height={200}
        className="object-cover object-left-top absolute h-full w-full inset-0"
        alt={product.title}
        loading="lazy"
      />
    </a>
    <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
    <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
      {product.title}
    </h2>
  </div>
);
//       <div className="hero-content testo-tests hidden md:block">
//         <div className="row flex flex-row-reverse space-x-reverse space-x-20 mb-20 will-change-transform">
//           {firstRow.map((t) => <TestimonialCard key={t.id} {...t} />)}
//         </div>
//         <div className="row flex flex-row mb-20 space-x-20 will-change-transform">
//           {secondRow.map((t) => <TestimonialCard key={t.id} {...t} />)}
//         </div>
//         <div className="row flex flex-row-reverse space-x-reverse space-x-20 will-change-transform">
//           {thirdRow.map((t) => <TestimonialCard key={t.id} {...t} />)}
//         </div>
//       </div>

//       {/* ══════════════════════════════════════
//           MOBILE — infinite marquee rows
//           Row 1 & 3 → left | Row 2 → right
//           Touch drag overrides auto-scroll
//       ══════════════════════════════════════ */}
//       <div
//         className="sm:hidden"
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "16px",
//           marginTop: "16px",
//           width: "100%",
//           overflow: "hidden",
//         }}
//       >
//         <MobileMarqueeRow items={firstRow} dir="left" />
//         <MobileMarqueeRow items={secondRow} dir="right" />
//         <MobileMarqueeRow items={thirdRow} dir="left" />
//       </div>
//     </div>
//   );
// };

// export const Header = React.memo(() => (
//   <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 z-[1]">
//     <h1 className="text-4xl md:text-7xl font-bold Test-Title opacity-60 text-white glowy-text">
//       WHAT THEY SAY <br /> ABOUT US
//     </h1>
//   </div>
// ));

// Header.displayName = "Header";

// export const ProductCard = ({ product }) => (
//   <div className="group/product h-96 w-[30rem] relative shrink-0 cursor-pointer">
//     <a href={product.link} className="block group-hover/product:shadow-2xl">
//       <Image
//         src={product.thumbnail}
//         width={200}
//         height={200}
//         className="object-cover object-left-top absolute h-full w-full inset-0"
//         alt={product.title}
//         loading="lazy"
//       />
//     </a>
//     <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
//     <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
//       {product.title}
//     </h2>
//   </div>
// );