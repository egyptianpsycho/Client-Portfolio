"use client"
import gsap from "gsap";
import Image from "next/image";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  useEffect(() => {
    gsap.fromTo(".hero", {
      filter: "blur(0px)",
      
    },{
      filter: "blur(5px)",
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        scrub: true
      }
    });
  },[])
  return (
    <section className="sticky top-0 -z-10 h-screen w-full overflow-hidden ">
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent pointer-events-none" />
      <Image
        src="/HeroImages/Cube.webp"
        alt="HeroImage"
        fill
        priority
        className="object-cover hero"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-[#434343]/40 backdrop-blur-xs" />

      <div className="relative flex items-center justify-center h-full pt-5 hero">
        <svg
          role="img"
          aria-label="Abbas — photography"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 160"
          width={"100%"}
          height={"100%"}
          preserveAspectRatio="xMidYMid meet"
          className={" text-[20vw] z-10"}
        >
          <defs>
            <linearGradient id="serifGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#D7D7D7" />
              <stop offset="1" stopColor="#68A1B7" />
            </linearGradient>

            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="6"
                floodColor="#000000"
                floodOpacity="0.35"
              />
            </filter>
          </defs>

          <g filter="url(#shadow)">
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              style={{ fontFamily: '"Work Sans", sans-serif' }}
              fontWeight="700"
              fontSize="92"
              fill="url(#serifGrad)"
              letterSpacing="-2"
              className="select-none"
            >
              ABBAS
            </text>
          </g>
        </svg>
        
      </div>
    </section>
  );
};

export default Hero;
