"use client";
import React, { useEffect } from "react";
import "./Services.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowingMenu from "../UI/FlowingMenu";
import SplitText from "gsap/SplitText";

const demoItems = [
  {
    link: "#",
    text: "Photography",
    image: "/Projects/images/WHITE/White.png",
  },
  {
    link: "#",
    text: "Commercial",
    image: "/Projects/images/PORSCHE/PORSCHE.jpg",
  },
  {
    link: "#",
    text: "Portraits",
    image: "/Projects/images/Disconected/disconected.jpg",
  },
  {
    link: "#",
    text: "jewelers",
    image: "/Services/jewlerys.jpg",
  },
  {
    link: "#",
    text: "Hotels",
    image: "/Projects/images/TALISE/TALISE9.webp",
  },
];

const ServicesMain = () => {
  useEffect(() => {
    const init = () => {
      const ctx = gsap.context(() => {
        const zoomTitle = new SplitText(".zoom-heading", { type: "chars" });
        const zoomParagraph = new SplitText(".zoom-content", { type: "words" });

        zoomTitle.chars.forEach((char) => char.classList.add("zoom-heading"));
        zoomParagraph.words.forEach((word) =>
          word.classList.add("zoom-content-gradient")
        );

        //zoom animation
        // gsap
        //   .timeline({
        //     scrollTrigger: {
        //       scroller: "[data-scroll-container]",
        //       trigger: ".zoom",
        //       scrub: true,
        //       start: "top top",
        //       end: "+=1000%",
        //       pin: true,
        //     },
        //   })
          gsap
        .timeline({
          scrollTrigger: {
            scroller: "[data-scroll-container]",
            trigger: ".zoom",
            scrub: true,
            start: "top top",
            end: "+=250%", // REDUCE THIS - try 300% instead of 1000%
            pin: true,
            anticipatePin: 1, // ADD THIS for smoother pinning
            invalidateOnRefresh: true, // ADD THIS
            preventOverlaps: true,
            
          },
        })
          .to(
            ".zoom-circle",
            {
              scale: 12,
              duration: 10, // Add duration
    ease: "power1.inOut",
            },
            "sameTime"
          )
          .to(
            ".zoom-content",
            {
              scale: 1,
              duration: 10, // Add duration
    ease: "power1.inOut",
            },
            "sameTime"
          );

        // title animation
        gsap.from(zoomTitle.chars, {
          opacity: 0,
          duration: 2,
          ease: "expo.out",
          stagger: 0.1,
          filter: "blur(30px)",
          y: 50,
          scrollTrigger: {
            trigger: "#Services",
            scroller: "[data-scroll-container]",
            start: "top bottom-=60%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(zoomParagraph.words, {
          opacity: 0,
          duration: 2,
          ease: "expo.out",
          stagger: 0.4,
          filter: "blur(20px)",
          y: 50,
          scrollTrigger: {
            trigger: "#Services",
            scroller: "[data-scroll-container]",
            start: "top bottom-=85%",
            toggleActions: "play none none reverse",
          },
        });
        // Cleanup function - IMPORTANT!
        return () => {
          zoomTitle.revert();
          zoomParagraph.revert();
        };
      });

      ScrollTrigger.refresh();

      return () => {
        ctx.revert(); // This kills all ScrollTriggers
      };
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
    <div className=" ">
      <div className="mb-400" id="Services">
        <div className="zoom-container ">
          <div className="zoom">
            <h2 className="zoom-heading max-sm:mt-8 " >SERVICES</h2>
            <div className="zoom-circle"></div>
            <h3 className="zoom-content">LUXURIOUS AUTHENTIC DISTINCTIVE</h3>
          </div>
        </div>
      </div>
      <div
        style={{ height: "600px", position: "relative" }}
        className=" bg-black"
      >
        <FlowingMenu items={demoItems} />
      </div>
    </div>
  );
};

export default ServicesMain;
