"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useBTLAnimations = (
  BehindTLRef,
  BehindImgRef,
  
) => {
  useEffect(() => {
    if (
      !BehindTLRef?.current ||
      !BehindImgRef?.current 
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

       

        const behindTitle = new SplitText(".behind-title", { type: "words" });
        const paragraphSplit = new SplitText(".original", { type: "lines" });

        behindTitle.words.forEach((char) =>
          char.classList.add("text-gradient")
        );

        

        // Title animation - improved start position
        gsap.from(behindTitle.words, {
          opacity: 0,
          duration: 2,
          ease: "power3.out",
          stagger: 0.08,
          filter: "blur(20px)",
          y: 30,
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top 60%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        });

        // Behind The Scene text lines animation - improved timing
        gsap.from(paragraphSplit.lines, {
          opacity: 0,
          yPercent: 80,
          color: "#0a212b",
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top 60%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        });

        // Behind the scene pinning animation (not on mobile)
        if (!isMobile) {

          gsap.to(BehindImgRef.current, {
            opacity: 0.8,
            duration: 0.6,
            scrollTrigger: {
              trigger: BehindImgRef.current,
              scroller: "[data-scroll-container]",
              start: "top 30%",
              toggleActions: "play none none reverse",
            },
          });
        }


        // Stats animation - improved timing
        const statsTrigger = document.querySelector(".sts-sc");
        if (statsTrigger) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".sts-sc",
              scroller: "[data-scroll-container]",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });

          tl.from(".stat-card", {
            opacity: 0,
            x: 30,
            filter: "blur(12px)",
            stagger: 0.3,
            duration: 1.2,
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
  }, [BehindTLRef, BehindImgRef]);
};

export default useBTLAnimations;