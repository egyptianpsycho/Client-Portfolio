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
  BehindImgRef,
  BehindCardRef,
  tRef,
  typingRef
) => {
  useEffect(() => {
    if (
      !sectionRef?.current ||
      !imageContainerRef?.current ||
      !BehindTLRef?.current ||
      !BehindImgRef?.current ||
      !BehindCardRef?.current ||
      !tRef?.current ||
      !typingRef?.current
    ) {
      return;
    }
    const img1 = imageContainerRef.current.querySelector(".img1");
    const img2 = imageContainerRef.current.querySelector(".img2");

    const fadeImages = (showSecond) => {
      if (showSecond) {
        gsap.to(img1, { opacity: 0, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 0.65, duration: 0.8, ease: "power1.out" });
      } else {
        gsap.to(img1, { opacity: 0.65, duration: 0.8, ease: "power1.out" });
        gsap.to(img2, { opacity: 0, duration: 0.8, ease: "power1.out" });
      }
    };

    const init = () => {
      const ctx = gsap.context(() => {
        const originalText = tRef.current
          ? tRef.current.textContent.trim()
          : "";

        const heroSplit = new SplitText(".title", { type: "chars, words" });
        const behindTitle = new SplitText(".behind-title", { type: "words" });
        const paragraphSplit = new SplitText(".original", { type: "lines" });

        const cards = BehindCardRef.current.querySelectorAll("img");

        heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));
        behindTitle.words.forEach((char) =>
          char.classList.add("text-gradient")
        );

        /////////////////////
        // --- typing/erase helpers (inside init() after 'cards' is defined) ---
        // typing overlay element we control (erase/type happens here)
        const overlay = typingRef.current;
        // Ensure overlay starts empty and hidden visually (we'll reveal when needed)
        overlay.innerHTML = "";
        overlay.style.opacity = 0;
        overlay.style.visibility = "hidden";
        //erase full text overlay
        const eraseOverlayFrom = (fullText, speed = 18) => {
          return new Promise((resolve) => {
            overlay.innerText = fullText;
            let i = fullText.length;
            const id = setInterval(() => {
              i--;
              overlay.innerText = fullText.substring(0, Math.max(0, i));
              if (i <= 0) {
                clearInterval(id);
                overlay.innerHTML = "";
                resolve();
              }
            }, speed);
          });
        };

        const typeInto = (el, text, speed = 36) => {
          return new Promise((resolve) => {
            el.innerHTML = "";
            let i = 0;
            const id = setInterval(() => {
              i++;
              el.textContent = text.substring(0, i);
              if (i >= text.length) {
                clearInterval(id);
                resolve();
              }
            }, speed);
          });
        };

        const achievements = [
          "At 2020 got featured on Egyptian national newspaper",
          "At 2021 got featured on DMC TV",
          "At 2023 participated in Nagib Suirez photography competition",
        ];
        // Guard so animation runs only once
        let fired = false;

        if (cards && cards.length > 0) {
          ScrollTrigger.create({
            trigger: cards[0],
            scroller: "[data-scroll-container]",
            start: "top top-=45%",
            once: true,
            onEnter: async () => {
              if (fired) return;
              fired = true;
              overlay.style.opacity = 1;
              overlay.style.visibility = "visible";

              // 1) hide SplitText-created visible line clones so overlay controls visuals
              if (
                paragraphSplit &&
                paragraphSplit.lines &&
                paragraphSplit.lines.length
              ) {
                paragraphSplit.lines.forEach((ln) => {
                  ln.style.display = "none";
                });
              }

              // 2) ensure original .original is hidden so only overlay shows
              // (SplitText often hides original; to be safe, hide it)
              try {
                tRef.current.style.display = "none";
              } catch (e) {}

              // 3) Erase overlay using the originalParagraph text we captured earlier
              await eraseOverlayFrom(originalText || "");

              // 4) Type the Achievements title on overlay
              const titleEl = document.createElement("div");
              titleEl.className = "achievement-title text-lg text-white/70 font-semibold  tracking-wide";
              overlay.appendChild(titleEl);
              
              // Type the title
              await typeInto(titleEl, "Achievements", 40);
              // small pause
              await new Promise((r) => setTimeout(r, 340));

              // 5) append a <br> and desc span inside the overlay, then type achievement text there
              const achContainer = document.createElement("div");
              achContainer.className =
                "achievements-container text-sm text-[#9ca3af]";
              overlay.appendChild(achContainer);

              // Create a line element for each achievement but don't fill it yet
              const lines = achievements.map((text) => {
                const line = document.createElement("div");
                achContainer.appendChild(line);
                return line;
              });

              // Create a ScrollTrigger for each achievement line
              lines.forEach((line, i) => {
                line.classList.add("achievement-line", `achievement-line-${i + 1}`);

                ScrollTrigger.create({
                  trigger: BehindCardRef.current.querySelectorAll("img")[i], // match each card
                  scroller: "[data-scroll-container]",
                  start: "top center", // when card enters viewport
                  once: true,
                  onEnter: async () => {
                    await typeInto(line, achievements[i], 32);
                  },
                });
              });

              // done — overlay shows typed Achievements; clones remain hidden.
            },
          });
        }

        ////////////////////
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

        gsap.from(behindTitle.words, {
          opacity: 0,
          duration: 6,
          ease: "expo.out",
          stagger: 0.1,
          filter: "blur(30px)",
          y: 50,
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top top-=55%",
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

        // Second image scroll-in from right to left & fade out
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

        // Behind The Scene text lines animation
        gsap.from(paragraphSplit.lines, {
          opacity: 0,
          yPercent: 100,
          color: "#0a212b",
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

        //behind the scene pinning animation
        gsap.to(BehindTLRef.current, {
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top center-=30%",
            end: "bottom top-=82%",
            scrub: true,
            pin: true,
            ease: "power2.inOut",
          },
        });

        // Behind The Scene text scroll left animation
        // gsap.to(BehindTLRef.current, {
        //   x: -600,
        //   scrollTrigger: {
        //     trigger: BehindTLRef.current,
        //     scroller: "[data-scroll-container]",
        //     start: "top center-=30%",
        //     end: "bottom top+=20%",
        //     duration: 0.1,
        //     scrub: true,
        //   },
        // });
        gsap.to(behindTitle.words, {
          x: -600,
          duration: 1.8, // control smoothness of motion
          ease: "power3.inOut", // smoother ease
          stagger: {
            each: 0.25, // delay between each word
            ease: "power2.inOut",
          },
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top center-=30%",
            end: "bottom top+=20%",
            scrub: 1, // allows smooth scroll-linked motion
          },
        });
        gsap.to(paragraphSplit.lines, {
          x: -600,
          duration: 1.8,
          ease: "power3.inOut",
          stagger: {
            each: 0.25,
            ease: "power2.inOut",
          },
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top center-=30%",
            end: "bottom top+=20%",
            scrub: 1,
          },
        });
        gsap.to(typingRef.current, {
          x: -600,
          duration: 1.8,
          ease: "power3.inOut",
          stagger: {
            each: 0.25,
            ease: "power2.inOut",
          },
          scrollTrigger: {
            trigger: BehindTLRef.current,
            scroller: "[data-scroll-container]",
            start: "top center-=30%",
            end: "bottom top+=20%",
            scrub: 1,
          },
        });

        // Behind The Scene Image animation
        gsap.to(BehindImgRef.current, {
          scrollTrigger: {
            trigger: BehindImgRef.current,
            scroller: "[data-scroll-container]",
            start: "top top+=5%",
            end: "bottom top-=70%",
            scrub: true,
            pin: true,
            ease: "power2.inOut",
          },
        });
        gsap.to(BehindImgRef.current, {
          opacity: 0.8,
          scrollTrigger: {
            trigger: BehindImgRef.current,
            scroller: "[data-scroll-container]",
            start: "top top+=5%",
          },
        });
        // Behind The Scene Card animation
        ScrollTrigger.create({
          trigger: BehindCardRef.current,
          scroller: "[data-scroll-container]",
          start: "top center-=30%",
          end: "bottom top-=20%",
          scrub: true,
          pin: true,
          ease: "power2.inOut",
        });
        gsap.fromTo(
          cards,
          { y: 300, opacity: 0 },
          {
            y: 0,
            opacity: 0.9,
            stagger: 0.5,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: BehindCardRef.current,
              scroller: "[data-scroll-container]",
              start: "top center-=30%",
              end: "bottom top+=20%",
              scrub: 2,
            },
          }
        );
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
