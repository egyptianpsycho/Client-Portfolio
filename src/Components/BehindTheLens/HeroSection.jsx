"use client";
import React, { useRef } from "react";
import Image from "next/image";
import useAnimate from "@/Hooks/useAnimate";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

const isSafari = () => {
  if (typeof window === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textRef = useRef(null);
  useAnimate(() => {
    if (!sectionRef?.current || !imageContainerRef?.current) return;

    const titleEl = sectionRef.current.querySelector(".title");
    if (!titleEl) return;

    const safariMode = isSafari();

    const heroSplit = new SplitText(titleEl, { type: "chars" });
    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    // Title scroll fade out
    gsap.to(textRef.current, {
      y: -200,
      opacity: 0,
      filter: safariMode ? "blur(10px)" : "blur(20px)",
      scrollTrigger: {
        trigger: sectionRef.current,
        // scroller: "[data-scroll-container]",
        start: "top top-=5%",
        end: "bottom center",
        scrub: true,
        onLeave: () => gsap.set(textRef.current, { willChange: "auto" }),
        onEnterBack: () =>
          gsap.set(textRef.current, { willChange: "transform, filter" }),
      },
    });

    // Split text reveal
    gsap.from(heroSplit.chars, {
      opacity: 0,
      yPercent: 100,
      duration: 1.4,
      ...(safariMode ? { filter: "blur(4px)" } : { filter: "blur(10px)" }),
      ease: "expo.out",
      stagger: 0.04,
      scrollTrigger: {
        trigger: sectionRef.current,
        // scroller: "[data-scroll-container]",
        start: "top 87%",
        toggleActions: "play none none reverse",
      },
    });

    // Parallax + scale
    gsap.set(imageContainerRef.current, { willChange: "transform" });
    gsap.to(imageContainerRef.current, {
      scale: 0.8,
      y: -287,
      clipPath: "inset(5% 5% 5% 5% round 5px)",
      top: "30%",
      scrollTrigger: {
        trigger: sectionRef.current,
        // scroller: "[data-scroll-container]",
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onLeave: () =>
          gsap.set(imageContainerRef.current, { willChange: "auto" }),
        onEnterBack: () =>
          gsap.set(imageContainerRef.current, { willChange: "transform" }),
      },
    });
  });
  return (
    <section
      ref={sectionRef}
      className="h-screen relative  bg-gradient-to-b from-black via-75% via-black to-[#071318] "
    >
      <div className="relative h-screen w-full mt-47 ">
        <div
          ref={imageContainerRef}
          className=" relative w-full h-full z-[5] "
          style={{ transform: "scale(1.4)", filter: "brightness(0.7)" }}
        >
          <Image
            src="/Recent/A/B/7.webp"
            alt="Hero 1"
            fill
            className="img1 object-cover absolute object-center opacity-65 transition-opacity duration-700 "
            priority
          />
        </div>

        <div
          ref={textRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  
              text-white text-3xl w-full sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center z-10 mix-blend-soft-light title-alo"
        >
          <h1
            className="title w-full font-extrabold  "
            style={{ fontFamily: "PP Neue Montreal" }}
          >
            HUNGRY FOR CONTENT?
            <br />
            <span className=" font-bold lg:text-6xl ">
              WE'VE GOT THE RECIPE
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
