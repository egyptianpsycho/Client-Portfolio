"use client"
import Image from "next/image";
import React, { useRef } from "react";

const IMAGES = [
  { src: "/Ahmed/Ahmed2.jpg", alt: "Ahmed" },
  { src: "/Ahmed/Ahmed2.jpg", alt: "Ahmed" },
  { src: "/Ahmed/Ahmed2.jpg", alt: "Ahmed" },
]
const BehindSection = ({ BehindTLRef,BehindImgRef }) => {
  return (
    <section
      id="second-section"
      className="h-[200vh] flex justify-center items-center 
      bg-gradient-to-bl to-[#000000] from-[#0a212b] text-white relative"
    >
      <div
        ref={BehindTLRef}
        className="absolute subtitle behind-text  top-[-20%] right-[1%] max-w-lg text-left"
      >
        <h2 className=" text-5xl font-bold mb-4 text-gradient">
          The Man Behind the Scene
        </h2>
        <p className="text-lg text-[#9ca3af] leading-relaxed">
          Meet Abbas — a storyteller whose lens reveals emotion beyond frames.
          Every image he captures is a glimpse into the unseen beauty that
          defines human connection.
        </p>
      </div>
      <Image
      ref={BehindImgRef}
        src="/Ahmed/Ahmed2.jpg"
        alt="Hero 2"
        width={500}
        height={500}
        className=" object-contain absolute inset-0 opacity-0   left-[5.72%] top-[-27.7%] brightness-[0.7]  "
        priority
      />
      <div className="flex flex-col justify-center items-center end-0 opacity-65 absolute ">
        {
          IMAGES.map((image,index) => (
            <div key={index} className=" m-4 relative inline-block">
              <Image
                src={image.src}
                alt={image.alt}
                width={200}
                height={200}
                className="object-cover object-center rounded-lg shadow-lg"
              />
            </div>
          ))
        }
      </div>
    </section>
  );
};

export default BehindSection;
