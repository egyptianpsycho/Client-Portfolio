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

    // ✅ Let GSAP own the initial transform instead of React inline style
    //    This prevents the "jump" when ScrollTrigger first reads the element
    // (The 0.7 brightness that used to be a filter here is now baked into
    // the image's opacity over the black background — same look, no
    // full-screen filter re-render on every scroll frame.)
    gsap.set(imageContainerRef.current, {
      scale: 1.4,
      willChange: "transform",
    });

    const heroSplit = new SplitText(titleEl, { type: "chars" });
    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    // Title scroll fade out
    gsap.to(textRef.current, {
      y: -200,
      opacity: 0,
      filter: safariMode ? "blur(10px)" : "blur(20px)",
      scrollTrigger: {
        trigger: sectionRef.current,
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
      filter: safariMode ? "blur(4px)" : "blur(10px)",
      ease: "expo.out",
      stagger: 0.04,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 87%",
        toggleActions: "play none none reverse",
      },
    });

    // Parallax + scale. The extra 30vh used to be `top: "30%"`, which made
    // the browser recalculate layout on every frame; as a translate it's
    // the same movement on the compositor.
    gsap.to(imageContainerRef.current, {
      scale: 0.8,
      y: () => window.innerHeight * 0.3 - 287,
      clipPath: "inset(5% 5% 5% 5% round 5px)",
      scrollTrigger: {
        invalidateOnRefresh: true,
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: 1,
        // ✅ pinType:"transform" keeps the element in normal flow via matrix3d
        //    instead of position:fixed — Lenis handles this without jumping
        pinType: "transform",
        // ✅ removed anticipatePin:1 — it pre-scrolls to compensate for pin
        //    lag, which conflicts with Lenis's virtual scroll and causes the
        //    initial jump
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
      className="h-screen max-sm:hidden relative bg-gradient-to-b from-black via-75% via-black to-[#071318]"
    >
      {/* Was `sticky top-0` — that never actually stuck (an overflow:hidden
          ancestor disabled it), and now that the ancestor clips instead it
          would double up with the pin below. Plain relative keeps the
          layout exactly as it rendered before. */}
      <div className="relative h-screen w-full mt-47">
        {/* ✅ Removed inline transform style — GSAP sets it via gsap.set() above */}
        <div
          ref={imageContainerRef}
          className="relative w-full h-full z-[5]"
        >
          {/* opacity 0.45 ≈ the old opacity-65 × brightness(0.7) on black.
              Not priority: it's near the bottom of the page. */}
          <Image
            src="/Recent/A/B/7.webp"
            alt="Hero 1"
            fill
            sizes="100vw"
            className="img1 object-cover absolute object-center opacity-45"
          />
        </div>

        <div
          ref={textRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              text-white text-3xl w-full sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center z-10 mix-blend-soft-light title-alo"
        >
          <h1
            className="title w-full font-extrabold"
            style={{ fontFamily: "PP Neue Montreal" }}
          >
            HUNGRY FOR CONTENT?
            <br />
            <span className="font-bold lg:text-6xl">WE'VE GOT THE RECIPE</span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;