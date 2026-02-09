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
  ) => {
  useEffect(() => {
    if (
      !sectionRef?.current ||
      !imageContainerRef?.current 
    ) {
      return;
    }

    const init = () => {
      const ctx = gsap.context(() => {
        const isMobile = window.innerWidth < 500;
        const isTablet = window.innerWidth >= 500 && window.innerWidth < 768;
        const isMediumDesktop = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isLargeDesktop = window.innerWidth >= 1024 && window.innerWidth < 1700;
        const isXLDesktop = window.innerWidth >= 1700;

        // Responsive x-offset calculation
        const getXOffset = () => {
          if (isMobile) return 0;
          if (isTablet) return -50;
          if (isMediumDesktop) return -150;
          if (isLargeDesktop) return -320;
          if (isXLDesktop) return -600;
          return -100;
        };

        const xOffset = getXOffset();

        const heroSplit = new SplitText(".title", { type: "chars" });
        heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));  

        // Title scroll fade out
        gsap.to(textRef.current, {
          y: -200,
          opacity: 0,
          filter: "blur(20px)",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top top-=5%",
            end: "bottom center",
            scrub: true,
          },
        });

        // Split text reveal
        gsap.from(heroSplit.chars, {
          opacity: 0,
          yPercent: 100,
          duration: 1.4,
          filter: "blur(30px)",
          ease: "expo.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: "[data-scroll-container]",
            start: "top 87%",
            toggleActions: "play none none reverse",
          },
        });

        

        // Parallax + scale
        gsap.to(imageContainerRef.current, {
          scale: 0.8,
          y: -287,
          clipPath: "inset(5% 5% 5% 5% round 5px)",
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

        // status animation

        const statsTrigger = document.querySelector(".sts-sc");
          if (statsTrigger) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: ".sts-sc",
                scroller: "[data-scroll-container]",
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            });

            tl.from(".stat-card", {
              opacity: 0,
              x: 30,
              filter: "blur(12px)",
              stagger: 0.3,
              duration: 0.8,
              ease: "power2.out",
            });

            tl.fromTo(
              ".stat-number",
              { textContent: 0 },
              {
                textContent: (_, target) => target.getAttribute("data-value"),
                duration: 2,
                ease: "power1.out",
                snap: { textContent: 1 },
              },
              "-=0.8"
            );
          }

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
  }, [sectionRef, imageContainerRef, textRef]);
};

export default useBTLAnimations;
