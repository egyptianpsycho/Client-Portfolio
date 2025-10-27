"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const HeroParallax = ({ products }) => {
  const ref = useRef(null);
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

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
            return arguments.length
              ? window.__loco.scrollTo(value, 0, 0)
              : window.__loco.scroll.instance.scroll.y;
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

        ScrollTrigger.addEventListener("refresh", () =>
          window.__loco?.update()
        );
      }

      const container = ref.current;
      const rows = container.querySelectorAll(".row");

      // Kill only triggers that belong to this section
      triggers.forEach((t) => t.kill());
      triggers = [];

      // Animate entire section (rotation, opacity, perspective)
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
      triggers.push(heroTrigger.scrollTrigger);

      // Animate row movement (parallax)
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
        triggers.push(trigger.scrollTrigger);
      });

      ScrollTrigger.refresh();
      return true;
    };

    interval = setInterval(() => {
      if (window.__loco) {
        const ok = createAnimations();
        if (ok) clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-110  overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-black via-slate-600 to-[#0a212b] -mt-0.5 "
    >
      <Header />
      <div className="hero-content">
        <div className="row flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </div>
        <div className="row flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </div>
        <div className="row flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Header = () => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
    <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
      WHAT THEY SAY <br /> ABOUT US
    </h1>
    <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
      Every photo tells a story — but hearing what my clients say means the
      world to me. From commercials and portraits to creative shoots, their
      experiences reflect the passion I bring to every moment behind the lens.
    </p>
  </div>
);

export const ProductCard = ({ product }) => (
  <div className="group/product h-96 w-[30rem] relative shrink-0 cursor-pointer">
    <a href={product.link} className="block group-hover/product:shadow-2xl">
      <img
        src={product.thumbnail}
        height="600"
        width="600"
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
