"use client";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);
const logos = [
  { src: "/Logos/samsung.png", alt: "samsung" },
  { src: "/Logos/musume2.png", alt: "musume" },
  { src: "/Logos/NG.svg.png", alt: "National Geographic" },
  { src: "/Logos/PUMA.png", alt: "Puma" },
  { src: "/Logos/Porsche.svg.png", alt: "Porsche" },
  { src: "/Logos/jumeira.png", alt: "Jumeria" },
  { src: "/Logos/Tiktok.svg", alt: "TikTok" },
  { src: "/Logos/adidas.png", alt: "Adidos" },
  { src: "/Logos/DubaiT.png", alt: "Etihad" },
  { src: "/Logos/google.svg", alt: "Etihad" },
];

const Partners = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      setTimeout(() => {
        gsap.to(".partners-row-1", {
          xPercent: 50,
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
          xPercent: -90,
          ease: "none",
          scrollTrigger: {
            trigger: ".partners-grid",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            scroller: "[data-scroll-container]",
          },
        });

        ScrollTrigger.refresh();
      }, 1000);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
     className="h-screen isolate   z-100 pt-40 overflow-y-hidden overflow-x-hidden bg-gradient-to-bl to-[#000000] from-[#0a212b] ">
      <div className="relative grid grid-cols-2 grid-rows-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-3.5  -rotate-10 inset-0 w-full partners-grid ">
        {logos.map((logo, index) => (
          <div
            key={index}
            className={`logo-card p-10 sm:p-16 md:p-20 lg:p-28 xl:p-40  justify-center items-center bg-gray-600/15 flex ${
              index < 5 ? "partners-row-1" : "partners-row-2"
            }`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={150}
              className="object-contain absolute w-16 sm:w-20 md:w-28 lg:w-36 "
            />
            
          </div>
        ))}
        <Image
                      src="/gradients/sky_gradient_white.png"
                      alt="gradient"
                      width={400}
                      height={400}
                      className="-z-20 absolute inset-0 opacity-40 scale-150 top-[40%] left-[60%] object-contain " />
        </div>
    </section>
  );
};

export default Partners;
