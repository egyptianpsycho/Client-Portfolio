import React from "react";
import Image from "next/image";

const HeroSection = ({ sectionRef, imageContainerRef, textRef }) => {
  return (
    <section
      ref={sectionRef}
      className="h-[100vh]  relative bg-gradient-to-tl to-[#000000] from-[#0a212b]"
    >
      <div className="sticky top-0 h-screen w-full mt-48">
        <div
          ref={imageContainerRef}
          className="relative w-full h-full z-[5]"
          style={{ transform: "scale(1.4)", filter: "brightness(0.7)" }}
        >
          <Image
            src="/HeroImages/Horse2.webp"
            alt="Hero 1"
            fill
            className="img1 object-cover absolute object-center opacity-65 transition-opacity duration-700"
            priority
          />
          <Image
            src="/Ahmed/Ahmed2.jpg"
            alt="Hero 2"
            fill
            className="img2 object-contain sticky  object-center opacity-0 transition-opacity duration-700"
            priority
          />
        </div>

        <div
          ref={textRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              text-white text-7xl font-bold text-center z-10 mix-blend-color"
        >
          <h1 className="title">NOT JUST A PHOTOGRAPHER</h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
