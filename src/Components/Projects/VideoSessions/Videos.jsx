"use client";
import React, { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./Videos.css";
import { PROJECTSVIDS } from "../CONSTANTS";
import VideoPlayer from "@/Components/UI/VideoPlayer";
import useAnimate from "@/Hooks/useAnimate";
gsap.registerPlugin(ScrollTrigger, SplitText);

const Videos = () => {
  const vidSecRef = useRef(null);
  useAnimate(() => {
    if (window.innerWidth > 768) { 
        const vidsBoxes = gsap.utils.toArray(".video-item");
        const vidTitle = new SplitText(".vid-title", { type: "chars" });

        vidTitle.chars.forEach((char) => char.classList.add("text-gradient"));

    

    // Animate the title
    gsap.from(vidTitle.chars, {
      opacity: 0,
      duration: 2,
      ease: "expo.out",
      stagger: 0.1,
      filter: "blur(15px)",
      y: 50,
      scrollTrigger: {
        trigger: "#videos-section",
        scroller: "[data-scroll-container]",
        start: "top bottom-=30%",
        toggleActions: "play none none reverse",
      },
    });

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
    }
  });
  return (
    <div id="videos-section" className="relative max-sm:min-h-[130vh] min-h-[120vh] mt-20  " ref={vidSecRef}>
      <h1
        className="text-9xl max-sm:text-4xl mb-10 lg:leading-[12rem] text-center glowy-text   videos-title vid-title font-bold  text-gradient "
        style={{
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
