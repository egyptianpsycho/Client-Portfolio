"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const IMAGES = [
  {
    src: "/idk.jpg",
    alt: "idk",
  },
  {
    src: "/swiss.jpg",
    alt: "swiss",
  },
  {
    src: "/NY.jpg",
    alt: "new york",
  },
];

const BehindSection = ({
  BehindTLRef,
  BehindImgRef,
  BehindCardRef,
  tRef,
  typingRef,
}) => {
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
      className={`${
        isMobile ? "h-[100vh]" : "h-[200vh]"
      } flex justify-center items-center 
      bg-gradient-to-bl to-[#000000]
         from-[#0a212b]
       text-white relative`}
    >
      <div
        ref={BehindTLRef}
        className={`absolute subtitle behind-text top-[10%] right-[2%] sm:right-[1%] 
        max-w-[90%] sm:max-w-md md:max-w-lg text-left px-4 sm:px-0 ${
          isMobile ? "max-sm:top-80" : ""
        } `}
      >
        <h2 className="behind-title text-3xl  sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gradient">
          The Man Behind the Scene
        </h2>

        <div className="relative">
          <div
            className="original mix-blend-difference text-sm sm:text-base md:text-lg text-[#9ca3af] leading-relaxed"
            ref={tRef}
          >
            Meet Abbas — a storyteller whose lens reveals emotion beyond frames.
            Every image he captures is a glimpse into the unseen beauty that
            defines human connection.
          </div>
          

          <div
            ref={typingRef}
            className="typingOverlay pointer-events-none absolute inset-0 text-sm sm:text-base md:text-lg text-[#9ca3af] leading-relaxed"
            aria-hidden="true"
            style={{ whiteSpace: "pre-wrap" }}
          />
        </div>
      </div>

      <Image
        ref={BehindImgRef}
        src="/Ahmed/Ahmed3.jpg"
        alt="Hero 2"
        width={500}
        height={500}
        className={`object-contain absolute inset-0 ${
          isMobile ? "opacity-100" : "opacity-0"
        } 
        left-[3%] sm:left-[5%] md:left-[5.72%] 
        top-[5.7%] brightness-[0.7] w-[230px] sm:w-[400px] md:w-[500px] max-sm:left-13`}
      />

      <div
        className={`flex flex-col justify-center items-center end-24 opacity-65 absolute top-[30%] ${isMobile? "hidden":""}  `}
        ref={BehindCardRef}
      >
        {IMAGES.map((image, index) => (
          <div
            key={index}
            className="mx-2 sm:mx-4 relative inline-block my-2 w-32 sm:w-40 md:w-50"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={200}
              height={200}
              className="object-cover object-center rounded-lg shadow-lg 
              h-24 sm:h-32 md:h-40 w-full  "
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BehindSection;
