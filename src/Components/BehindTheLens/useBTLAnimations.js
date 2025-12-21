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
  }, [sectionRef, imageContainerRef, textRef]);
};

export default useBTLAnimations;
// "use client";
// import { useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from "gsap/all";

// gsap.registerPlugin(ScrollTrigger, SplitText);

// const useBTLAnimations = (
//   sectionRef,
//   imageContainerRef,
//   textRef,
//   BehindTLRef,
//   BehindImgRef,
//   BehindCardRef,
//   tRef,
//   typingRef
// ) => {
//   useEffect(() => {
//     if (
//       !sectionRef?.current ||
//       !imageContainerRef?.current ||
//       !BehindTLRef?.current ||
//       !BehindImgRef?.current ||
//       !BehindCardRef?.current ||
//       !tRef?.current ||
//       !typingRef?.current
//     ) {
//       return;
//     }

//     const init = () => {
//       const ctx = gsap.context(() => {
//         const isMobile = window.innerWidth < 500;
//         const isTablet = window.innerWidth >= 500 && window.innerWidth < 768;
//         const isMediumDesktop = window.innerWidth >= 768 && window.innerWidth < 1024;
//         const isLargeDesktop = window.innerWidth >= 1024 && window.innerWidth < 1700;
//         const isXLDesktop = window.innerWidth >= 1700;

//         // Responsive x-offset calculation
//         const getXOffset = () => {
//           if (isMobile) return 0;
//           if (isTablet) return -50;
//           if (isMediumDesktop) return -150;
//           if (isLargeDesktop) return -320;
//           if (isXLDesktop) return -600;
//           return -100;
//         };

//         const xOffset = getXOffset();

//         const originalText = tRef.current
//           ? tRef.current.textContent.trim()
//           : "";

//         const heroSplit = new SplitText(".title", { type: "chars, words" });
//         const behindTitle = new SplitText(".behind-title", { type: "words" });
//         const paragraphSplit = new SplitText(".original", { type: "lines" });

//         const cards = BehindCardRef.current.querySelectorAll("img");

//         heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));
//         behindTitle.words.forEach((char) =>
//           char.classList.add("text-gradient")
//         );

//         if (!isMobile) {
//           // Typing/erase helpers
//           const overlay = typingRef.current;
//           overlay.innerHTML = "";
//           overlay.style.opacity = 0;
//           overlay.style.visibility = "hidden";

//           const eraseOverlayFrom = (fullText, speed = 18) => {
//             return new Promise((resolve) => {
//               overlay.innerText = fullText;
//               let i = fullText.length;
//               const id = setInterval(() => {
//                 i--;
//                 overlay.innerText = fullText.substring(0, Math.max(0, i));
//                 if (i <= 0) {
//                   clearInterval(id);
//                   overlay.innerHTML = "";
//                   resolve();
//                 }
//               }, speed);
//             });
//           };

//           const typeInto = (el, text, speed = 36) => {
//             return new Promise((resolve) => {
//               el.innerHTML = "";
//               let i = 0;
//               const id = setInterval(() => {
//                 i++;
//                 el.textContent = text.substring(0, i);
//                 if (i >= text.length) {
//                   clearInterval(id);
//                   resolve();
//                 }
//               }, speed);
//             });
//           };

//           const achievements = [
//             "-DUBAI",
//             "-NEW YORK",
//             "-SWITZERLAND",
//             "-DENMARK",
//             "-ICELAND",
//             "-LONDON",
//             "-SAUDI ARABIA",
//             "-BAHRAIN",
//             "-EGYPT",
//             "AND MORE...",
//           ];

//           let fired = false;

//           if (cards && cards.length > 0) {
//             ScrollTrigger.create({
//               trigger: cards[0],
//               scroller: "[data-scroll-container]",
//               start: "top top-=45%",
//               once: true,
//               onEnter: async () => {
//                 if (fired) return;
//                 fired = true;
//                 overlay.style.opacity = 1;
//                 overlay.style.visibility = "visible";

//                 if (
//                   paragraphSplit &&
//                   paragraphSplit.lines &&
//                   paragraphSplit.lines.length
//                 ) {
//                   paragraphSplit.lines.forEach((ln) => {
//                     ln.style.display = "none";
//                   });
//                 }

//                 try {
//                   tRef.current.style.display = "none";
//                 } catch (e) {}

//                 await eraseOverlayFrom(originalText || "");

//                 const titleEl = document.createElement("div");
//                 titleEl.className =
//                   "achievement-title text-lg text-white/70 font-semibold tracking-wide";
//                 overlay.appendChild(titleEl);

//                 await typeInto(titleEl, "Around The World", 40);
//                 await new Promise((r) => setTimeout(r, 340));

//                 const achContainer = document.createElement("div");
//                 achContainer.className =
//                   "achievements-container text-sm text-[#9ca3af]";
//                 overlay.appendChild(achContainer);

//                 for (let i = 0; i < achievements.length; i++) {
//                   const line = document.createElement("div");
//                   line.className = `achievement-line achievement-line-${i + 1}`;
//                   achContainer.appendChild(line);
//                   await typeInto(line, achievements[i], 32);
//                 }
//               },
//             });
//           }
//         }

//         // Title scroll fade out
//         gsap.to(textRef.current, {
//           y: -200,
//           opacity: 0,
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             scroller: "[data-scroll-container]",
//             start: "top top",
//             end: "bottom center",
//             scrub: true,
//           },
//         });

//         // Split text reveal
//         gsap.from(heroSplit.chars, {
//           opacity: 0,
//           yPercent: 100,
//           duration: 1.4,
//           ease: "expo.out",
//           stagger: 0.05,
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             scroller: "[data-scroll-container]",
//             start: "top 80%",
//             toggleActions: "play none none reverse",
//           },
//         });

//         gsap.from(behindTitle.words, {
//           opacity: 0,
//           duration: 4,
//           ease: "expo.out",
//           stagger: 0.1,
//           filter: "blur(30px)",
//           y: 50,
//           scrollTrigger: {
//             trigger: BehindTLRef.current,
//             scroller: "[data-scroll-container]",
//             start: "top -20%",
//             toggleActions: "play none none reverse",
//           },
//         });

//         // Parallax + scale
//         gsap.to(imageContainerRef.current, {
//           scale: 0.7,
//           y: -287,
//           clipPath: "inset(5% 5% 5% 5% round 5px)",
//           top: "30%",
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             scroller: "[data-scroll-container]",
//             start: "top top",
//             end: "bottom top",
//             pin: true,
//             scrub: 1,
//             anticipatePin: 1,
//           },
//         });

//         // Behind The Scene text lines animation
//         gsap.from(paragraphSplit.lines, {
//           opacity: 0,
//           yPercent: 100,
//           color: "#0a212b",
//           duration: 1.8,
//           ease: "expo.out",
//           stagger: 0.06,
//           delay: 0.4,
//           scrollTrigger: {
//             trigger: BehindTLRef.current,
//             scroller: "[data-scroll-container]",
//             start: "top 57%",
//             toggleActions: "play none none reverse",
//           },
//         });

//         // Behind the scene pinning animation (not on mobile)
//         if (!isMobile) {
//           gsap.to(BehindTLRef.current, {
//             scrollTrigger: {
//               trigger: BehindTLRef.current,
//               scroller: "[data-scroll-container]",
//               start: "top center-=30%",
//               end: "bottom top-=65%",
//               scrub: true,
//               pin: true,
//               ease: "power2.inOut",
//             },
//           });

//           // Responsive title animation
//           gsap.to(behindTitle.words, {
//             x: xOffset,
//             duration: 1.8,
//             ease: "power3.inOut",
//             stagger: {
//               each: 0.25,
//               ease: "power2.inOut",
//             },
//             scrollTrigger: {
//               trigger: BehindTLRef.current,
//               scroller: "[data-scroll-container]",
//               start: "top center-=30%",
//               end: "bottom top+=20%",
//               scrub: 1,
//             },
//           });

//           // Responsive lines animation
//           gsap.to(paragraphSplit.lines, {
//             x: xOffset,
//             duration: 1.8,
//             ease: "power3.inOut",
//             stagger: {
//               each: 0.25,
//               ease: "power2.inOut",
//             },
//             scrollTrigger: {
//               trigger: BehindTLRef.current,
//               scroller: "[data-scroll-container]",
//               start: "top center-=30%",
//               end: "bottom top+=20%",
//               scrub: 1,
//             },
//           });

//           // Responsive typing overlay animation
//           gsap.to(typingRef.current, {
//             x: xOffset,
//             duration: 1.8,
//             ease: "power3.inOut",
//             stagger: {
//               each: 0.25,
//               ease: "power2.inOut",
//             },
//             scrollTrigger: {
//               trigger: BehindTLRef.current,
//               scroller: "[data-scroll-container]",
//               start: "top center-=30%",
//               end: "bottom top+=20%",
//               scrub: 1,
//             },
//           });

//           // Behind The Scene Image animation
//           gsap.to(BehindImgRef.current, {
//             scrollTrigger: {
//               trigger: BehindImgRef.current,
//               scroller: "[data-scroll-container]",
//               start: "top top+=5%",
//               end: "bottom top-=40%",
//               scrub: true,
//               pin: true,
//               ease: "power2.inOut",
//             },
//           });

//           gsap.to(BehindImgRef.current, {
//             opacity: 0.8,
//             scrollTrigger: {
//               trigger: BehindImgRef.current,
//               scroller: "[data-scroll-container]",
//               start: "top top+=5%",
//             },
//           });
//         }

//         // Behind The Scene Card animation
//         ScrollTrigger.create({
//           trigger: BehindCardRef.current,
//           scroller: "[data-scroll-container]",
//           start: "top +=5%",
//           end: "bottom top+=10%",
//           scrub: true,
//           pin: true,
//           ease: "power2.inOut",
//         });

//         gsap.fromTo(
//           cards,
//           { y: 300, opacity: 0 },
//           {
//             y: 0,
//             opacity: 0.9,
//             stagger: 0.5,
//             duration: 1,
//             ease: "power2.out",
//             scrollTrigger: {
//               trigger: BehindCardRef.current,
//               scroller: "[data-scroll-container]",
//               start: "top +=5%",
//               end: "bottom top+=20%",
//               scrub: 2,
//             },
//           }
//         );

//         // Stats animation
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: ".sts-sc",
//             scroller: "[data-scroll-container]",
//             start: "top 80%",
//           },
//         });

//         tl.from(".stat-card", {
//           opacity: 0,
//           x: 30,
//           filter: "blur(12px)",
//           stagger: 0.4,
//           duration: 1.5,
//           ease: "power2.out",
//         });

//         tl.fromTo(
//           ".stat-number",
//           { textContent: 0 },
//           {
//             textContent: (_, target) => target.getAttribute("data-value"),
//             duration: 2.5,
//             ease: "power2.out",
//             snap: { textContent: 1 },
//           },
//           "0.3"
//         );
//       });

//       ScrollTrigger.refresh();
//       return () => ctx.revert();
//     };

//     const wait = setInterval(() => {
//       if (window.__loco) {
//         clearInterval(wait);
//         init();
//       }
//     }, 100);

//     return () => clearInterval(wait);
//   }, []);
// };

// export default useBTLAnimations;