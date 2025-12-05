"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { SplitText } from "gsap/all";
import useAnimate from "@/Hooks/useAnimate";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero() {
  const locationRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const locations = [
    "DUBAI",
    "UNITED STATES",
    "SWITZERLAND",
    "DENMARK",
    "ICELAND",
  ];

  useEffect(() => {
    if (!locationRef.current) return;

    const locationElements =
      locationRef.current.querySelectorAll(".location-text");
    let currentIndex = 0;
    let timeoutId = null;

    // Set initial state - all hidden
    gsap.set(locationElements, { y: 100, opacity: 0 });

    const animateLocation = () => {
      const current = locationElements[currentIndex];
      const nextIndex = (currentIndex + 1) % locations.length;
      const next = locationElements[nextIndex];

      const tl = gsap.timeline();

      // Animate current out (up)
      tl.fromTo(
        current,
        { y: 0, opacity: 1, filter: "blur(0px)" },
        {
          y: -100,
          opacity: 0,
          duration: 0.5,
          filter: "blur(8px)",
          ease: "power2.in",
        }
      );

      // Animate next in (from bottom)
      tl.fromTo(
        next,
        { y: 100, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          filter: "blur(0px)",
        },
        "-=0.3"
      );

      currentIndex = nextIndex;
      // Schedule next animation using requestAnimationFrame + setTimeout
      animationIntervalRef.current = requestAnimationFrame(() => {
        timeoutId = setTimeout(animateLocation, 2000);
      });
    };

    // Function to start the location animation loop
    const startLocationAnimation = () => {
      // Show first location
      gsap.to(locationElements[0], {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      // Start animation loop after a brief delay
      animationIntervalRef.current = requestAnimationFrame(() => {
        timeoutId = setTimeout(animateLocation, 2000);
      });
    };
    // Expose the start function globally so it can be triggered after signature
    window.startLocationAnimation = startLocationAnimation;

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [locations.length]);

  useAnimate(() => {
    const hero = document.querySelector(".hero-pin");
    const about = document.querySelector("#about");
    const path = document.querySelector("#pathToAnimate1");
    if (!path) return;
    const length = path.getTotalLength();
    // Pin animation
    if (!hero || !about) return;

    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      scroller: "[data-scroll-container]",
      invalidateOnRefresh: true,
    });

    gsap.to(".overlay-blur-pin", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        scroller: "[data-scroll-container]",
      },
    });

    // Signature animation
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      visibility: "visible",
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
      delay: 0.5,
      onComplete: () => {
        // Start location animation after signature completes
        if (window.startLocationAnimation) {
          window.startLocationAnimation();
        }
      },
    });
  });

  return (
    <section
      className="hero-section hero-pin relative h-screen w-full overflow-hidden"
      style={{ willChange: "transform" }}
    >
      <div className="absolute inset-0 hero-media pointer-events-none">
        <video
          src="/HeroImages/vid.mp4"
          alt="HeroImage"
          autoPlay={true}
          loop={true}
          muted
          className="object-cover"
        />
        {/* overlay(s) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-[#434343]/40" />
        <div className="absolute overlay-blur-pin inset-0 backdrop-blur-md opacity-0 z-[999]" />
      </div>

      <div className="absolute inset-0 -rotate-10 top-72 left-30 z-99 mix-blend-exclusion max-sm:inset-0 max-sm:left-10 max-sm:top-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 1718 491"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          role="img"
          className="w-[94%] max-sm:w-[120%]"
        >
          <g>
            <path
              d="M-16.9136 489.299C-13.7043 477.36 -5.83596 467.019 1.39852 457.243C43.77 399.988 94.4031 349.142 146.141 300.466C235.078 216.791 328.218 136.876 425.213 62.6901C443.224 48.9141 468.997 30.0855 488.657 16.8407C493.638 13.4846 498.753 10.3267 503.898 7.22779C507.233 5.21897 513.309 -0.736034 514.741 2.88927C516.507 7.35998 511.638 12.0137 509.522 16.3273C498.984 37.8054 487.145 58.6916 474.575 79.0365C428.926 152.924 376.324 222.171 327.881 294.184C309.913 320.894 295.181 343.004 280.193 371.115C268.836 392.416 255.88 418.287 255.26 443.278C254.361 479.541 297.141 475.496 321.305 470.62C424.963 449.704 521.157 368.403 574.905 278.924C577.444 274.696 583.23 269.082 580.273 265.133C579.473 264.066 577.58 264.865 576.276 265.137C570.489 266.348 561.015 270.737 556.471 272.915C519.43 290.672 485.849 316.475 456.281 344.81C431.115 368.927 401.233 398.897 388.327 432.204C380.282 452.967 401.408 445.75 412.715 440.541C476.204 411.297 533.66 365.59 585.971 319.989C636.077 276.311 682.012 228.251 727.382 179.752C729.311 177.691 744.755 161.399 732.435 173.379C711.446 193.79 692.342 215.975 675.16 239.694C671.687 244.488 633.087 294.467 640.447 301.926C647.309 308.88 660.097 301.809 669.653 299.823C723.543 288.625 776.837 273.126 829.419 257.044C920.337 229.236 1009.59 196.465 1098.89 163.929C1099.35 163.76 1149.24 141.726 1150.06 150.066C1152.29 172.865 1150.33 197.066 1147.44 219.707C1145.34 236.216 1144.54 259.675 1167.46 258.417C1202.3 256.504 1238.33 234.155 1268.45 219.047C1339.63 183.338 1410.5 147.803 1485.42 120.354C1530.51 103.833 1581.51 84.119 1630.3 82.2506C1643.38 81.7496 1649.9 87.5531 1660.57 93.6864C1677.66 103.514 1696.98 102.138 1715.93 100.667"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              id="pathToAnimate1"
            ></path>
          </g>
        </svg>
      </div>

      <div
        className="relative z-30 flex flex-col items-center justify-center h-full pt-5 hero max-sm:top-11"
        style={{ willChange: "filter" }}
      >
        <svg
          role="img"
          aria-label="Abbas — photography"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 160"
          width={"100%"}
          height={"100%"}
          preserveAspectRatio="xMidYMid meet"
          className={"text-[20vw] z-40"}
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

        {/* Location Animation Component */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center ">
          <div
            ref={locationRef}
            className="relative h-24 w-full max-w-[520px] overflow-hidden "
          >
            {locations.map((location) => (
              <div
                key={location}
                className="location-text absolute inset-0 flex items-center justify-center z-10"
              >
                <span className="text-white/90 text-2xl font-light tracking-[0.3em] max-sm:text-lg max-sm:tracking-[0.2em]">
                  {location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// "use client";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Image from "next/image";
// import { SplitText } from "gsap/all";
// import useAnimate from "@/Hooks/useAnimate";
// import { useEffect, useRef } from "react";

// gsap.registerPlugin(ScrollTrigger, SplitText);

// export default function Hero() {
//   const locationRef = useRef(null);
//   const animationIntervalRef = useRef(null);
//   const locations = [
//     "DUBAI",
//     "UNITED STATES",
//     "SWITZERLAND",
//     "DENMARK",
//     "ICELAND",
//   ];

//   useEffect(() => {
//     if (!locationRef.current) return;

//     const locationElements =
//       locationRef.current.querySelectorAll(".location-text");
//     let currentIndex = 0;
//     let timeoutId = null;

//     // Set initial state - all hidden
//     gsap.set(locationElements, { y: 100, opacity: 0 });

//     const animateLocation = () => {
//       const current = locationElements[currentIndex];
//       const nextIndex = (currentIndex + 1) % locations.length;
//       const next = locationElements[nextIndex];

//       const tl = gsap.timeline();

//       // Animate current out (up)
//       tl.fromTo(
//         current,
//         { y: 0, opacity: 1, filter: "blur(0px)" },
//         {
//           y: -100,
//           opacity: 0,
//           duration: 0.5,
//           filter: "blur(8px)",
//           ease: "power2.in",
//         }
//       );

//       // Animate next in (from bottom)
//       tl.fromTo(
//         next,
//         { y: 100, opacity: 0, filter: "blur(8px)" },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.5,
//           ease: "power2.out",
//           filter: "blur(0px)",
//         },
//         "-=0.3"
//       );

//       currentIndex = nextIndex;
//       // Schedule next animation using requestAnimationFrame + setTimeout
//       animationIntervalRef.current = requestAnimationFrame(() => {
//         timeoutId = setTimeout(animateLocation, 2000);
//       });
//     };

//     // Function to start the location animation loop
//     const startLocationAnimation = () => {
//       // Show first location
//       gsap.to(locationElements[0], {
//         y: 0,
//         opacity: 1,
//         duration: 0.5,
//         ease: "power2.out",
//       });

//       // Start animation loop after a brief delay
//       animationIntervalRef.current = requestAnimationFrame(() => {
//         timeoutId = setTimeout(animateLocation, 2000);
//       });
//     };
//     // Expose the start function globally so it can be triggered after signature
//     window.startLocationAnimation = startLocationAnimation;

//     return () => {
//       if (animationIntervalRef.current) {
//         clearInterval(animationIntervalRef.current);
//       }
//     };
//   }, [locations.length]);

//   useAnimate(() => {
//     const hero = document.querySelector(".hero-pin");
//     const about = document.querySelector("#about");
//     const path = document.querySelector("#pathToAnimate1");
//     if (!path) return;
//     const length = path.getTotalLength();
//     // Pin animation
//     if (!hero || !about) return;

//     ScrollTrigger.create({
//       trigger: hero,
//       start: "top top",
//       end: "bottom top",
//       pin: true,
//       pinSpacing: false,
//       anticipatePin: 1,
//       scroller: "[data-scroll-container]",
//       invalidateOnRefresh: true,
//     });

//     gsap.to(".overlay-blur-pin", {
//       opacity: 1,
//       scrollTrigger: {
//         trigger: ".second",
//         start: "top bottom",
//         end: "top top",
//         scrub: 1,
//         scroller: "[data-scroll-container]",
//       },
//     });

//     // Signature animation
//     gsap.set(path, {
//       strokeDasharray: length,
//       strokeDashoffset: length,
//       visibility: "visible",
//     });

//     gsap.to(path, {
//       strokeDashoffset: 0,
//       duration: 3,
//       ease: "power2.out",
//       delay: 0.5,
//       onComplete: () => {
//         // Start location animation after signature completes
//         if (window.startLocationAnimation) {
//           window.startLocationAnimation();
//         }
//       },
//     });
//   });

//   return (
//     <section
//       className="hero-section hero-pin relative h-screen w-full overflow-hidden"
//       style={{ willChange: "transform" }}
//     >
//       <div className="absolute inset-0 hero-media pointer-events-none">
//         <Image
//           src="/HeroImages/CubeE.webp"
//           alt="HeroImage"
//           fill
//           priority
//           quality={100}
//           className="object-cover"
//         />
//         {/* overlay(s) */}
//         <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-[#434343]/40" />
//         <div className="absolute overlay-blur-pin inset-0 backdrop-blur-md opacity-0 z-[999]" />
//       </div>

//       <div className="absolute inset-0 -rotate-10 top-72 left-30 z-99 mix-blend-exclusion max-sm:inset-0 max-sm:left-10 max-sm:top-40">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="100%"
//           height="100%"
//           viewBox="0 0 1718 491"
//           fill="none"
//           preserveAspectRatio="xMidYMid meet"
//           aria-hidden="true"
//           role="img"
//           className="w-[94%] max-sm:w-[120%]"
//         >
//           <g>
//             <path
//               d="M-16.9136 489.299C-13.7043 477.36 -5.83596 467.019 1.39852 457.243C43.77 399.988 94.4031 349.142 146.141 300.466C235.078 216.791 328.218 136.876 425.213 62.6901C443.224 48.9141 468.997 30.0855 488.657 16.8407C493.638 13.4846 498.753 10.3267 503.898 7.22779C507.233 5.21897 513.309 -0.736034 514.741 2.88927C516.507 7.35998 511.638 12.0137 509.522 16.3273C498.984 37.8054 487.145 58.6916 474.575 79.0365C428.926 152.924 376.324 222.171 327.881 294.184C309.913 320.894 295.181 343.004 280.193 371.115C268.836 392.416 255.88 418.287 255.26 443.278C254.361 479.541 297.141 475.496 321.305 470.62C424.963 449.704 521.157 368.403 574.905 278.924C577.444 274.696 583.23 269.082 580.273 265.133C579.473 264.066 577.58 264.865 576.276 265.137C570.489 266.348 561.015 270.737 556.471 272.915C519.43 290.672 485.849 316.475 456.281 344.81C431.115 368.927 401.233 398.897 388.327 432.204C380.282 452.967 401.408 445.75 412.715 440.541C476.204 411.297 533.66 365.59 585.971 319.989C636.077 276.311 682.012 228.251 727.382 179.752C729.311 177.691 744.755 161.399 732.435 173.379C711.446 193.79 692.342 215.975 675.16 239.694C671.687 244.488 633.087 294.467 640.447 301.926C647.309 308.88 660.097 301.809 669.653 299.823C723.543 288.625 776.837 273.126 829.419 257.044C920.337 229.236 1009.59 196.465 1098.89 163.929C1099.35 163.76 1149.24 141.726 1150.06 150.066C1152.29 172.865 1150.33 197.066 1147.44 219.707C1145.34 236.216 1144.54 259.675 1167.46 258.417C1202.3 256.504 1238.33 234.155 1268.45 219.047C1339.63 183.338 1410.5 147.803 1485.42 120.354C1530.51 103.833 1581.51 84.119 1630.3 82.2506C1643.38 81.7496 1649.9 87.5531 1660.57 93.6864C1677.66 103.514 1696.98 102.138 1715.93 100.667"
//               stroke="#ffffff"
//               strokeWidth="3"
//               strokeLinecap="round"
//               id="pathToAnimate1"
//             ></path>
//           </g>
//         </svg>
//       </div>

//       <div
//         className="relative z-30 flex flex-col items-center justify-center h-full pt-5 hero max-sm:top-11"
//         style={{ willChange: "filter" }}
//       >
//         <svg
//           role="img"
//           aria-label="Abbas — photography"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 500 160"
//           width={"100%"}
//           height={"100%"}
//           preserveAspectRatio="xMidYMid meet"
//           className={"text-[20vw] z-40"}
//         >
//           <defs>
//             <linearGradient id="serifGrad" x1="0" x2="1" y1="0" y2="1">
//               <stop offset="0" stopColor="#D7D7D7" />
//               <stop offset="1" stopColor="#68A1B7" />
//             </linearGradient>
//             <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
//               <feDropShadow
//                 dx="0"
//                 dy="2"
//                 stdDeviation="6"
//                 floodColor="#000000"
//                 floodOpacity="0.35"
//               />
//             </filter>
//           </defs>

//           <g filter="url(#shadow)">
//             <text
//               x="50%"
//               y="65%"
//               textAnchor="middle"
//               style={{ fontFamily: '"Work Sans", sans-serif' }}
//               fontWeight="700"
//               fontSize="92"
//               fill="url(#serifGrad)"
//               letterSpacing="-2"
//               className="select-none h-text"
//               id="hero-text"
//             >
//               ABBAS
//             </text>
//           </g>
//         </svg>

//         {/* Location Animation Component */}
//         <div className="absolute bottom-20 left-0 right-0 flex justify-center ">
//           <div
//             ref={locationRef}
//             className="relative h-24 w-full max-w-[520px] overflow-hidden "
//           >
//             {locations.map((location) => (
//               <div
//                 key={location}
//                 className="location-text absolute inset-0 flex items-center justify-center z-10"
//               >
//                 <span className="text-white/90 text-2xl font-light tracking-[0.3em] max-sm:text-lg max-sm:tracking-[0.2em]">
//                   {location}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
