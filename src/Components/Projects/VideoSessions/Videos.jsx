"use client";
import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./Videos.css";
import { PROJECTSVIDS } from "../CONSTANTS";
import VideoPlayer from "@/Components/UI/VideoPlayer";
gsap.registerPlugin(ScrollTrigger, SplitText);

const Videos = () => {
  const vidSecRef = useRef(null);
  useEffect(() => {
    const init = () => {
      const ctx = gsap.context(() => {
        const vidsBoxes = gsap.utils.toArray(".video-item");

        gsap.from(vidsBoxes, {
          opacity: 0,
          y: 100,
          duration: 1,
          filter: "blur(10px)",
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: vidSecRef.current,
            scroller: "[data-scroll-container]",
            start: "top 50%",
            end: "bottom 20%",
          },
        });
      });

      ScrollTrigger.refresh();
      return () => ctx.revert();
    };

    const wait = setInterval(() => {
      if (window.__loco) {
        clearInterval(wait);
        init();
      }
    }, 100);

    return () => clearInterval(wait);
  }, []);
  return (
    <div id="videos-section" className="relative min-h-screen mt-20 " ref={vidSecRef}>
      <h1
        className="text-9xl max-sm:text-4xl mb-10 text-center   videos-title font-bold  text-gradient "
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%) ",
          fontFamily: " 'Bebas Neue', 'serif' ",
          letterSpacing: "0.4rem",
        }}
      >
        VISION IN MOTION
      </h1>
      <div className="parent-video mx-auto  h-[90vh]  ">
        {PROJECTSVIDS.map((project, index) => (
          <div
            key={index}
            className={`video-item overflow-hidden relative div${
              index + 1
            }-video cursor-pointer group rounded-2xl  `}
          >
            <VideoPlayer
              poster={project.thummnail}
              src={project.videoURL}
              classN="object-cover rounded-2xl scale-[0.99] h-full  origin-center grayscale-75  transition-all duration-500 ease-out  group-hover:grayscale-0 group-hover:scale-105 "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out  pointer-events-none group-hover:pointer-events-none  " />

            {/* title on the bottom */}
            <div className="absolute bottom-10 max-sm:bottom-8 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none group-hover:pointer-events-none">
              <h3 className="text-white/80 text-xl font-semibold tracking-wide text-gradient  max-sm:text-lg ">
                {project.title}
              </h3>
            </div>

            {/* duration */}
            <div className="absolute bottom-2 left-4    opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none group-hover:pointer-events-none">
              <h3 className="text-gray-200/20 text-sm font-semibold  ">
                {project.durtaion}
              </h3>
            </div>
            <div className="blur-2xl opacity-10  scale-200 bg-slate-500/10 absolute inset-0 pointer-events-none group-hover:pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
