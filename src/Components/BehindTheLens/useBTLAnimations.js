"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useBTLAnimations = (
  sectionRef,
  imageContainerRef,
  textRef,
  BehindTLRef,
  BehindImgRef
) => {
  useEffect(() => {
    const img1 = imageContainerRef.current.querySelector(".img1");
    const img2 = imageContainerRef.current.querySelector(".img2");

    const fadeImages = (showSecond) => {
      if (showSecond) {
        gsap.to(img1, { opacity: 0, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 1, duration: 0.8, ease: "power1.out" });
      } else {
        gsap.to(img1, { opacity: 0.65, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 0, duration: 0.8, ease: "power1.out" });
      }
    };

    const init = () => {
      const ctx = gsap.context(() => {
        const heroSplit = new SplitText(".title", { type: "chars, words" });
        const paragraphSplit = new SplitText(".subtitle", { type: "lines" });
        heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

        // Title scroll fade out
        gsap.to(textRef.current, {
          y: -200,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom center",
            scrub: true,
          },
        });

        // Split text reveal
        gsap.from(heroSplit.chars, {
          opacity: 0,
          yPercent: 100,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // Parallax + scale
        gsap.to(imageContainerRef.current, {
          scale: 0.5,
          y: -100,
          top: "30%",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Fade image when reaching section two
        ScrollTrigger.create({
          trigger: "#second-section",
          scroller: "[data-scroll-container]",
          start: "top bottom+=30%",
          onEnter: () => fadeImages(true),
          onLeaveBack: () => fadeImages(false),
        });

        // Second image scroll-in from right to left
        gsap.to(img2, {
          x: -1200,
          scrollTrigger: {
            trigger: img2,
            scroller: "[data-scroll-container]",
            start: "bottom center-=45%",
            end: "bottom+=10% top",
            scrub: 3,
            ease: "power2.inOut",
          },
        });
        gsap.to(img2, {
          opacity: 0,
          scrollTrigger: {
            trigger: img2,
            scroller: "[data-scroll-container]",
            start: "bottom top-=20%",
            end: "bottom bottom",
            scrub: true,
            ease: "power2.inOut",
          },
        });

        gsap.from(paragraphSplit.lines, {
          opacity: 0,
          yPercent: 100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.06,
          delay: 0.4,
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top 40%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.to(BehindTLRef.current, {
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top center-=30%",
            end: "bottom top",
            scrub: true,
            pin: true,
            ease: "power2.inOut",
          },
        });
        gsap.to(BehindTLRef.current, {
          x: -600,
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top center-=30%",
            end: "bottom top",
            scrub: true,
            // pin: true,
            ease: "power2.inOut",
          },
        });

        gsap.to(BehindImgRef.current, {
          scrollTrigger: {
            trigger: BehindImgRef.current,
            scroller: "[data-scroll-container]",
            start: "top top+=5%",
            end: "bottom top",
            scrub: true,
            pin: true,
            ease: "power2.inOut",
          },
        });
        gsap.to(BehindImgRef.current, {
          opacity: 0.65, 
          scrollTrigger: {
            trigger: BehindImgRef.current,
            scroller: "[data-scroll-container]",
            start: "top top+=5%",
          },
        });
        gsap.to(BehindImgRef.current, {
          opacity: 0, 
          scrollTrigger: {
            trigger: BehindImgRef.current,
            scroller: "[data-scroll-container]",
            start: "bottom+=700% top+=700%", // adjust to your needs
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
};

export default useBTLAnimations;
