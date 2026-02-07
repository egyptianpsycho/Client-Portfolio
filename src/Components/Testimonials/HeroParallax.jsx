"use client";
import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialCard } from "../UI/TestimonialCard";
import Image from "next/image";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const HeroParallax = ({ testimonials }) => {
  const ref = useRef(null);
  const animationsCreated = useRef(false);
  const triggersRef = useRef([]);
  
  const firstRow = useRef(testimonials.slice(0, 5)).current;
  const secondRow = useRef(testimonials.slice(5, 10)).current;
  const thirdRow = useRef(testimonials.slice(10, 15)).current;

  const createAnimations = useCallback(() => {
    if (!ref.current || animationsCreated.current) return;

    // Setup scroller proxy once
    if (!ScrollTrigger.scrollerProxySet) {
      ScrollTrigger.scrollerProxySet = true;
      ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
          const loco = window.__loco;
          if (!loco?.scroll) return 0;
          
          if (arguments.length) {
            loco.scrollTo(value, 0, 0);
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
        window.__loco?.update();
      });
    }

    const container = ref.current;
    const testTitle = container.querySelector(".Test-Title");
    const heroContent = container.querySelector(".hero-content");
    const rows = container.querySelectorAll(".row");

    // Text animations with SplitText
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
          }
        })
      
        
        
    }

    // Hero content 3D transform
    if (heroContent) {
      const heroTrigger = gsap.fromTo(
        heroContent,
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
      if (heroTrigger.scrollTrigger) triggersRef.current.push(heroTrigger.scrollTrigger);
    }

    // Row parallax animations
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
      if (trigger.scrollTrigger) triggersRef.current.push(trigger.scrollTrigger);
    });

    ScrollTrigger.refresh();
    animationsCreated.current = true;
  }, []);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    const checkAndInit = () => {
      if (window.__loco?.scroll) {
        createAnimations();
        return true;
      }
      attempts++;
      return attempts >= maxAttempts;
    };

    const interval = setInterval(() => {
      if (checkAndInit()) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      
      // Cleanup ScrollTriggers
      triggersRef.current.forEach(t => t?.kill());
      triggersRef.current = [];
      
      animationsCreated.current = false;
    };
  }, [createAnimations]);

  return (
    <div
      ref={ref}
      className="h-[305vh] py-110 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-black via-slate-600 to-slate-900/20 -mt-0.5"
      id="Testimonials"
    >
      {/* Optimized gradient images - use will-change sparingly */}
      <Image
        src="/gradients/sky_gradient_white.png"
        alt=""
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-40 scale-150 top-[40%] left-[91%] object-contain"
        loading="lazy"
      />
      <Image
        src="/gradients/sky_gradient_white.png"
        alt=""
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-20 scale-150 top-[18%] left-[17%] object-contain"
        loading="lazy"
      />
      <Image
        src="/gradients/sky_gradient_white.png"
        alt=""
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-30 scale-150 top-[85%] left-[-14%] object-contain max-sm:top-[80%] max-sm:left-[-40%]"
        loading="lazy"
      />
      <Image
        src="/gradients/sky_gradient_white.png"
        alt=""
        width={400}
        height={400}
        className="-z-20 absolute inset-0 opacity-15 scale-150 top-[67%] left-[30%] object-contain "
        loading="lazy"
      />

      <Header />
      <div className="hero-content testo-tests">
        <div className="row flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
        <div className="row flex flex-row mb-20 space-x-20">
          {secondRow.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
        <div className="row flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Header = React.memo(() => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 z-[1]">
    <h1 className="text-4xl md:text-7xl font-bold Test-Title opacity-60 text-white glowy-text   ">
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

