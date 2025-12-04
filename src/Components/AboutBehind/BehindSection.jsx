"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";



const BehindSection = ({
  BehindTLRef,
  BehindImgRef,
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
        isMobile ? "h-[100vh]" : "h-[90vh]"
      } flex justify-center items-center 
      bg-gradient-to-bl to-[#000000]
         from-[#0a212b]
       text-white relative  overflow-hidden`}
    >
      <div
        ref={BehindTLRef}
        className={`absolute subtitle behind-text top-[20%] right-[2%] sm:right-[1%] 
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
        top-[10%] brightness-[0.7] w-[230px] sm:w-[400px] md:w-[500px] max-sm:left-13`}
      />

    </section>
  );
};

export default BehindSection;
