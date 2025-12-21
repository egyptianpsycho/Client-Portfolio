"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText);

const useBTLAnimations = (BehindTLRef, BehindImgRef) => {
  useEffect(() => {
    if (!BehindTLRef?.current || !BehindImgRef?.current) {
      return;
    }

    const init = () => {
      const ctx = gsap.context(() => {
        try {
          const behindTitle = new SplitText(".behind-title", { type: "words" });
          const paragraphSplit = new SplitText(".original", { type: "lines" });

          behindTitle.words.forEach((char) =>
            char.classList.add("text-gradient")
          );
          const path = document.querySelector("#pathToAnimate3");
          if (!path) return;
          const le = path.getTotalLength();

          gsap.set(path, {
            strokeDasharray: le,
            strokeDashoffset: le,
            visibility: "visible",
          });

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#pathToAnimate3",
              start: "top 100%",
              end: "bottom center",
              scrub: 2,
              scroller: "[data-scroll-container]",
            },
          });
          // Title animation
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

          // Paragraph animation
          gsap.from(paragraphSplit.lines, {
            opacity: 0,
            yPercent: 80,
            duration: 1.2,
            ease: "power2.out",
            filter: "blur(12px)",
            stagger: 0.4,
            scrollTrigger: {
              trigger: BehindTLRef.current,
              scroller: "[data-scroll-container]",
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          });

          // Stats animation
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
        } catch (e) {
          console.warn("Animation setup failed:", e);
        }
      });

      try {
        ScrollTrigger.refresh();
      } catch (e) {
        console.warn("ScrollTrigger refresh failed:", e);
      }

      return () => {
        try {
          ctx.revert();
        } catch (e) {
          console.warn("Context revert failed:", e);
        }
      };
    };

    let wait;
    let attemptCount = 0;
    const maxAttempts = 50; // 5 seconds max

    const checkAndInit = () => {
      attemptCount++;

      if (window.__loco && window.__loco.scroll) {
        clearInterval(wait);
        // Extra delay for route changes
        setTimeout(init, 200);
      } else if (attemptCount >= maxAttempts) {
        clearInterval(wait);
        console.warn("Locomotive Scroll not ready, skipping animations");
      }
    };

    wait = setInterval(checkAndInit, 100);

    return () => {
      if (wait) clearInterval(wait);
    };
  }, [BehindTLRef, BehindImgRef]);
};

export default useBTLAnimations;
