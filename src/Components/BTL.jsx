"use client";
import React, { useRef, useEffect, useState } from "react";
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
  // const [imageSrc, setImageSrc] = useState("/HeroImages/Horse2.webp"); // initial image

  useEffect(() => {
    const img1 = imageContainerRef.current.querySelector(".img1");
    const img2 = imageContainerRef.current.querySelector(".img2");

    // 🟢 Crossfade between images
    const fadeImages = (showSecond) => {
      if (showSecond) {
        gsap.to(img1, { opacity: 0, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 1, duration: 0.8, ease: "power1.out" });
      } else {
        gsap.to(img1, { opacity: 0.65, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 0, duration: 0.8, ease: "power1.out" });
      }
    };
    const init = () => {
      const ctx = gsap.context(() => {
        const heroSplit = new SplitText(".title", { type: "chars, words" });

        heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));
        // 🔹 Text animation
        gsap.to(textRef.current, {
          y: -200,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom center ",
            // center top
            scrub: true,
          },
        });

        // img2 animation
        gsap.to(img2, {
          x: -1200,
          // top: "120%",
          scrollTrigger: {
            trigger: img2,
            scroller: "[data-scroll-container]",
            start: "bottom center-=40%",
            end: "bottom top",
            anticipatePin: 1,
            scrub: 4,
            // pin: true,
            ease: "power2.inOut",
          },
        });

        // 🔹 Image parallax + scale
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
            toggleActions: "play none none reverse", // run once when in view
          },
        });
        // 🔹 Image change on entering 2nd section
        ScrollTrigger.create({
          trigger: "#second-section",
          scroller: "[data-scroll-container]",
          start: "top bottom+=20%",
          onEnter: () => fadeImages(true),
          onLeaveBack: () => fadeImages(false),
        });
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
      {/* Hero section */}
      <section
        ref={sectionRef}
        className="h-[100vh]   relative bg-gradient-to-tl to-[#000000] from-[#0a212b]"
      >
        <div className="sticky  top-0 h-screen w-full">
          <div
            ref={imageContainerRef}
            className="relative w-full h-full z-[5] mt-47.5"
            style={{ transform: "scale(1.4)", filter: "brightness(0.7)" }}
          >
            <Image
              src="/HeroImages/Horse2.webp"
              alt="Hero 1"
              fill
              className="img1 object-cover absolute object-center opacity-65 transition-opacity duration-700"
              priority
            />
            {/* Image 2 */}
            <Image
              src="/Ahmed/Ahmed2.jpg"
              alt="Hero 2"
              fill
              className="img2  object-contain absolute object-center opacity-0 transition-opacity duration-700"
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

      {/* Second section (when user reaches this, image changes) */}
      <section
        id="second-section"
        // className=" h-screen flex justify-center gap-10 px-20 flex-col items-center bg-gradient-to-bl to-[#000000] from-[#0a212b] text-white py-20"
        className="h-screen flex justify-center items-center bg-gradient-to-bl to-[#000000] from-[#0a212b] text-white z-9  relative"
      >
        <div className="behind-text absolute top-[-40%] left-[40%]  max-w-lg text-left ">
          <h2 className="text-5xl font-bold mb-4 text-gradient  ">
            The Man Behind the Scene
          </h2>
          <p className="text-lg text-[#9ca3af] leading-relaxed">
            Meet Abbas — a storyteller whose lens reveals emotion beyond frames.
            Every image he captures is a glimpse into the unseen beauty that
            defines human connection.
          </p>
        </div>
      </section>
    </>
  );
};

export default BTL;

// maskImage: "radial-gradient(circle, white 0%, transparent 100%)",
