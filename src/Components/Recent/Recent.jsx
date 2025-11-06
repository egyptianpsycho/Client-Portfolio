"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import "./styles.css";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, Flip,SplitText);

const Recent = () => {
  useEffect(() => {
    const init = () => {
      const lightColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--light")
        .trim();
      const darkColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--dark")
        .trim();
      const ctx = gsap.context(() => {
        const recentfirstSplit = new SplitText(".firstanimatetext", { type: "chars, words" });
        const recentsecondSplit = new SplitText(".secondanimatetext", { type: "words" });

        gsap.fromTo(
          recentfirstSplit.chars,
          {color:"#A9A9A9",filter:"blur(4px)" ,x:10,y:10},
          {
            y:0,
            x:0,
            color: "#101010",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              scroller: "[data-scroll-container]",
              trigger: "#recent-section",
              start: "top bottom-=15%",
              end: "bottom bottom+=100%",
              scrub: 1
            }
          }
        );
        gsap.fromTo(
          recentsecondSplit.words,
          {color:"#708090",filter:"blur(4px)" ,x:10,y:10},
          {
            y:0,
            x:0,
            color: "#edf1e8",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              scroller: "[data-scroll-container]",
              trigger: ".outro",
              start: "top bottom-=530%",
              end: "bottom bottom-=540%",
              scrub: 1
            }
          }
        );
        

      function interpolateColor(color1, color2, factor) {
        return gsap.utils.interpolate(color1, color2, factor);
      }
      gsap.to(".marq-images", {
        scrollTrigger: {
          scroller: "[data-scroll-container]",
          trigger: ".marq",
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const xPosition = -75 + progress * 25;
            gsap.set(".marq-images", {
              x: `${xPosition}%`,
            });
          },
        },
      });

      let pinnedMarqueeimgClone = null;
      let isImgCloneActive = false;

      function createPinnedMarqueeimgClone() {
        if (isImgCloneActive) return;

        const originalMarqueeImg = document.querySelector(".marq-img.pin img");
        const rect = originalMarqueeImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        pinnedMarqueeimgClone = originalMarqueeImg.cloneNode(true);

        gsap.set(pinnedMarqueeimgClone, {
          position: "fixed",
          left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
          top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
          width: originalMarqueeImg.offsetWidth + "px",
          height: originalMarqueeImg.offsetHeight + "px",
          transform: "rotate(-5deg)",
          transformOrigin: "center center",
          pointerEvents: "none",
          willChange: "transform",
          zIndex: 100,
        });
        document.body.appendChild(pinnedMarqueeimgClone);
        gsap.set(originalMarqueeImg, { opacity: 0 });
        isImgCloneActive = true;
      }
      function removePinnedMarqueeimgClone() {
        if (!isImgCloneActive) return;
        if (pinnedMarqueeimgClone) {
          pinnedMarqueeimgClone.remove();
          pinnedMarqueeimgClone = null;
        }
        const originalMarqueeImg = document.querySelector(".marq-img.pin img");
        gsap.set(originalMarqueeImg, { opacity: 1 });
        isImgCloneActive = false;
      }

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top top",
        scroller: "[data-scroll-container]",
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
      });

      ScrollTrigger.create({
        scroller: "[data-scroll-container]",
        trigger: ".marq",
        start: "top top",
        onEnter: createPinnedMarqueeimgClone,
        onEnterBack: createPinnedMarqueeimgClone,
        onLeaveBack: removePinnedMarqueeimgClone,
      });

      let flipAnimation = null;

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        scroller: "[data-scroll-container]",
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onEnter: () => {
          if (pinnedMarqueeimgClone && isImgCloneActive && !flipAnimation) {
            const statee = Flip.getState(pinnedMarqueeimgClone);

            gsap.set(pinnedMarqueeimgClone, {
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "100svh",
              transform: "rotate(0deg)",
              transformOrigin: "center center",
            });
            flipAnimation = Flip.from(statee, {
              duration: 1,
              ease: "none",
              paused: true,
            });
          }
        },
        onLeaveBack: () => {
          if (flipAnimation) {
            flipAnimation.kill();
            flipAnimation = null;
          }
          gsap.set(".cont", {
            backgroundColor: lightColor,
          });
          gsap.set(".horizontal-scroll-wrapper", {
            x: "0%",
          });
        },
      });

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        scroller: "[data-scroll-container]",
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress <= 0.05) {
            const bgColorProgress = Math.min(progress / 0.05, 1);
            const newBgColor = interpolateColor(
              lightColor,
              darkColor,
              bgColorProgress
            );
            gsap.set(".cont", {
              backgroundColor: newBgColor,
            });
          } else if (progress > 0.05) {
            gsap.set(".cont", {
              backgroundColor: darkColor,
            });
          }

          if (progress <= 0.2) {
            const scaleProgress = progress / 0.2;
            if (flipAnimation) {
              flipAnimation.progress(scaleProgress);
            }
          }
          if (progress > 0.2 && progress <= 0.95) {
            if (flipAnimation) {
              flipAnimation.progress(1);
            }
            const horizontalProgress = (progress - 0.2) / 0.75;
            const wrapperTranslateX = -66.67 * horizontalProgress;
            gsap.set(".horizontal-scroll-wrapper", {
              x: `${wrapperTranslateX}%`,
            });
            const slideMovement = (66.67 / 100) * 3 * horizontalProgress;
            const imageTranslateX = -slideMovement * 100;
            gsap.set(pinnedMarqueeimgClone, {
              x: `${imageTranslateX}%`,
            });
          } else if (progress > 0.95) {
            if (flipAnimation) {
              flipAnimation.progress(1);
            }
            gsap.set(pinnedMarqueeimgClone, {
              x: "-200%",
            });
            gsap.set(".horizontal-scroll-wrapper", {
              x: "-66.67%",
            });
          }
        },
      });
    });

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
    <div className="cont" id="recent-section">
      <section className="hero-2">
        <h1 className="h1-recent firstanimatetext ">
          Fragment of thoughts arranged in a sequence becomes patterns. they
          unfold step by step. shaping meaning as they move forward.
        </h1>
        
      </section>

      <section className="marq">
        <div className="marq-wrapper">
          <div className="marq-images">
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img pin">
              <img src="/Projects/images/Disconected/disconected.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
          </div>
        </div>
      </section>

      <section className="horizontal-scroll">
        <div className="horizontal-scroll-wrapper">
          <div className="horizontal-slide horizontal-spacer"></div>
          <div className="horizontal-slide">
            <div className="col">
              <h3 className="h3-recent">
                A landscape in constant transition, where every shape,sound and
                shadow refuse to stay still what seems stable begins to dissove
                and what fades return again in a new form
              </h3>
            </div>
            <div className="col">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="img" className="img-recent" />
            </div>
          </div>
          <div className="horizontal-slide">
            <div className="col">
              <h3 className="h3-recent">
                the rhytm of motion carries us forward into spaces that feel
                famillar yet remail undefined. each shift is subtle, yet togeter
                they remind us nothing we see is ever permanent.
              </h3>
            </div>
            <div className="col">
              <img src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="img" className="img-recent" />
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <h1 className="h1-recent secondanimatetext ">
          Shadows fold into light. shapes shift across the frame, reminding us
          that stillness is only temporary.
        </h1>
        <Image
                              src="/gradients/sky_gradient_white.png"
                              alt="gradient"
                              width={400}
                              height={400}
                              className=" absolute inset-0 opacity-30 scale-150 top-[-5%] left-[-18%] z-200 object-contain " />
        
        
      </section>
    </div>
  );
};

export default Recent;
