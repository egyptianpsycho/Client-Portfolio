"use client";
import gsap from "gsap";
import Image from "next/image";
import useAnimate from "@/Hooks/useAnimate";

const logos = [
  
  { src: "/Logos/adidas.png", alt: "Adidos" },
  { src: "/Logos/PUMA.svg", alt: "Puma" },
  { src: "/Logos/musume2.svg", alt: "musume" },
  { src: "/Logos/samsung.png", alt: "samsung" },
  { src: "/Logos/Porsche.svg.svg", alt: "Porsche" },
  { src: "/Logos/jumeira.png", alt: "Jumeria" },
  { src: "/Logos/NG.svg.svg", alt: "National Geographic" },
  { src: "/Logos/Tiktok.svg", alt: "TikTok" },
  { src: "/Logos/DubaiT.png", alt: "Etihad" },
  { src: "/Logos/google.svg", alt: "Etihad" },
];

const Partners = () => {
  useAnimate(() => {
      if (window.innerWidth >= 640) {
        const getAnimationValues = () => {
          const width = window.innerWidth;
          if (width < 1024) {
            return { row1: 75, row2: -95 }; // Tablet
          } else {
            return { row1: 50, row2: -90 }; // Desktop
          }
        };

        const { row1, row2 } = getAnimationValues();

        gsap.to(".partners-row-1", {
          xPercent: row1,
          ease: "none",
          scrollTrigger: {
            trigger: ".partners-grid",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            scroller: "[data-scroll-container]",
          },
        });

        gsap.to(".partners-row-2", {
          xPercent: row2,
          ease: "none",
          scrollTrigger: {
            trigger: ".partners-grid",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            scroller: "[data-scroll-container]",
          },
        });
      }

  });

  return (
    <section className="-mb-0.1  min-h-screen h-auto sm:h-screen  z-[100] pt-20 sm:pt-32 md:pt-40 pb-10 sm:pb-0 overflow-hidden bg-gradient-to-br to-[#000000] from-[#0a212b] flex items-center justify-center">
      <div className="relative flex flex-col sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-3 md:gap-3.5 -rotate-0 sm:-rotate-8 md:-rotate-10 w-full partners-grid px-4 sm:px-0 max-w-sm sm:max-w-none mx-auto ">
        {logos.map((logo, index) => (
          <div
            key={index}
            className={`trallelo logo-card w-full h-24 sm:w-auto sm:h-auto sm:p-12 md:p-16 lg:p-20 xl:p-28 2xl:p-40 justify-center items-center bg-gray-600/15 flex rounded ${
              index < 5 ? "partners-row-1" : "partners-row-2"
            }`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={150}
              className="object-contain  relative sm:absolute w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
            />
          </div>
        ))}
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