"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const BTL = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textRef = useRef(null);
  const thirdSectionRef = useRef(null);

  useEffect(() => {
    const img1 = imageContainerRef.current.querySelector(".img1");
    const img2 = imageContainerRef.current.querySelector(".img2");

    // 🟢 Crossfade logic
    const fadeImages = (showSecond) => {
      if (showSecond) {
        gsap.to(img1, { opacity: 0, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 0.6, duration: 0.8, ease: "power1.out" }); // second image semi-visible
      } else {
        gsap.to(img1, { opacity: 0.65, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 0, duration: 0.8, ease: "power1.out" });
      }
    };

    const init = () => {
      const ctx = gsap.context(() => {
        const heroSplit = new SplitText(".title", { type: "chars, words" });
        heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

        // 🔹 Text fade out on scroll
        gsap.to(textRef.current, {
          y: -200,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom center",
            scrub: true,
          },
        });

        // 🔹 Image parallax
        gsap.to(imageContainerRef.current, {
          scale: 0.5,
          y: -100,
          top: "30%",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom top",
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            ease: "power2.inOut",
          },
        });

        // 🔹 Fade text in (hero)
        gsap.from(heroSplit.chars, {
          opacity: 0,
          yPercent: 100,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // 🔹 Image fade logic between sections
        ScrollTrigger.create({
          trigger: "#second-section",
          scroller: "[data-scroll-container]",
          start: "top bottom+=40%",
          onEnter: () => fadeImages(true),
          onLeaveBack: () => fadeImages(false),
        });

        // 🟠 NEW: Slide img2 + reveal text
        const textContainer = thirdSectionRef.current.querySelector(".behind-text");

        gsap.timeline({
          scrollTrigger: {
            trigger: thirdSectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
          .to(img2, { xPercent: -40, ease: "power1.out" }, 0)
          .fromTo(
            textContainer,
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, ease: "power2.out", duration: 1 },
            0.2
          );
      });

      ScrollTrigger.refresh();
      return () => ctx.revert();
    };

    const wait = setInterval(() => {
      if (window.__loco) {
        clearInterval(wait);
        init();
      }
    }, 100);

    return () => clearInterval(wait);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section ref={sectionRef} className="h-[100vh] relative bg-gradient-to-tl to-[#000000] from-[#0a212b]">
        <div className="sticky top-0 h-screen w-full">
          <div
            ref={imageContainerRef}
            className="relative w-full h-full z-[5]"
            style={{ transform: "scale(1.4)", filter: "brightness(0.7)" }}
          >
            <Image
              src="/HeroImages/Horse2.webp"
              alt="Hero 1"
              fill
              className="img1 object-cover absolute object-center opacity-65 transition-opacity duration-700"
              priority
            />
            <Image
              src="/Ahmed/Ahmed2.jpg"
              alt="Hero 2"
              fill
              className="img2 object-contain absolute object-center opacity-0 transition-opacity duration-700"
              priority
            />
          </div>

          <div
            ref={textRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            text-white text-7xl font-bold text-center z-10 mix-blend-color"
          >
            <h1 className="title">NOT JUST A PHOTOGRAPHER</h1>
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section
        id="second-section"
        className="h-screen flex justify-center items-center bg-gradient-to-bl to-[#000000] from-[#0a212b] text-white"
      >
        <p className="text-lg text-[#a5a5a5] max-w-2xl text-center leading-relaxed">
          Every frame is a chapter — light, shadow, and motion combine to tell stories words cannot.
        </p>
      </section>

      {/* 🟣 THIRD SECTION — Image slides left, text appears */}
      <section
        ref={thirdSectionRef}
        id="third-section"
        className="h-screen flex justify-center items-center bg-gradient-to-tl to-[#000000] from-[#0a212b] text-white overflow-hidden relative"
      >
        <div className="behind-text absolute right-[10%] max-w-lg text-right">
          <h2 className="text-5xl font-bold mb-4 text-[#EFCDBB]">The Man Behind the Scene</h2>
          <p className="text-lg text-[#9ca3af] leading-relaxed">
            Meet Abbas — a storyteller whose lens reveals emotion beyond frames. Every image he captures is a glimpse
            into the unseen beauty that defines human connection.
          </p>
        </div>
      </section>
    </>
  );
};

export default BTL;
