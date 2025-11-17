"use client";

// import { useEffect } from "react";
import "./Preloader.css";

// export default function Preloader() {
//   useEffect(() => {
//     const preloader = document.getElementById("preloader");
//     if (!preloader) return;

//     const finish = () => {
//       // Add class to run your "closing" animations
//       preloader.classList.add("preloaded");

//       // After animation ends, remove element and emit event
//       setTimeout(() => {
//         preloader.remove();
//         // Emit an event so other code (e.g. loco init) can react
//         window.dispatchEvent(new Event("preloaderFinished"));
//       }, 1000); // keep in sync with your CSS animation timing
//     };

//     // Try load event first
//     window.addEventListener("load", () => {
//         setTimeout(finish, 200); // waits 1.5s after load
//       }, { once: true });

//     // Fallback in case `load` doesn't fire (Next.js etc.)
//     const fallback = setTimeout(finish, 3000);

//     return () => {
//       window.removeEventListener("load", finish);
//       clearTimeout(fallback);
//     };
//   }, []);

//   return (
//     <div id="preloader">
//       <div className="loader_line"></div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import SplitText  from "gsap/SplitText";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase, SplitText);

const Preloader = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const init = () => {
      const ctx = gsap.context(() => {
        CustomEase.create("hop", ".8, 0, .3, 1");
        const splitTextElements = (
          selector,
          type = "words,chars",
          addFirstChar = false
        ) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            const splitText = new SplitText(element, {
              type,
              wordsClass: "word",
              charsClass: "char",
            });
            if (type.includes("chars")) {
              splitText.chars.forEach((char, index) => {
                const originalText = char.textContent;
                char.innerHTML = `<span>${originalText}</span>`;

                if (addFirstChar && index === 0) {
                  char.classList.add("first-char");
                }
              });
            }
          });
        };

        splitTextElements(".intro-title-pre h1", "words, chars", true);
        splitTextElements(".outro-title-pre h1");
        splitTextElements(".tag p", "words");
        splitTextElements(".card-pre h1", "words, chars", true);

        const isMobile = window.innerWidth <= 1000;

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
          x: isMobile ? "-3rem" : "-8rem",
          fontSize: isMobile ? "6rem" : "14rem",
          fontWeight: "500",
        });

        const tl = gsap.timeline({ defaults: { ease: "hop" } });
        const tags = gsap.utils.toArray(".tag");

        tags.forEach((tag, index) => {
          tl.to(
            tag.querySelectorAll(".p-pre .word"),
            {
              y: "0%",
              duration: 0.75,
            },
            0.5 + index * 0.1
          );
        });
        tl.to(
          ".preloader .intro-title-pre .char span",
          {
            y: "0%",
            duration: 0.75,
            stagger: 0.05,
          },
          0.5
        )
          .to(
            ".preloader .intro-title-pre .char:not(.first-char) span",
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
              x: isMobile ? "-3rem" : "-8rem",
              duration: 1,
            },
            3.5
          )
          .to(
            ".preloader .intro-title-pre .first-char",
            {
              x: isMobile ? "7.5rem" : "18rem",
              y: isMobile ? "-1rem" : "-2.75rem",
              fontWeight: "900",
              scale: 0.75,
              duration: 0.75,
            },
            4.5
          )
          .to(
            ".preloader .outro-title-pre .char",
            {
              x: isMobile ? "-3rem" : "-8rem",
              fontSize: isMobile ? "6rem" : "14rem",
              fontWeight: "500",
              duration: 0.75,
              onComplete: () => {
                gsap.set(".preloader", {
                  clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                });
                gsap.set(".split-overlay", {
                  clipPath: "polygon(0 50%, 100% 50, 100% 100%, 0 100%)",
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
          );

        tags.forEach((tag, index) => {
          tl.to(
            tag.querySelectorAll(".p-pre .word"),
            {
              y: "100%",
              duration: 0.75,
            },
            5.5 + index * 0.1
          );
        });

        tl.to(
          [".preloader", ".split-overlay"],
          {
            y: (i) => (i === 0 ? "-50%" : "50%"),
            duration: 1,
          },
          6
        ).to(".conte", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration:1,
        },6).to(".conte .card-pre",{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration:0.75,
        },6.25).to(".conte .card-pre h1 .char span",{
          y: "0%",
          duration:0.75,
          stagger:0.05
        },6.5)

        
      });

      return () => ctx.revert();
    };

    init();

    return () => clearInterval(wait);
  }, []);
  return (
    <div className="preloader-cont">
      <div className="preloader">
        <div className="intro-title-pre">
          <h1 className="h1-pre">Abbas Visuals</h1>
        </div>
        <div className="outro-title-pre">
          <h1 className="h1-pre">S</h1>
        </div>
      </div>
      <div className="split-overlay">
        <div className="intro-title-pre">
          <h1 className="h1-pre">Abbas Visuals</h1>
        </div>
        <div className="outro-title-pre">
          <h1 className="h1-pre">S</h1>
        </div>
      </div>
      <div className="tags-overlay">
        <div className="tag tag-1">
          <p className="p-pre"></p>
        </div>
        <div className="tag tag-2">
          <p className="p-pre"></p>
        </div>
        <div className="tag tag-3">
          <p className="p-pre"></p>
        </div>
      </div>
      <div className="conte">
        <nav className="nav-pre">
          <p id="logo" className="p-pre">
            N10
          </p>
          <p className="p-pre">Menu</p>
        </nav>
        <div className="preloaderHero-img">
          <img
            src="/HeroImages/black.webp"
            alt="pre"
            className="img-pre"
          />
        </div>
        <div className="card-pre">
          <h1 className="h1-pre">Abbas</h1>
        </div>
        <footer className="footer-pre">
          <p className="p-pre">Scroll Down</p>
          <p className="p-pre">Made by Abbas</p>
        </footer>
      </div>
    </div>
  );
};

export default Preloader;
