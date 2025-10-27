"use client";
import React, { useEffect } from "react";
import "./Services.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowingMenu from "../UI/FlowingMenu";
import SplitText from "gsap/SplitText";
import ShinyText from "../UI/ShinyText";
gsap.registerPlugin(ScrollTrigger, SplitText);

const demoItems = [
  {
    link: "#",
    text: "Photography",
    image: "/Projects/images/Adidas/Adidas.jpg",
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
        //zoom animation
        gsap
          .timeline({
            scrollTrigger: {
              scroller: "[data-scroll-container]",
              trigger: ".zoom",
              scrub: true,
              start: "top top",
              end: "+=1000%",
              pin: true,
            },
          })
          .to(
            ".zoom-circle",
            {
              scale: 12,
            },
            "sameTime"
          )
          .to(
            ".zoom-content",
            {
              scale: 1,
            },
            "sameTime"
          );

          // title animation

          const zoomTitle = new SplitText(".zoom-heading", { type: "chars" });
          const zoomParagraph = new SplitText(".zoom-content", { type: "words" });

          zoomTitle.chars.forEach((char) =>
            char.classList.add("zoom-heading")
          );
          zoomParagraph.words.forEach((word) =>
            word.classList.add("zoom-content-gradient")
          );
          

         
  
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
    <>
      <div className="mb-400" id="Services">
        <div className="zoom-container ">
          <div className="zoom">
            <h2 className="zoom-heading">SERVICES</h2>
            <div className="zoom-circle"></div>
            <h3 className="zoom-content">LUXURIOUS AUTHENTIC DISTINCTIVE</h3>

          </div>
        </div>
      </div>
      <div
        style={{ height: "600px", position: "relative",    }}
        className=" bg-black"
      >
        <FlowingMenu items={demoItems} />
      </div>
    </>
  );
};

export default ServicesMain;
