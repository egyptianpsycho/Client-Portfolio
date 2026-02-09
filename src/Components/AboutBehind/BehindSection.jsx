"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";



const BehindSection = () => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const isMobile = width < 500;
  return (
    <section
      id="second-section"
      className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden py-32"
    >
      {/* Subtle background grain */}
      <div className="absolute inset-0 opacity-[0.015]" 
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'}} 
      />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-5xl">
        
        {/* Image Container */}
        <div className="flex justify-center mb-20" >
          <div className="relative">
            {/* Main image */}
            <div className="relative w-72 h-96 sm:w-80 sm:h-[28rem] md:w-96 md:h-[24.1rem]">
              <div className="absolute inset-0 bg-white/5 " />
              {/* <img
                src="/api/placeholder/400/550"
                alt="Abbas - Photographer"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              /> */}
              <Image
        src="/Ahmed/Ahmed3.jpg"
        alt="Hero 2"
        width={500}
        height={500}
        className={`object-contain brightness-[0.7] w-[230px] sm:w-[400px]  md:w-full max-sm:left-13 `}
      />
              {/* Subtle border */}
              <div className="absolute inset-0 border border-white/10" />
            </div>
            
            {/* Minimal accent line */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-px bg-white/20" />
          </div>
        </div>

        {/* Content Container */}
        <div className="text-center space-y-12" 
        >
          
          {/* Title */}
          <div className="space-y-6">
            <h2 className="behind-title text-5xl sm:text-6xl md:text-7xl font-light tracking-tight ">
              The Man Behind
              <br />
              <span className="italic font-extralight ">the Scene</span>
            </h2>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="relative" >
              <p className="original text-lg sm:text-xl text-white/60 leading-relaxed font-light">
                Meet Abbas — a storyteller whose lens reveals emotion beyond frames.
                Every image he captures is a glimpse into the unseen beauty that
                defines human connection.
              </p>
              <div
                className="typingOverlay pointer-events-none absolute inset-0 text-lg sm:text-xl text-white/60 leading-relaxed font-light"
                aria-hidden="true"
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>

            {/* Minimal divider */}
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-8 h-px bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-8 h-px bg-white/10" />
            </div>

            {/* Signature or year */}
            <div className="text-white/40 text-sm font-light tracking-widest ">
              EST. 2007
              <div className="relative inset-0 -rotate-2 top-12  right-120  z-99 mix-blend-exclusion pointer-events-none   max-sm:inset-0 max-sm:right-10 max-sm:bottom-76  ">
            <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 1718 491"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                  role="img"
                  className="w-[94%] max-sm:w-[120%] "
                >
                  <g>
                    <path
                      d="M-16.9136 489.299C-13.7043 477.36 -5.83596 467.019 1.39852 457.243C43.77 399.988 94.4031 349.142 146.141 300.466C235.078 216.791 328.218 136.876 425.213 62.6901C443.224 48.9141 468.997 30.0855 488.657 16.8407C493.638 13.4846 498.753 10.3267 503.898 7.22779C507.233 5.21897 513.309 -0.736034 514.741 2.88927C516.507 7.35998 511.638 12.0137 509.522 16.3273C498.984 37.8054 487.145 58.6916 474.575 79.0365C428.926 152.924 376.324 222.171 327.881 294.184C309.913 320.894 295.181 343.004 280.193 371.115C268.836 392.416 255.88 418.287 255.26 443.278C254.361 479.541 297.141 475.496 321.305 470.62C424.963 449.704 521.157 368.403 574.905 278.924C577.444 274.696 583.23 269.082 580.273 265.133C579.473 264.066 577.58 264.865 576.276 265.137C570.489 266.348 561.015 270.737 556.471 272.915C519.43 290.672 485.849 316.475 456.281 344.81C431.115 368.927 401.233 398.897 388.327 432.204C380.282 452.967 401.408 445.75 412.715 440.541C476.204 411.297 533.66 365.59 585.971 319.989C636.077 276.311 682.012 228.251 727.382 179.752C729.311 177.691 744.755 161.399 732.435 173.379C711.446 193.79 692.342 215.975 675.16 239.694C671.687 244.488 633.087 294.467 640.447 301.926C647.309 308.88 660.097 301.809 669.653 299.823C723.543 288.625 776.837 273.126 829.419 257.044C920.337 229.236 1009.59 196.465 1098.89 163.929C1099.35 163.76 1149.24 141.726 1150.06 150.066C1152.29 172.865 1150.33 197.066 1147.44 219.707C1145.34 236.216 1144.54 259.675 1167.46 258.417C1202.3 256.504 1238.33 234.155 1268.45 219.047C1339.63 183.338 1410.5 147.803 1485.42 120.354C1530.51 103.833 1581.51 84.119 1630.3 82.2506C1643.38 81.7496 1649.9 87.5531 1660.57 93.6864C1677.66 103.514 1696.98 102.138 1715.93 100.667"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      id="pathToAnimate3"
                      styles={
                        "stroke-dashoffset: 0px; stroke-dasharray: 3805.57;"
                      }
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BehindSection;
