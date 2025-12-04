"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [headingInView, setHeadingInView] = useState(false);
  const [paraInView, setParaInView] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const headingRef = useRef(null);
  const paraRef = useRef(null);

  useEffect(() => {
    // Wait for preloader and page to be fully ready
    const initTimer = setTimeout(() => {
      setIsReady(true);
    }, 100); // Adjust this delay based on your preloader duration

    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Add a delay to ensure Locomotive Scroll is ready
    const timer = setTimeout(() => {
      // Heading animation trigger
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: "top 75%",
        scroller: "[data-scroll-container]",
        onEnter: () => setHeadingInView(true),
        once: true,
      });

      // Paragraph animation trigger
      ScrollTrigger.create({
        trigger: paraRef.current,
        start: "top 85%",
        scroller: "[data-scroll-container]",
        onEnter: () => setParaInView(true),
        once: true,
      });

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.vars.trigger === headingRef.current ||
          trigger.vars.trigger === paraRef.current
        ) {
          trigger.kill();
        }
      });
    };
  }, [isReady]);

  const animation = {
    initial: { y: "100%" },
    enter: (i) => ({
      y: "0",
      transition: {
        duration: 0.75,
        ease: [0.33, 1, 0.68, 1],
        delay: 0.075 * i,
      },
    }),
  };

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
            <motion.h1
              custom={0}
              variants={animation}
              initial="initial"
              animate={headingInView ? "enter" : ""}
              className="break-words max-sm:w-80"
            >
              WE'RE A GLOBAL{" "}
              <span
                className="block sm:inline"
                style={{ fontFamily: '"Nanum Myeongjo", sans-serif' }}
              >
                CREATIVE &
              </span>
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              custom={1}
              variants={animation}
              initial="initial"
              animate={headingInView ? "enter" : ""}
              className="font-normal text-[2.8rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] relative flex flex-wrap items-baseline w-full"              style={{ fontFamily: '"Nanum Myeongjo", sans-serif' }}
            >
              INNOVATION{" "}
              <span
                className="block w-full sm:w-auto sm:ml-auto lg:pr-8"
                style={{ fontFamily: '"Work Sans", sans-serif' }}
              >
                STUDIO
              </span>
            </motion.h1>
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
            <motion.p
              custom={0}
              variants={animation}
              initial="initial"
              animate={paraInView ? "enter" : ""}
              className="w-full about-para"
            >
              We create culturally-inspired, social-first content. As strategic storytellers, we help global brands craft meaningful narratives that cut through the digital noise and connect across every emerging platform.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
