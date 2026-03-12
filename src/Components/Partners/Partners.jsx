"use client";
import gsap from "gsap";
import Image from "next/image";
import useAnimate from "@/Hooks/useAnimate";

const logos = [
  { src: "/Logos/jumeira.png", alt: "Jumeria" },
  { src: "/Logos/PUMA.svg", alt: "Puma" },
  { src: "/Logos/enbd.svg", alt: "enbd" },
  { src: "/Logos/samsung.png", alt: "samsung" },
  { src: "/Logos/Porsche.svg.svg", alt: "Porsche" },
  { src: "/Logos/bmw.png", alt: "bmw" },
  { src: "/Logos/magedw.svg", alt: "maged" },
  { src: "/Logos/4K.png", alt: "NYC" },
  { src: "/Logos/DubaiT.png", alt: "DubaiT" },
  { src: "/Logos/adidas.png", alt: "Adidas" },
];

const Partners = () => {
  useAnimate(() => {
    const getAnimationValues = () => {
      const width = window.innerWidth;
      if (width < 640) {
        return { row1: 30, row2: -40, row3: 25, row4: -35, row5: 20 }; // Mobile
      } else if (width < 1024) {
        return { row1: 35, row2: -45, row3: 30, row4: -40, row5: 25 }; // Tablet
      } else {
        return { row1: 25, row2: -40, row3: 20, row4: -30, row5: 15 }; // Desktop
      }
    };

    const { row1, row2, row3, row4, row5 } = getAnimationValues();

    const scrollTriggerConfig = {
      trigger: ".partners-grid",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      scroller: "[data-scroll-container]",
    };

    gsap.to(".partners-row-1", {
      xPercent: row1,
      ease: "none",
      scrollTrigger: scrollTriggerConfig,
    });

    gsap.to(".partners-row-2", {
      xPercent: row2,
      ease: "none",
      scrollTrigger: scrollTriggerConfig,
    });

    gsap.to(".partners-row-3", {
      xPercent: row3,
      ease: "none",
      scrollTrigger: scrollTriggerConfig,
    });

    gsap.to(".partners-row-4", {
      xPercent: row4,
      ease: "none",
      scrollTrigger: scrollTriggerConfig,
    });

    gsap.to(".partners-row-5", {
      xPercent: row5,
      ease: "none",
      scrollTrigger: scrollTriggerConfig,
    });
  });

  return (
    <section
      className="-mb-0.1 max-sm:min-h-[80vh] sm:min-h-screen h-auto sm:h-screen z-[100] pt-0 sm:pt-32 md:pt-40 pb-10 sm:pb-0 overflow-hidden bg-gradient-to-br to-[#000000] from-[#0a212b] flex items-center justify-center"
      id="PARTNERS"
    >
      <div className="relative w-full partners-grid -rotate-6 sm:-rotate-8 md:-rotate-10 space-y-4 sm:space-y-3 md:space-y-3.5">
        {/* First Row */}
        <div className="flex gap-4 sm:gap-3 md:gap-3.5 partners-row-1 px-4 sm:px-0 right-[50%] relative">
          {[
            ...logos.slice(0, 2),
            { src: "/Logos/2k.png", alt: "delivro" },
            ...logos.slice(3, 5),
            ...logos.slice(0, 3),
            { src: "/Logos/DubaiHoldingw.png", alt: "DubaiHolding" },
            { src: "/Logos/Sofitel.png", alt: "Sofitel.png" },
            ...logos.slice(0, 5),
          ].map((logo, index) => (
            <div
              key={index}
              className="trallelo logo-card flex-shrink-0 w-40 h-28 sm:w-auto sm:h-auto sm:p-12 md:p-16 lg:p-20 xl:p-28 2xl:p-40 justify-center items-center bg-gray-600/15 flex rounded"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={150}
                className="object-contain relative sm:absolute w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="flex gap-4 sm:gap-3 md:gap-3.5 partners-row-2 px-4 sm:px-0">
          {[
            ...logos.slice(5, 6),
            { src: "/Logos/3K.png", alt: "samsung" },
            ...logos.slice(7),
            ...logos.slice(5),
            ...logos.slice(5),
          ].map((logo, index) => (
            <div
              key={index}
              className="trallelo logo-card flex-shrink-0 w-40 h-28 sm:w-auto sm:h-auto sm:p-12 md:p-16 lg:p-20 xl:p-28 2xl:p-40 justify-center items-center bg-gray-600/15 flex rounded"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={150}
                className="object-contain relative sm:absolute w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Third Row — mobile only */}
        <div className="flex sm:hidden gap-4 partners-row-3 px-4 right-[30%] relative">
          {[
            ...logos.slice(2, 5),
            ...logos.slice(0, 5),
            ...logos.slice(0, 5),
          ].map((logo, index) => (
            <div
              key={index}
              className="trallelo logo-card flex-shrink-0 w-40 h-28 justify-center items-center bg-gray-600/15 flex rounded"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={150}
                className="object-contain w-16 h-16"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Fourth Row — mobile only */}
        <div className="flex sm:hidden gap-4 partners-row-4 px-4">
          {[
            ...logos.slice(6, 10),
            ...logos.slice(5),
            ...logos.slice(5),
          ].map((logo, index) => (
            <div
              key={index}
              className="trallelo logo-card flex-shrink-0 w-40 h-28 justify-center items-center bg-gray-600/15 flex rounded"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={150}
                className="object-contain w-16 h-16"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Fifth Row — mobile only */}
        <div className="flex sm:hidden gap-4 partners-row-5 px-4 right-[20%] relative">
          {[
            ...logos.slice(0, 3),
            ...logos.slice(7, 10),
            ...logos.slice(0, 5),
            ...logos.slice(0, 5),
          ].map((logo, index) => (
            <div
              key={index}
              className="trallelo logo-card flex-shrink-0 w-40 h-28 justify-center items-center bg-gray-600/15 flex rounded"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={150}
                className="object-contain w-16 h-16"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={400}
          height={400}
          className="-z-20 absolute inset-0 opacity-30 sm:opacity-40 scale-125 sm:scale-150 top-[30%] sm:top-[40%] left-[50%] sm:left-[60%] object-contain"
        />
      </div>
    </section>
  );
};

export default Partners;