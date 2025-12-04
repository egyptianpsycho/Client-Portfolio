"use client";
import useAnimate from "@/Hooks/useAnimate";
import gsap from "gsap";
import React from "react";
import Image from "next/image";

const Contact = () => {
  useAnimate(() => {
    const path = document.querySelector("#pathToAnimate2");
    if (!path) return;
    const le = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: le,
      strokeDashoffset: le,
      visibility: "visible",
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#pathToAnimate2",
        start: "top 110%",
        end: "bottom center",
        scrub: 2,
        scroller: "[data-scroll-container]",
      },
    });
  });
  return (
    <section
      id="CONTACT"
      className="contact-section min-h-screen   bg-gradient-to-t from-black via-slate-600 to-[#0a212b]  relative -mt-0.5"
    >
      <div id="blob1"></div>
      <div id="blob2"></div>
      <div id="blob3"></div>
      <div id="noiseLayer"></div>

      <svg
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "none" }}
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".75"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
      </svg>

      <div className="w-full min-h-screen absolute     text-white overflow-hidden flex justify-center items-start p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-black/80 to-neutral-700/40 opacity-40" />
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2  relative z-10  ">
          {/* Left Side */}
          <div className="space-y-6 ml-4   ">
            <h1
              className="text-5xl lg:text-7xl font-medium leading-19 max-sm:leading-none pt-4 max-sm:mix-blend-difference "
              style={{ fontFamily: '"Work Sans", sans-serif' }}
            >
              SHAPING THE <br /> FUTURE OF <br /> CULTURE,
              <span style={{ fontFamily: "Nanum Myeongjo", fontWeight: "400" }}>
                {" "}
                TODAY
              </span>
            </h1>
            <Image
              src="/gradients/sky_gradient_white.png"
              alt="gradient"
              width={300}
              height={300}
              className="-z-20 absolute inset-0 -left-32 sm:-left-48 md:-left-52 top-10 sm:-top-20 object-contain w-[200px] sm:w-[300px] md:w-[400px]"
            />

            <div className="">
            <div className="absolute inset-0 -rotate- top-26  right-120  z-99 mix-blend-exclusion pointer-events-none   max-sm:inset-0 max-sm:right-10 max-sm:bottom-76  ">
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
                      id="pathToAnimate2"
                      styles={
                        "stroke-dashoffset: 0px; stroke-dasharray: 3805.57;"
                      }
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="space-y-8 w-2xl max-sm:w-90 place-self-end max-sm:place-self-auto mt-48 max-sm:mt-20 max-sm:ml-4 font-bold  ">
            <h2
              className="text-5xl  pb-4 max-sm:pb-0 max-sm:text-4xl "
              style={{
                fontFamily: '"Work Sans", sans-serif',
                fontWeight: "300",
              }}
            >
              LET’S COCK{" "}
              <span style={{ fontFamily: "Nanum Myeongjo", fontWeight: "400" }}>
                TOGETHER
              </span>
            </h2>

            <form method="post" action="https://formspree.io/f/mzzqwoal" className="space-y-6 w-[40rem] max-sm:w-[20rem]  text-lg ">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="NAME"
                  className="w-full bg-transparent border-b border-white/40 focus:border-lime-50 duration-500 outline-none p-2"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  className="w-full bg-transparent border-b border-white/40 focus:border-lime-50 duration-500 outline-none p-2"
                />
              </div>

              <div>
                <textarea
                  placeholder="YOUR THOUGHTS"
                  name="message"
                  rows="4"
                  className="w-full bg-transparent border-b border-white/40 focus:border-lime-50 duration-500 outline-none p-2"
                />
              </div>

              <button
                type="submit"
                className="mt-4 cursor-pointer duration-500 px-6 py-2 rounded-full border border-lime-400 text-lime-400 text-sm hover:bg-lime-400 hover:text-black transition flex items-center gap-2"
              >
                <span>Send It</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
