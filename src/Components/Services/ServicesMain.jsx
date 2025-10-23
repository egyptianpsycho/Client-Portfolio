"use client";
import React, { useEffect } from 'react'
import './Services.css'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const ServicesMain = () => {

  useEffect(() => {
    const init = () => {
      const ctx = gsap.context(() => {
        gsap.timeline({
          scrollTrigger: {
            scroller: "[data-scroll-container]",
            trigger: ".zoom",
            scrub: true,
            start: "top top",
            end: "+=1000%",
            pin: true,
          }
        })
        .to(".zoom-circle", {
          scale: 12
        }, "sameTime")
        .to(".zoom-content", {
          scale: 1 
        }, "sameTime");
        
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
    <div className="zoom-container mb-600">
  <div className="zoom">
      <h2 className="zoom-heading">hello</h2>
      <div className="zoom-circle"></div>
      <h3 className="zoom-content">Hello .. world</h3>
    <div className="footer">
      <p className="footer-content"></p>
  <a className="footer-content link" href="https://twitter.com/juxtopposed" target="_blank"><span className="link-text"  data-text="Let's connect">Let's connect</span></a>
    </div>
  </div>
</div>
  )
}

export default ServicesMain


