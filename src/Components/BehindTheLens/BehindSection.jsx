"use client";
import Image from "next/image";
import React, { useRef } from "react";

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
  return (
    <section
      id="second-section"
      className="h-[200vh] flex justify-center items-center 
      bg-gradient-to-bl to-[#000000] from-[#0a212b] text-white relative"
    >
      <div
        ref={BehindTLRef}
        className="absolute subtitle behind-text  top-[10%] right-[1%] max-w-lg text-left"
      >
        <h2 className="behind-title text-5xl font-bold mb-4 text-gradient ">
          The Man Behind the Scene
        </h2>

        <div className="relative">
          <div
            className="original text-lg text-[#9ca3af] leading-relaxed"
            ref={tRef}
          >
            Meet Abbas — a storyteller whose lens reveals emotion beyond frames.
            Every image he captures is a glimpse into the unseen beauty that
            defines human connection.
          </div>

          <div
            ref={typingRef}
            className="typingOverlay pointer-events-none absolute inset-0 text-lg text-[#9ca3af] leading-relaxed"
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
        className=" object-contain absolute inset-0 opacity-0   left-[5.72%] top-[5.7%] brightness-[0.7]  "
        priority
      />
      

      <div
        className="flex flex-col justify-center items-center end-24 opacity-65 absolute top-[30%] "
        ref={BehindCardRef}
      >
        {IMAGES.map((image, index) => (
          <div
            key={index}
            className=" mx-4 relative inline-block my-2 w-50  "
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={200}
              height={200}
              className="object-cover object-center rounded-lg shadow-lg h-40 "
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BehindSection;
