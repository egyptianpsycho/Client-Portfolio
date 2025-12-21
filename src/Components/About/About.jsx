"use client";
import useAnimate from "@/Hooks/useAnimate";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const paraLine1Ref = useRef(null);
  const paraLine2Ref = useRef(null);
  const paraLine3Ref = useRef(null);
  const paraLine4Ref = useRef(null);

  useAnimate(() => {
    const lines = [line1Ref.current, line2Ref.current];
    const paraLines = [
      paraLine1Ref.current,
      paraLine2Ref.current,
      paraLine3Ref.current,
      paraLine4Ref.current,
    ];

    gsap.set(lines, { yPercent: 120 });
    gsap.set(paraLines, { yPercent: 120 });

    ScrollTrigger.create({
      trigger: headingRef.current,
      start: "top 75%",
      scroller: "[data-scroll-container]",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          lines,
          { filter: "blur(4px)" },
          {
            yPercent: 0,
            duration: 1.2,
            filter: "blur(0px)",
            ease: "power3.out",
            stagger: 0.15,
          }
        );
      },
    });

    ScrollTrigger.create({
      trigger: paraRef.current,
      start: "top 85%",
      scroller: "[data-scroll-container]",
      toggleActions: "play none none reverse",
      onEnter: () => {
        gsap.fromTo(
          paraLines,
          { filter: "blur(4px)" },
          {
            yPercent: 0,
            duration: 1.2,
            filter: "blur(0px)",
            ease: "power3.out",
            stagger: 0.1,
          }
        );
      },
    });
  });

  return (
    <section
      className="second relative min-h-screen bg-gradient-to-tr to-[#000000] from-[#0a212b] z-[10] px-2 sm:px-10 py-12 sm:py-18 overflow-hidden"
      id="about"
    >
      <div className="flex flex-col h-full justify-between gap-8 sm:gap-0">
        {/* Main Heading with Animation */}
        <div
          ref={headingRef}
          className="w-full about-text font-normal text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7.7rem] text-white leading-tight sm:leading-snug"
          style={{ fontFamily: '"Work Sans", sans-serif' }}
        >
          <div style={{ overflow: "hidden" }}>
            <h1 ref={line1Ref} className="break-words max-sm:w-80">
              WE'RE A GLOBAL{" "}
              <span
                className="block sm:inline"
                style={{ fontFamily: '"Nanum Myeongjo", sans-serif' }}
              >
                CREATIVE &
              </span>
            </h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <h1
              ref={line2Ref}
              className="font-normal text-[2.8rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] relative flex flex-wrap items-baseline w-full"
              style={{ fontFamily: '"Nanum Myeongjo", sans-serif' }}
            >
              INNOVATION{" "}
              <span
                className="block w-full sm:w-auto sm:ml-auto lg:pr-8"
                style={{ fontFamily: '"Work Sans", sans-serif' }}
              >
                STUDIO
              </span>
            </h1>
          </div>
        </div>

        {/* Gradient Images */}
        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={300}
          height={300}
          className="-z-20 absolute inset-0 -left-32 sm:-left-48 md:-left-64 top-10 sm:top-20 object-contain w-[200px] sm:w-[300px] md:w-[400px]"
        />

        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={400}
          height={400}
          className="-z-20 absolute rotate-220 -right-20 sm:-right-48 md:-right-70 top-110 sm:top-60 md:top-100 object-contain w-[500px] sm:w-[400px] md:w-[600px]"
        />

        {/* World SVG Background */}
        <Image
          src="/AboutImages/World.svg"
          alt="World"
          fill
          className="-z-10 absolute object-cover sm:object-contain pt-0 sm:pt-18"
        />

        {/* Paragraph with Animation */}
        <div
          ref={paraRef}
          className="relative about-paragraph text-white leading-relaxed sm:leading-loose md:leading-11 text-xl sm:text-xl md:text-2xl lg:text-[2rem] max-w-[99%] sm:max-w-3xl md:max-w-3xl lg:max-w-4xl px-0 sm:px-0 md:px-0 tracking-normal mt-8 sm:mt-40 md:mt-60 lg:mt-80 max-sm:top-50 font-medium max-sm:mx-auto"
          style={{ fontFamily: '"Work Sans", sans-serif' }}
        >
          <div style={{ overflow: "hidden" }}>
            <p ref={paraLine1Ref} className="w-full about-para">
              We create culturally-inspired, social-first content. As strategic
            </p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <p ref={paraLine2Ref} className="w-full about-para">
              storytellers, we help global brands craft meaningful narratives
            </p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <p ref={paraLine3Ref} className="w-full about-para">
              that cut through the digital noise and connect across every
            </p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <p ref={paraLine4Ref} className="w-full about-para">
              emerging platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
