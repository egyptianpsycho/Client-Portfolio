"use client";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);
const logos = [
  { src: "/Logos/adidas.png", alt: "Adidos" },
  { src: "/Logos/jumeira.png", alt: "jumeria" },
  { src: "/Logos/samsung.png", alt: "samsung" },
  { src: "/Logos/Tiktok.svg", alt: "TikTok" },
  { src: "/Logos/google.svg", alt: "Epic Games" },
  { src: "/Logos/google.svg", alt: "Etihad" },
  { src: "/Logos/google.svg", alt: "Etihad" },
  { src: "/Logos/google.svg", alt: "Etihad" },
  { src: "/Logos/google.svg", alt: "Etihad" },
  { src: "/Logos/google.svg", alt: "Etihad" },
  // add more logos here
];

const Partners = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".partners-row-1", {
        xPercent: 50, // move right
        ease: "none",
        scrollTrigger: {
          trigger: ".partners-grid",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          scroller: "[data-scroll-container]", // keep for Locomotive
        },
      });

      gsap.to(".partners-row-2", {
        xPercent: -50, // move left
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="h-screen isolate  z-100 pt-40 overflow-y-hidden overflow-x-hidden bg-gradient-to-b to-[#000000] from-[#0a212b] ">
      <div className="relative grid grid-cols-5 grid-rows-2 gap-3.5 -rotate-10 inset-0 w-full partners-grid">
        {logos.map((logo, index) => (
          <div
            key={index}
            className={`logo-card p-40 justify-center items-center bg-gray-600/15 flex ${
              index < 5 ? "partners-row-1" : "partners-row-2"
            }`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={150}
              className="object-center absolute"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
