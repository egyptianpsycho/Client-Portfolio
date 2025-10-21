"use client";
import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Glow from "../../UI/Glow";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PROJECTS } from "./CONSTANTS";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText);


const Main = () => {
  useEffect(() => {
    const init = () => {
      const ctx = gsap.context(() => {
        const behindTitle2 = new SplitText(".behind-title2", { type: "chars" });

        behindTitle2.chars.forEach((char) =>
          char.classList.add("text-gradient")
        );
        gsap.from(behindTitle2.chars, {
          opacity: 0,
          duration: 2,
          ease: "expo.out",
          stagger: 0.1,
          filter: "blur(30px)",
          y: 50,
          scrollTrigger: {
            trigger: "#Projects",
            scroller: "[data-scroll-container]",
            start: "top bottom-=23%",
            toggleActions: "play none none reverse",
          },
        });

        // gsap.to(behindTitle2.chars,{
        //   y:0,
        //   stagger:0.06,
        //   delay:0.2,
        //   duration:.1,
        // })
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
    <section className="relative h-[220vh]  p-20 " id="Projects">
      <div>
        <div className=" z-100 text-center ">
          <h1
            className="text-9xl mb-5  behind-title2 font-bold  text-gradient "
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%) ",
              lineHeight: "12rem",
              fontFamily: " 'Bebas Neue', 'serif' ",
              letterSpacing: '0.7rem'
            }}
          >
            PROJECTS
          </h1>
        </div>
      </div>{" "}
      <div className="mx-auto parent h-[90vh]   top-60 relative ">
{
  PROJECTS.map((project,index) => (
    <div key={index} className={`div${index + 1} `}>
      <Image src={project.cover}
      alt={project.alt}
      fill className="object-cover rounded-2xl scale-[1]  origin-center"
      style={{ objectPosition: "50% 20%" }} />
      <div className="blur-2xl opacity-40 scale-200 bg-slate-500 absolute inset-0" />
    </div>
  ))
}
      </div>
    </section>
  );
};

export default Main;
