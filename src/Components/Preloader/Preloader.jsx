"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import PreHero from "../Hero/PreHero";

gsap.registerPlugin(CustomEase);

const Preloader = ({ onComplete }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const init = () => {
      const ctx = gsap.context(() => {
        CustomEase.create("hop", ".8, 0, .3, 1");

        // Split text function
        const splitTextElements = (selector, addFirstChar = false) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            const text = element.textContent;
            const chars = text.split("");
            element.innerHTML = "";

            chars.forEach((char, index) => {
              const charSpan = document.createElement("span");
              charSpan.className = "char";
              if (addFirstChar && index === 0) {
                charSpan.classList.add("first-char");
              }

              const innerSpan = document.createElement("span");
              innerSpan.textContent = char === " " ? "\u00A0" : char;
              charSpan.appendChild(innerSpan);
              element.appendChild(charSpan);
            });
          });
        };

        splitTextElements(".intro-title-pre h1", true);
        splitTextElements(".outro-title-pre h1");

        const isMobile = window.innerWidth <= 1000;

        // Initial setup
        gsap.set([".intro-title-pre", ".outro-title-pre"], { opacity: 1 });

        gsap.set(
          [
            ".split-overlay .intro-title-pre .first-char span",
            ".split-overlay .outro-title-pre .char span",
          ],
          { y: "0%" }
        );

        gsap.set(".split-overlay .intro-title-pre .first-char", {
          x: isMobile ? "7.5rem" : "18rem",
          y: isMobile ? "-1rem" : "-2.75rem",
          fontWeight: "900",
          scale: 0.75,
        });

        gsap.set(".split-overlay .outro-title-pre .char", {
          x: isMobile ? "-8rem" : "-8rem",
          fontSize: isMobile ? "6rem" : "14rem",
          fontWeight: "500",
        });

        // Main timeline
        const tl = gsap.timeline({
          defaults: { ease: "hop" },
          onComplete: () => {
            document.body.style.overflow = "";
            window.__preloaderDone = true;

            // Fade out the preloader wrapper smoothly
            const preloaderWrapper =
              document.querySelector(".preloader-wrapper");
            if (preloaderWrapper) {
              gsap.to(preloaderWrapper, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                  preloaderWrapper.remove();

                  const styleTag = document.getElementById("preloader-styles");
                  if (styleTag) styleTag.remove();
                },
              });
            }

            if (onComplete) onComplete();
          },
        });

        tl.fromTo(
          ".preloader .intro-title-pre .char span",
          {
            filter:!isMobile? "blur(12px)":"",y:"-120%"
          },
          {
            y: "0%",
            duration: 0.75,
            stagger: 0.05,
            filter: "blur(0px)",
          },
          0.5
        )
          .fromTo(
            ".preloader .intro-title-pre .char:not(.first-char) span",
            {            filter:!isMobile? "blur(1px)":""
            },
            {
              y: "100%",
              duration: 0.75,
              stagger: 0.05,
            },
            2
          )
          .to(
            ".preloader .outro-title-pre .char span",
            {
              y: "0%",
              duration: 0.75,
              stagger: 0.075,
            },
            2.5
          )
          .to(
            ".preloader .intro-title-pre .first-char",
            {
              x: isMobile ? "9rem" : "21.25rem",
              duration: 1,
            },
            3.5
          )
          .to(
            ".preloader .outro-title-pre .char",
            {
              x: isMobile ? "-8rem" : "-8rem",
              duration: 1,
            },
            3.5
          )
          .to(
            ".preloader .intro-title-pre .first-char",
            {
              x: isMobile ? "7.5rem" : "18rem",
              y: isMobile ? "-2rem" : "-2.75rem",
              fontWeight: "700",
              scale: 0.75,
              duration: 0.75,
            },
            4.5
          )
          .to(
            ".preloader .outro-title-pre .char",
            {
              x: isMobile ? "-8rem" : "-8rem",
              fontSize: isMobile ? "6rem" : "14rem",
              fontWeight: "500",
              duration: 0.75,
              onComplete: () => {
                gsap.set(".preloader", {
                  clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                });
                gsap.set(".split-overlay", {
                  clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                });
              },
            },
            4.5
          )
          .to(
            ".conte",
            {
              clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
              duration: 1,
            },
            5
          )
          .to(
            [".preloader", ".split-overlay"],
            {
              y: (i) => (i === 0 ? "-50%" : "50%"),
              duration: 1,
            },
            6
          )
          .to(
            ".conte",
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1,
            },
            6
          );
      });

      // CSS for char animations
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
  .intro-title-pre .char,
  .outro-title-pre .char {
    position: relative;
    display: inline-block;
    overflow: hidden;
    margin-top: 0.75rem;
  }
  
  .intro-title-pre .char span,
  .outro-title-pre .char span {
    position: relative;
    display: inline-block;
    transform: translateY(-100%);
    will-change: transform;
  }
  
  .intro-title-pre .first-char {
    transform-origin: top left;
  }
  
  @media (max-width: 1000px) {
    .intro-title-pre .char,
    .outro-title-pre .char {
      margin-top: 0.5rem;
    }
  }
`;
      document.head.appendChild(styleSheet);

      return () => ctx.revert();
    };

    init();
  }, [onComplete]);

  return (
    <div className="preloader-wrapper pointer-events-none" style={styles.wrapper}>
      <div className="preloader-cont" style={styles.container}>
        <div className="preloader" style={styles.preloader}>
          <div className="intro-title-pre" style={styles.introTitle}>
            <h1 className="h1-pre" style={styles.h1}>
              Abbas Visuals
            </h1>
          </div>
          <div className="outro-title-pre" style={styles.outroTitle}>
            <h1 className="h1-pre" style={styles.h1}>
              V
            </h1>
          </div>
        </div>
        <div className="split-overlay" style={styles.splitOverlay}>
          <div className="intro-title-pre" style={styles.introTitle}>
            <h1 className="h1-pre" style={styles.h1}>
              Abbas Visuals
            </h1>
          </div>
          <div className="outro-title-pre" style={styles.outroTitle}>
            <h1 className="h1-pre" style={styles.h1}>
              V
            </h1>
          </div>
        </div>
        <div className="conte" style={styles.conte}>
          {/* Use the real Hero component as the fake hero */}
          <PreHero />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
  },
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    fontFamily: '"DM Sans", sans-serif',
  },
  preloader: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    zIndex: 2,
  },
  splitOverlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    zIndex: 1,
  },
  conte: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    clipPath: "polygon(0 48%, 0 48%, 0 52%, 0 52%)",
    zIndex: 2,
    overflow: "hidden",
  },
  introTitle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    textAlign: "center",
    opacity: 0,
  },
  outroTitle: {
    position: "absolute",
    top: "50%",
    left: "calc(50% + 10rem)",
    transform: "translate(-50%, -50%)",
    opacity: 0,
  },
  h1: {
    textTransform: "uppercase",
    fontSize: "clamp(2.5rem, 8vw, 6rem)",
    fontWeight: 600,
    lineHeight: 1,
    margin: 0,
  },
};

export default Preloader;
