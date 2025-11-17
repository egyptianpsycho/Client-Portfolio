"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero() {
  useEffect(() => {
    const hero = document.querySelector(".hero-section");
    const about = document.querySelector("#about");

    // Guard: wait until both exist
    if (!hero || !about) return;

    // Delay trigger creation slightly until Locomotive finishes
    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          endTrigger: about,
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: true,
          scroller: "[data-scroll-container]",
        });
      });

      ScrollTrigger.refresh();

      return () => ctx.revert();
    }, 300); // wait 0.3s for Locomotive init

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const createAnimation = () => {
      gsap.fromTo(
        ".hero",
        { filter: "blur(0px)" },
        {
          filter: "blur(5px)",
          scrollTrigger: {
            trigger: ".second",
            start: "top bottom",
            end: "top top",
            scrub: true,
            scroller: "[data-scroll-container]",
          },
        }
      );
    };

    ScrollTrigger.addEventListener("refresh", createAnimation);

    createAnimation();

    return () => {
      ScrollTrigger.removeEventListener("refresh", createAnimation);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const animateSignature = () => {
      const path = document.querySelector("#pathToAnimate1");
      if (!path) return;
  
      const length = path.getTotalLength();
  
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, visibility: "visible" });
  
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.out",
      });
    };
  
    if (!document.getElementById("preloader")) {
      animateSignature();
      return;
    }
  
    window.addEventListener("preloaderFinished", animateSignature, { once: true });
    return () => window.removeEventListener("preloaderFinished", animateSignature);
  }, []);
  
  
  
  

  return (
    <section
      className="hero-section relative h-screen w-full overflow-hidden "
      /* note: removed data-scroll-sticky / data-scroll-target */
    >
      <div className="absolute inset-0 hero-media pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent pointer-events-none" />

        <Image
          src="/HeroImages/Cube.webp"
          alt="HeroImage"
          fill
          priority
          className="object-cover  "
        />
        {/* overlay(s) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-[#434343]/40 backdrop-blur-xs" />
      </div>
      <div className="absolute inset-0 -rotate-10 top-72 left-30 z-99 mix-blend-exclusion ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 1718 491"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          role="img"
          className="w-[94%] "
        >
          <g>
            <path
              d="M-16.9136 489.299C-13.7043 477.36 -5.83596 467.019 1.39852 457.243C43.77 399.988 94.4031 349.142 146.141 300.466C235.078 216.791 328.218 136.876 425.213 62.6901C443.224 48.9141 468.997 30.0855 488.657 16.8407C493.638 13.4846 498.753 10.3267 503.898 7.22779C507.233 5.21897 513.309 -0.736034 514.741 2.88927C516.507 7.35998 511.638 12.0137 509.522 16.3273C498.984 37.8054 487.145 58.6916 474.575 79.0365C428.926 152.924 376.324 222.171 327.881 294.184C309.913 320.894 295.181 343.004 280.193 371.115C268.836 392.416 255.88 418.287 255.26 443.278C254.361 479.541 297.141 475.496 321.305 470.62C424.963 449.704 521.157 368.403 574.905 278.924C577.444 274.696 583.23 269.082 580.273 265.133C579.473 264.066 577.58 264.865 576.276 265.137C570.489 266.348 561.015 270.737 556.471 272.915C519.43 290.672 485.849 316.475 456.281 344.81C431.115 368.927 401.233 398.897 388.327 432.204C380.282 452.967 401.408 445.75 412.715 440.541C476.204 411.297 533.66 365.59 585.971 319.989C636.077 276.311 682.012 228.251 727.382 179.752C729.311 177.691 744.755 161.399 732.435 173.379C711.446 193.79 692.342 215.975 675.16 239.694C671.687 244.488 633.087 294.467 640.447 301.926C647.309 308.88 660.097 301.809 669.653 299.823C723.543 288.625 776.837 273.126 829.419 257.044C920.337 229.236 1009.59 196.465 1098.89 163.929C1099.35 163.76 1149.24 141.726 1150.06 150.066C1152.29 172.865 1150.33 197.066 1147.44 219.707C1145.34 236.216 1144.54 259.675 1167.46 258.417C1202.3 256.504 1238.33 234.155 1268.45 219.047C1339.63 183.338 1410.5 147.803 1485.42 120.354C1530.51 103.833 1581.51 84.119 1630.3 82.2506C1643.38 81.7496 1649.9 87.5531 1660.57 93.6864C1677.66 103.514 1696.98 102.138 1715.93 100.667"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              id="pathToAnimate1"
              styles={"stroke-dashoffset: 0px; stroke-dasharray: 3805.57;"}
            ></path>
          </g>
        </svg>
        
      </div>
      <div className="relative z-30 flex items-center justify-center h-full pt-5 hero">
        {/* svg content unchanged */}
        {/*  */}

        {/*  */}
        <svg
          role="img"
          aria-label="Abbas — photography"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 160"
          width={"100%"}
          height={"100%"}
          preserveAspectRatio="xMidYMid meet"
          className={" text-[20vw] z-40"}
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
              className="select-none h-text"
              id="hero-text"
            >
              ABBAS
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
