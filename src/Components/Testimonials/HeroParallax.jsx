"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialCard } from "../UI/TestimonialCard";
import Image from "next/image";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const HeroParallax = ({ testimonials }) => {
  const ref = useRef(null);
  const firstRow = testimonials.slice(0, 5);
  const secondRow = testimonials.slice(5, 10);
  const thirdRow = testimonials.slice(10, 15);

  useEffect(() => {
    let interval;
    let triggers = [];

    const createAnimations = () => {
      if (!ref.current) return false;

      // Create proxy only once
      if (!ScrollTrigger.scrollerProxySet) {
        ScrollTrigger.scrollerProxySet = true;
        ScrollTrigger.scrollerProxy("[data-scroll-container]", {
          scrollTop(value) {
            const loco = window.__loco;
            if (!loco || !loco.scroll) return 0;
            
            if (arguments.length) {
              try {
                loco.scrollTo(value, 0, 0);
              } catch (e) {
                console.warn("Loco scrollTo failed:", e);
              }
              return;
            }
            return loco.scroll.instance?.scroll?.y || 0;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
        });

        ScrollTrigger.addEventListener("refresh", () => {
          const loco = window.__loco;
          if (loco) {
            try {
              loco.update();
            } catch (e) {
              console.warn("Loco update failed:", e);
            }
          }
        });
      }

      const container = ref.current;
      const rows = container.querySelectorAll(".row");

      try {
        const testParagraphSplit = new SplitText(".Test-Paragraph", { type: "lines" });
        gsap.from(testParagraphSplit.lines, {
          opacity: 0,
          yPercent: 150,
          duration: 2,
          delay: 0.3,
          filter: "blur(20px)",
          ease: "expo.out",
          stagger: 0.3,
          delay: 1.4,
          scrollTrigger: {
            trigger: "#Testimonials",
            scroller: "[data-scroll-container]",
            start: "top 30%",
          },
        });

        const testTitleSplit = new SplitText(".Test-Title", { type: "words" });
        gsap.from(testTitleSplit.words, {
          opacity: 0,
          yPercent: 150,
          duration: 2.5,
          filter: "blur(20px)",
          ease: "expo.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: "#Testimonials",
            scroller: "[data-scroll-container]",
            start: "top 30%",
          },
        });
      } catch (e) {
        console.warn("SplitText failed:", e);
      }

      // Kill only triggers that belong to this section
      triggers.forEach((t) => {
        try {
          t.kill();
        } catch (e) {}
      });
      triggers = [];

      // Animate entire section (rotation, opacity, perspective)
      try {
        const heroTrigger = gsap.fromTo(
          ".hero-content",
          {
            rotateX: 15,
            rotateZ: 20,
            y: -700,
            opacity: 0.2,
          },
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
        if (heroTrigger.scrollTrigger) triggers.push(heroTrigger.scrollTrigger);
      } catch (e) {
        console.warn("Hero animation failed:", e);
      }

      // Animate row movement (parallax)
      rows.forEach((row, i) => {
        try {
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
          if (trigger.scrollTrigger) triggers.push(trigger.scrollTrigger);
        } catch (e) {
          console.warn("Row animation failed:", e);
        }
      });

      try {
        ScrollTrigger.refresh();
      } catch (e) {
        console.warn("ScrollTrigger refresh failed:", e);
      }
      
      return true;
    };

    interval = setInterval(() => {
      if (window.__loco && window.__loco.scroll) {
        const ok = createAnimations();
        if (ok) clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      triggers.forEach((t) => {
        try {
          t.kill();
        } catch (e) {}
      });
    };
  }, []);

  return (
    <div
      ref={ref}
      className="h-[300vh]  py-110  overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-black via-slate-600 to-slate-900/20 -mt-0.5 "
      id="Testimonials"
    >
      <Image
        src="/gradients/sky_gradient_white.png"
        alt="gradient"
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-40 scale-150 top-[40%] left-[91%] object-contain "
      />
      <Image
        src="/gradients/sky_gradient_white.png"
        alt="gradient"
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-20 scale-150 top-[18%] left-[17%] object-contain "
      />
      <Image
        src="/gradients/sky_gradient_white.png"
        alt="gradient"
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-30 scale-150 top-[85%] left-[-14%] object-contain "
      />
      <Image
        src="/gradients/sky_gradient_white.png"
        alt="gradient"
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-15 scale-150 top-[67%] left-[30%] object-contain "
      />

      <Header />
      <div className="hero-content testo-tests">
        <div className=" row flex flex-row-reverse space-x-reverse space-x-20 mb-20 ">
          {firstRow.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
        <div className="row flex flex-row mb-20 space-x-20">
          {secondRow.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
        <div className="row flex flex-row-reverse space-x-reverse space-x-20 ">
          {thirdRow.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Header = () => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
    <h1 className="text-2xl md:text-7xl font-bold Test-Title ">
      WHAT THEY SAY <br /> ABOUT US
    </h1>
    <p className="max-w-2xl text-base md:text-xl mt-8 Test-Paragraph ">
      Every photo tells a story — but hearing what my clients say means the
      world to me. From commercials and portraits to creative shoots, their
      experiences reflect the passion I bring to every moment behind the lens.
    </p>
  </div>
);

export const ProductCard = ({ product }) => (
  <div className="group/product h-96 w-[30rem] relative shrink-0 cursor-pointer ">
    <a href={product.link} className="block group-hover/product:shadow-2xl">
      <Image
        src={product.thumbnail}
        width={200}
        height={200}
        className="object-cover object-left-top absolute h-full w-full inset-0"
        alt={product.title}
      />
    </a>
    <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
    <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
      {product.title}
    </h2>
  </div>
);