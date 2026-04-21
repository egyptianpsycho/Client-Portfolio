"use client";
import React, { useRef, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useAnimate(() => {
    if (window.innerWidth > 768) {
      const vidsBoxes = gsap.utils.toArray(".video-item");
      const vidTitle = new SplitText(".vid-title", { type: "chars" });

      vidTitle.chars.forEach((char) => char.classList.add("text-gradient"));

      gsap.set(vidTitle.elements[0], { willChange: "transform, filter" });
      gsap.from(vidTitle.chars, {
        opacity: 0,
        duration: 2,
        ease: "expo.out",
        stagger: 0.1,
        filter: "blur(15px)",
        y: 50,
        onComplete: () => gsap.set(vidTitle, { willChange: "auto" }),
        scrollTrigger: {
          trigger: "#videos-section",
          scroller: "[data-scroll-container]",
          start: "top bottom-=30%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set(vidSecRef.current, { willChange: "transform, filter" });
      gsap.from(vidsBoxes, {
        opacity: 0,
        y: 100,
        duration: 1,
        filter: "blur(10px)",
        ease: "power2.out",
        onComplete: () => gsap.set(vidSecRef.current, { willChange: "auto" }),
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
    <div id="videos-section" className="relative mt-20" ref={vidSecRef}>
      <h1
        className="text-9xl max-sm:text-4xl mb-10 lg:leading-[11rem] text-center glowy-text videos-title vid-title font-bold text-gradient text-nowrap"
        style={{
          fontFamily: "'Bebas Neue', 'serif'",
          letterSpacing: "0.4rem",
        }}
      >
        VISION IN <br className="sm:hidden" /> MOTION
      </h1>

      {isMobile ? (
        /* ── Mobile: full-width 2-column grid, all videos ── */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2px",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {PROJECTSVIDS.map((project, index) => (
            <div
              key={index}
              className="video-item cursor-pointer group"
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                backgroundColor: "#111",
              }}
            >
              <VideoPlayer
                poster={project.thummnail}
                src={project.videoURL}
                classN="object-cover h-full w-full  transition-all duration-500 ease-out "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none" />
              <div className="absolute bottom-2 left-0 w-full px-2 text-center opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none">
                <p className="text-white/90 text-[0.65rem] font-semibold tracking-wide leading-tight truncate">
                  {project.title}
                </p>
              </div>
              <div className="absolute top-2 right-2 pointer-events-none">
                <span className="text-white/50 text-[0.55rem] font-semibold">
                  {project.durtaion}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Desktop: original layout unchanged ── */
        <div className="parent-video mx-auto h-[270vh]">
          {PROJECTSVIDS.map((project, index) => (
            <div
              key={index}
              className={`video-item overflow-hidden relative div${index + 1}-video cursor-pointer group rounded-2xl`}
            >
              <VideoPlayer
                poster={project.thummnail}
                src={project.videoURL}
                classN="object-cover rounded-2xl scale-[0.99] h-full origin-center  transition-all duration-500 ease-out  group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none" />
              <div className="absolute bottom-10 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none">
                <h3 className="text-white/80 text-xl font-semibold tracking-wide text-gradient">
                  {project.title}
                </h3>
              </div>
              <div className="absolute bottom-2 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none">
                <h3 className="text-gray-200/20 text-sm font-semibold">
                  {project.durtaion}
                </h3>
              </div>
              <div className="opacity-10 scale-200 bg-slate-500/10 absolute inset-0 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Videos;
