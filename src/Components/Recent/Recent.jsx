"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import "./styles.css";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, Flip, SplitText);


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
        const recentfirstSplit = new SplitText(".firstanimatetext", {
          type: "chars, words",
        });
        const recentsecondSplit = new SplitText(".secondanimatetext", {
          type: "words",
        });

        gsap.fromTo(
          recentfirstSplit.chars,
          { color: "#A9A9A9", filter: "blur(4px)", x: 10, y: 10 },
          {
            y: 0,
            x: 0,
            color: "#101010",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              scroller: "[data-scroll-container]",
              trigger: "#recent-section",
              start: "top bottom-=15%",
              end: "bottom bottom+=140%",
              scrub: 1,
            },
          }
        );
        gsap.fromTo(
          recentsecondSplit.words,
          { color: "#708090", filter: "blur(4px)", x: 10, y: 10 },
          {
            y: 0,
            x: 0,
            color: "#edf1e8",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              scroller: "[data-scroll-container]",
              trigger: ".outro",
              start: "top bottom-=430%",
              end: "bottom bottom-=440%",
              scrub: 1,
            },
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
        let flipAnimation = null;

        function createPinnedMarqueeimgClone() {
          if (isImgCloneActive) return;

          const originalMarqueeImg =
            document.querySelector(".marq-img.pin img");
          if (!originalMarqueeImg) return;

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

          if (flipAnimation) {
            flipAnimation.kill();
            flipAnimation = null;
          }

          if (pinnedMarqueeimgClone) {
            pinnedMarqueeimgClone.remove();
            pinnedMarqueeimgClone = null;
          }

          const originalMarqueeImg =
            document.querySelector(".marq-img.pin img");
          if (originalMarqueeImg) {
            gsap.set(originalMarqueeImg, { opacity: 1 });
          }

          isImgCloneActive = false;
        }

        ScrollTrigger.create({
          trigger: ".horizontal-scroll",
          start: "top top",
          scroller: "[data-scroll-container]",
          end: () => `+=${window.innerHeight * 4}`,
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

        ScrollTrigger.create({
          trigger: ".horizontal-scroll",
          scroller: "[data-scroll-container]",
          start: "top 50%",
          end: () => `+=${window.innerHeight * 4.5}`,
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
              if (!flipAnimation && pinnedMarqueeimgClone && isImgCloneActive) {
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

              const scaleProgress = progress / 0.2;
              if (flipAnimation) {
                flipAnimation.progress(scaleProgress);
              }
            }

            else if (progress > 0.2 && progress <= 0.95) {
              if (flipAnimation) {
                flipAnimation.progress(1);
              }

              const horizontalProgress = (progress - 0.2) / 0.75;
              const wrapperTranslateX = -75 * horizontalProgress; // Changed from -66.67 to -75

              gsap.set(".horizontal-scroll-wrapper", {
                x: `${wrapperTranslateX}%`,
              });

              if (pinnedMarqueeimgClone) {
                const slideMovement = (75 / 100) * 4 * horizontalProgress; // Changed to account for 4 slides
                const imageTranslateX = -slideMovement * 100;
                gsap.set(pinnedMarqueeimgClone, {
                  x: `${imageTranslateX}%`,
                });
              }
            }

            else if (progress > 0.95) {
              if (flipAnimation) {
                flipAnimation.progress(1);
              }

              if (pinnedMarqueeimgClone) {
                gsap.set(pinnedMarqueeimgClone, {
                  x: "-300%", // Changed from -200% to -300%
                });
              }

              gsap.set(".horizontal-scroll-wrapper", {
                x: "-75%", // Changed from -66.67% to -75%
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

            if (pinnedMarqueeimgClone && isImgCloneActive) {
              const originalMarqueeImg =
                document.querySelector(".marq-img.pin img");
              if (originalMarqueeImg) {
                const rect = originalMarqueeImg.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                gsap.set(pinnedMarqueeimgClone, {
                  position: "fixed",
                  left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
                  top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
                  width: originalMarqueeImg.offsetWidth + "px",
                  height: originalMarqueeImg.offsetHeight + "px",
                  transform: "rotate(-5deg)",
                  x: "0%",
                });
              }
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
    <div className="cont " id="recent-section">
      <section className="hero-2 ">
        <h1 className="h1-recent firstanimatetext max-sm:relative max-sm: max-sm:max-w-99  text-left">
          Shall we move from words to visuals? <br />
          Here's where the vision comes to life.
        </h1>
      </section>

      <section className="marq">
        <div className="marq-wrapper">
          <div className="marq-images">
            <div className="marq-img">
              <Image
                width={400}
                height={400}
                src="/Recent/A/pre3.webp"
                alt="marq-img"
                className="img-recent"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre4.webp"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre3.webp"
                alt="marq-img"
                className="img-recent object-bottom grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre3.webp"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre2.webp"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/post9.webp"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img pin">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/happy.JPG"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre4.webp"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/post5.JPG"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/p1.webp"
                alt="marq-img"
                className="img-recent grayscale-100"
                style={{ objectPosition: `50% 90%` }}
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/p2.webp"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/10.jpg"
                alt="marq-img"
                className="img-recent grayscale-100"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Projects/images/PORSCHE/PORSCHE.jpg"
                alt="marq-img"
                className="img-recent"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="horizontal-scroll">
        <div className="horizontal-scroll-wrapper">
          <div className="horizontal-slide horizontal-spacer"></div>
          
          {/* Pre-Production Slide */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content">
                <h2 className="production-title Recent-title-">PRE-PRODUCTION</h2>
                <p className="production-text Recent-paragraph-">
                  Where vision takes shape. This is the foundation stage where concepts are refined, 
                  storyboards come to life, and every detail is meticulously planned. From location 
                  scouting to casting, from script breakdowns to technical prep, pre-production transforms 
                  creative ideas into executable blueprints. It's where we ask the hard questions, solve 
                  problems before they arise, and set the stage for everything that follows.
                </p>
              </div>
            </div>
            <div className="col h-180 ">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre2.webp"
                alt="Pre-production"
                className="img-recent grayscale-100 object-bottom"
                loading="lazy"
              />
            </div>
          </div>

          {/* Production Slide */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content">
                <h2 className="production-title Recent-title-">PRODUCTION</h2>
                <p className="production-text Recent-paragraph-">
                  Action. This is where the magic happens. Cameras roll, lights illuminate, and the 
                  carefully laid plans of pre-production come alive. Every frame is captured with 
                  precision, every performance directed with purpose. It's controlled chaos—a symphony 
                  of moving parts working in perfect harmony. The energy is electric, the focus is 
                  intense, and the vision becomes tangible reality.
                </p>
              </div>
            </div>
            <div className="col h-180">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/p1.webp"
                alt="Production"
                className="img-recent grayscale-100 object-bottom GSXR"
                loading="lazy"
              />
            </div>
          </div>

          {/* Post-Production Slide */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content Recent-title-">
                <h2 className="production-title Recent-paragraph-">POST-PRODUCTION</h2>
                <p className="production-text ">
                  Where raw footage transforms into art. This is the refinement stage—editing, color 
                  grading, sound design, visual effects. Every cut is deliberate, every transition 
                  purposeful. Hours of footage distill into minutes of powerful storytelling. It's here 
                  that the narrative finds its rhythm, emotions are amplified, and the final vision 
                  crystallizes. Post-production doesn't just polish the work—it elevates it.
                </p>
              </div>
            </div>
            <div className="col post-production-images">
              <div className="img-stack">
                <Image
                  width={1920}
                  height={1080}
                  src="/Recent/A/post7.webp"
                  alt="Post-production 1"
                  className="img-recent grayscale-100"
                  style={{ objectPosition: `50% 70%` }}
                  loading="lazy"
                />
                <Image
                  width={1920}
                  height={1080}
                  src="/Recent/A/post5.JPG"
                  alt="Post-production 2"
                  className="img-recent grayscale-100"
                  loading="lazy"
                />
                <Image
                  width={1920}
                  height={1080}
                  src="/Recent/A/post9.webp"
                  alt="Post-production 3"
                  className="img-recent grayscale-100"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <p className="h1-recent secondanimatetext max-sm:relative md:w-[900px] max-sm:max-w-98">
          Every project here is a footprint of that process. From the broadest
          layout to the finest pixel, you're seeing the approach in action. <br />
          Take a closer look.
        </p>
        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={400}
          className="absolute inset-0 opacity-30 scale-150 top-[-5%] left-[-18%] max-sm:top-[-20%] max-sm:scale-125 z-200 object-contain testing-test-altra"
          height={400}
        />
      </section>
    </div>
  );
};

export default Recent;

// const Recent = () => {
//   useEffect(() => {
//     const init = () => {
//       const lightColor = getComputedStyle(document.documentElement)
//         .getPropertyValue("--light")
//         .trim();
//       const darkColor = getComputedStyle(document.documentElement)
//         .getPropertyValue("--dark")
//         .trim();

//       const ctx = gsap.context(() => {
//         const recentfirstSplit = new SplitText(".firstanimatetext", {
//           type: "chars, words",
//         });
//         const recentsecondSplit = new SplitText(".secondanimatetext", {
//           type: "words",
//         });

//         gsap.fromTo(
//           recentfirstSplit.chars,
//           { color: "#A9A9A9", filter: "blur(4px)", x: 10, y: 10 },
//           {
//             y: 0,
//             x: 0,
//             color: "#101010",
//             filter: "blur(0px)",
//             stagger: 0.05,
//             scrollTrigger: {
//               scroller: "[data-scroll-container]",
//               trigger: "#recent-section",
//               start: "top bottom-=15%",
//               end: "bottom bottom+=140%",
//               scrub: 1,
//             },
//           }
//         );
//         gsap.fromTo(
//           recentsecondSplit.words,
//           { color: "#708090", filter: "blur(4px)", x: 10, y: 10 },
//           {
//             y: 0,
//             x: 0,
//             color: "#edf1e8",
//             filter: "blur(0px)",
//             stagger: 0.05,
//             scrollTrigger: {
//               scroller: "[data-scroll-container]",
//               trigger: ".outro",
//               start: "top bottom-=330%",
//               end: "bottom bottom-=340%",
//               scrub: 1,
//             },
//           }
//         );

//         function interpolateColor(color1, color2, factor) {
//           return gsap.utils.interpolate(color1, color2, factor);
//         }

//         gsap.to(".marq-images", {
//           scrollTrigger: {
//             scroller: "[data-scroll-container]",
//             trigger: ".marq",
//             start: "top bottom",
//             end: "top top",
//             scrub: true,
//             onUpdate: (self) => {
//               const progress = self.progress;
//               const xPosition = -75 + progress * 25;
//               gsap.set(".marq-images", {
//                 x: `${xPosition}%`,
//               });
//             },
//           },
//         });

//         let pinnedMarqueeimgClone = null;
//         let isImgCloneActive = false;
//         let flipAnimation = null;

//         function createPinnedMarqueeimgClone() {
//           if (isImgCloneActive) return;

//           const originalMarqueeImg =
//             document.querySelector(".marq-img.pin img");
//           if (!originalMarqueeImg) return;

//           const rect = originalMarqueeImg.getBoundingClientRect();
//           const centerX = rect.left + rect.width / 2;
//           const centerY = rect.top + rect.height / 2;

//           pinnedMarqueeimgClone = originalMarqueeImg.cloneNode(true);

//           gsap.set(pinnedMarqueeimgClone, {
//             position: "fixed",
//             left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
//             top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
//             width: originalMarqueeImg.offsetWidth + "px",
//             height: originalMarqueeImg.offsetHeight + "px",
//             transform: "rotate(-5deg)",
//             transformOrigin: "center center",
//             pointerEvents: "none",
//             willChange: "transform",
//             zIndex: 100,
//           });

//           document.body.appendChild(pinnedMarqueeimgClone);
//           gsap.set(originalMarqueeImg, { opacity: 0 });
//           isImgCloneActive = true;
//         }

//         function removePinnedMarqueeimgClone() {
//           if (!isImgCloneActive) return;

//           if (flipAnimation) {
//             flipAnimation.kill();
//             flipAnimation = null;
//           }

//           if (pinnedMarqueeimgClone) {
//             pinnedMarqueeimgClone.remove();
//             pinnedMarqueeimgClone = null;
//           }

//           const originalMarqueeImg =
//             document.querySelector(".marq-img.pin img");
//           if (originalMarqueeImg) {
//             gsap.set(originalMarqueeImg, { opacity: 1 });
//           }

//           isImgCloneActive = false;
//         }

//         ScrollTrigger.create({
//           trigger: ".horizontal-scroll",
//           start: "top top",
//           scroller: "[data-scroll-container]",
//           end: () => `+=${window.innerHeight * 3}`,
//           pin: true,
//         });

//         ScrollTrigger.create({
//           scroller: "[data-scroll-container]",
//           trigger: ".marq",
//           start: "top top",
//           onEnter: createPinnedMarqueeimgClone,
//           onEnterBack: createPinnedMarqueeimgClone,
//           onLeaveBack: removePinnedMarqueeimgClone,
//         });

//         ScrollTrigger.create({
//           trigger: ".horizontal-scroll",
//           scroller: "[data-scroll-container]",
//           start: "top 50%",
//           end: () => `+=${window.innerHeight * 3.5}`,
//           onUpdate: (self) => {
//             const progress = self.progress;

//             if (progress <= 0.05) {
//               const bgColorProgress = Math.min(progress / 0.05, 1);
//               const newBgColor = interpolateColor(
//                 lightColor,
//                 darkColor,
//                 bgColorProgress
//               );
//               gsap.set(".cont", {
//                 backgroundColor: newBgColor,
//               });
//             } else if (progress > 0.05) {
//               gsap.set(".cont", {
//                 backgroundColor: darkColor,
//               });
//             }

//             if (progress <= 0.2) {
//               if (!flipAnimation && pinnedMarqueeimgClone && isImgCloneActive) {
//                 const statee = Flip.getState(pinnedMarqueeimgClone);

//                 gsap.set(pinnedMarqueeimgClone, {
//                   position: "fixed",
//                   left: "0px",
//                   top: "0px",
//                   width: "100%",
//                   height: "100svh",
//                   transform: "rotate(0deg)",
//                   transformOrigin: "center center",
//                 });

//                 flipAnimation = Flip.from(statee, {
//                   duration: 1,
//                   ease: "none",
//                   paused: true,
//                 });
//               }

//               const scaleProgress = progress / 0.2;
//               if (flipAnimation) {
//                 flipAnimation.progress(scaleProgress);
//               }
//             }

//             else if (progress > 0.2 && progress <= 0.95) {
//               if (flipAnimation) {
//                 flipAnimation.progress(1);
//               }

//               const horizontalProgress = (progress - 0.2) / 0.75;
//               const wrapperTranslateX = -66.67 * horizontalProgress;

//               gsap.set(".horizontal-scroll-wrapper", {
//                 x: `${wrapperTranslateX}%`,
//               });

//               if (pinnedMarqueeimgClone) {
//                 const slideMovement = (66.67 / 100) * 3 * horizontalProgress;
//                 const imageTranslateX = -slideMovement * 100;
//                 gsap.set(pinnedMarqueeimgClone, {
//                   x: `${imageTranslateX}%`,
//                 });
//               }
//             }

//             else if (progress > 0.95) {
//               if (flipAnimation) {
//                 flipAnimation.progress(1);
//               }

//               if (pinnedMarqueeimgClone) {
//                 gsap.set(pinnedMarqueeimgClone, {
//                   x: "-200%",
//                 });
//               }

//               gsap.set(".horizontal-scroll-wrapper", {
//                 x: "-66.67%",
//               });
//             }
//           },
//           onLeaveBack: () => {
//             if (flipAnimation) {
//               flipAnimation.kill();
//               flipAnimation = null;
//             }

//             gsap.set(".cont", {
//               backgroundColor: lightColor,
//             });

//             gsap.set(".horizontal-scroll-wrapper", {
//               x: "0%",
//             });

//             if (pinnedMarqueeimgClone && isImgCloneActive) {
//               const originalMarqueeImg =
//                 document.querySelector(".marq-img.pin img");
//               if (originalMarqueeImg) {
//                 const rect = originalMarqueeImg.getBoundingClientRect();
//                 const centerX = rect.left + rect.width / 2;
//                 const centerY = rect.top + rect.height / 2;

//                 gsap.set(pinnedMarqueeimgClone, {
//                   position: "fixed",
//                   left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
//                   top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
//                   width: originalMarqueeImg.offsetWidth + "px",
//                   height: originalMarqueeImg.offsetHeight + "px",
//                   transform: "rotate(-5deg)",
//                   x: "0%",
//                 });
//               }
//             }
//           },
//         });
//       });

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

//   return (
//     <div className="cont " id="recent-section">
//       <section className="hero-2 ">
//         <h1 className="h1-recent firstanimatetext max-sm:relative max-sm: max-sm:max-w-99  text-left">
//           Shall we move from words to visuals? <br />
//           Here's where the vision comes to life.
//         </h1>
//       </section>

//       <section className="marq">
//         <div className="marq-wrapper">
//           <div className="marq-images">
//             <div className="marq-img">
//               <Image
//                 width={400}
//                 height={400}
//                 src="/Recent/A/pre3.JPG"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/pre4.JPG"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/pre3.JPG"
//                 alt="marq-img"
//                 className="img-recent object-bottom grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/pre3.JPG"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/pre2.JPG"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/post9.png"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img pin">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/happy.JPG"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/pre4.JPG"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/post5.JPG"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/p1.jpg"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 style={{ objectPosition: `50% 90%` }}
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/p2.png"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/10.jpg"
//                 alt="marq-img"
//                 className="img-recent grayscale-100"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Projects/images/PORSCHE/PORSCHE.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="horizontal-scroll">
//         <div className="horizontal-scroll-wrapper">
//           <div className="horizontal-slide horizontal-spacer"></div>
          
//           {/* Pre-Production Slide */}
//           <div className="horizontal-slide">
//             <div className="col">
//               <div className="production-content">
//                 <h2 className="production-title">PRE-PRODUCTION</h2>
//                 <p className="production-text">
//                   Where vision takes shape. This is the foundation stage where concepts are refined, 
//                   storyboards come to life, and every detail is meticulously planned. From location 
//                   scouting to casting, from script breakdowns to technical prep, pre-production transforms 
//                   creative ideas into executable blueprints. It's where we ask the hard questions, solve 
//                   problems before they arise, and set the stage for everything that follows.
//                 </p>
//               </div>
//             </div>
//             <div className="col h-180 ">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/A/p2.png"
//                 alt="Pre-production"
//                 className="img-recent grayscale-100 object-bottom  "
//                 loading="lazy"
//               />
//             </div>
//           </div>

//           {/* Production Slide */}
//           <div className="horizontal-slide">
//             <div className="col">
//               <div className="production-content">
//                 <h2 className="production-title">PRODUCTION</h2>
//                 <p className="production-text">
//                   Action. This is where the magic happens. Cameras roll, lights illuminate, and the 
//                   carefully laid plans of pre-production come alive. Every frame is captured with 
//                   precision, every performance directed with purpose. It's controlled chaos—a symphony 
//                   of moving parts working in perfect harmony. The energy is electric, the focus is 
//                   intense, and the vision becomes tangible reality.
//                 </p>
//               </div>
//             </div>
//             <div className="col post-production-images ">
//               <div className="img-stack ">
//                 <Image
//                   width={1920}
//                   height={1080}
//                   src="/Recent/A/post7.JPG"
//                   alt="Production 1"
//                   className="img-recent grayscale-100"
//                   loading="lazy"
//                 />
//                 <Image
//                   width={1920}
//                   height={1080}
//                   src="/Recent/A/post5.JPG"
//                   alt="Production 2"
//                   className="img-recent grayscale-100"
//                   loading="lazy"
//                 />
//                 <Image
//                   width={1920}
//                   height={1080}
//                   src="/Recent/A/post9.png"
//                   alt="Production 3"
//                   className="img-recent grayscale-100"
//                   loading="lazy"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="outro">
//         <p className="h1-recent secondanimatetext max-sm:relative md:w-[900px] max-sm:max-w-98">
//           Every project here is a footprint of that process. From the broadest
//           layout to the finest pixel, you're seeing the approach in action. <br />
//           Take a closer look.
//         </p>
//         <Image
//           src="/gradients/sky_gradient_white.png"
//           alt="gradient"
//           width={400}
//           className="absolute inset-0 opacity-30 scale-150 top-[-5%] left-[-18%] max-sm:top-[-20%] max-sm:scale-125 z-200 object-contain testing-test-altra"
//           height={400}
//         />
//       </section>
//     </div>
//   );
// };

// export default Recent;


// "use client";
// import React, { useEffect } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import { Flip } from "gsap/Flip";
// import "./styles.css";
// import Image from "next/image";
// import { SplitText } from "gsap/SplitText";

// gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

// const Recent = () => {
//   useEffect(() => {
//     const init = () => {
//       const lightColor = getComputedStyle(document.documentElement)
//         .getPropertyValue("--light")
//         .trim();
//       const darkColor = getComputedStyle(document.documentElement)
//         .getPropertyValue("--dark")
//         .trim();

//       const ctx = gsap.context(() => {
//         const recentfirstSplit = new SplitText(".firstanimatetext", {
//           type: "chars, words",
//         });
//         const recentsecondSplit = new SplitText(".secondanimatetext", {
//           type: "words",
//         });

//         gsap.fromTo(
//           recentfirstSplit.chars,
//           { color: "#A9A9A9", filter: "blur(4px)", x: 10, y: 10 },
//           {
//             y: 0,
//             x: 0,
//             color: "#101010",
//             filter: "blur(0px)",
//             stagger: 0.05,
//             scrollTrigger: {
//               scroller: "[data-scroll-container]",
//               trigger: "#recent-section",
//               start: "top bottom-=15%",
//               end: "bottom bottom+=140%",
//               scrub: 1,
//             },
//           }
//         );
//         gsap.fromTo(
//           recentsecondSplit.words,
//           { color: "#708090", filter: "blur(4px)", x: 10, y: 10 },
//           {
//             y: 0,
//             x: 0,
//             color: "#edf1e8",
//             filter: "blur(0px)",
//             stagger: 0.05,
//             scrollTrigger: {
//               scroller: "[data-scroll-container]",
//               trigger: ".outro",
//               start: "top bottom-=530%",
//               end: "bottom bottom-=540%",
//               scrub: 1,
//             },
//           }
//         );

//         function interpolateColor(color1, color2, factor) {
//           return gsap.utils.interpolate(color1, color2, factor);
//         }

//         gsap.to(".marq-images", {
//           scrollTrigger: {
//             scroller: "[data-scroll-container]",
//             trigger: ".marq",
//             start: "top bottom",
//             end: "top top",
//             scrub: true,
//             onUpdate: (self) => {
//               const progress = self.progress;
//               const xPosition = -75 + progress * 25;
//               gsap.set(".marq-images", {
//                 x: `${xPosition}%`,
//               });
//             },
//           },
//         });

//         let pinnedMarqueeimgClone = null;
//         let isImgCloneActive = false;
//         let flipAnimation = null;

//         function createPinnedMarqueeimgClone() {
//           if (isImgCloneActive) return;

//           const originalMarqueeImg =
//             document.querySelector(".marq-img.pin img");
//           if (!originalMarqueeImg) return;

//           const rect = originalMarqueeImg.getBoundingClientRect();
//           const centerX = rect.left + rect.width / 2;
//           const centerY = rect.top + rect.height / 2;

//           pinnedMarqueeimgClone = originalMarqueeImg.cloneNode(true);

//           gsap.set(pinnedMarqueeimgClone, {
//             position: "fixed",
//             left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
//             top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
//             width: originalMarqueeImg.offsetWidth + "px",
//             height: originalMarqueeImg.offsetHeight + "px",
//             transform: "rotate(-5deg)",
//             transformOrigin: "center center",
//             pointerEvents: "none",
//             willChange: "transform",
//             zIndex: 100,
//           });

//           document.body.appendChild(pinnedMarqueeimgClone);
//           gsap.set(originalMarqueeImg, { opacity: 0 });
//           isImgCloneActive = true;
//         }

//         function removePinnedMarqueeimgClone() {
//           if (!isImgCloneActive) return;

//           // Kill any active flip animation
//           if (flipAnimation) {
//             flipAnimation.kill();
//             flipAnimation = null;
//           }

//           if (pinnedMarqueeimgClone) {
//             pinnedMarqueeimgClone.remove();
//             pinnedMarqueeimgClone = null;
//           }

//           const originalMarqueeImg =
//             document.querySelector(".marq-img.pin img");
//           if (originalMarqueeImg) {
//             gsap.set(originalMarqueeImg, { opacity: 1 });
//           }

//           isImgCloneActive = false;
//         }

//         // Pin the horizontal scroll section
//         ScrollTrigger.create({
//           trigger: ".horizontal-scroll",
//           start: "top top",
//           scroller: "[data-scroll-container]",
//           end: () => `+=${window.innerHeight * 5}`,
//           pin: true,
//         });

//         // Create clone when marq section reaches top
//         ScrollTrigger.create({
//           scroller: "[data-scroll-container]",
//           trigger: ".marq",
//           start: "top top",
//           onEnter: createPinnedMarqueeimgClone,
//           onEnterBack: createPinnedMarqueeimgClone,
//           onLeaveBack: removePinnedMarqueeimgClone,
//         });

//         // Main animation controller
//         ScrollTrigger.create({
//           trigger: ".horizontal-scroll",
//           scroller: "[data-scroll-container]",
//           start: "top 50%",
//           end: () => `+=${window.innerHeight * 5.5}`,
//           onUpdate: (self) => {
//             const progress = self.progress;

//             // Background color transition (0-5% progress)
//             if (progress <= 0.05) {
//               const bgColorProgress = Math.min(progress / 0.05, 1);
//               const newBgColor = interpolateColor(
//                 lightColor,
//                 darkColor,
//                 bgColorProgress
//               );
//               gsap.set(".cont", {
//                 backgroundColor: newBgColor,
//               });
//             } else if (progress > 0.05) {
//               gsap.set(".cont", {
//                 backgroundColor: darkColor,
//               });
//             }

//             // Flip animation (0-20% progress)
//             if (progress <= 0.2) {
//               // Create flip animation if it doesn't exist and clone is ready
//               if (!flipAnimation && pinnedMarqueeimgClone && isImgCloneActive) {
//                 const statee = Flip.getState(pinnedMarqueeimgClone);

//                 gsap.set(pinnedMarqueeimgClone, {
//                   position: "fixed",
//                   left: "0px",
//                   top: "0px",
//                   width: "100%",
//                   height: "100svh",
//                   transform: "rotate(0deg)",
//                   transformOrigin: "center center",
//                 });

//                 flipAnimation = Flip.from(statee, {
//                   duration: 1,
//                   ease: "none",
//                   paused: true,
//                 });
//               }

//               const scaleProgress = progress / 0.2;
//               if (flipAnimation) {
//                 flipAnimation.progress(scaleProgress);
//               }
//             }

//             // Horizontal scroll (20-95% progress)
//             else if (progress > 0.2 && progress <= 0.95) {
//               if (flipAnimation) {
//                 flipAnimation.progress(1);
//               }

//               const horizontalProgress = (progress - 0.2) / 0.75;
//               const wrapperTranslateX = -66.67 * horizontalProgress;

//               gsap.set(".horizontal-scroll-wrapper", {
//                 x: `${wrapperTranslateX}%`,
//               });

//               if (pinnedMarqueeimgClone) {
//                 const slideMovement = (66.67 / 100) * 3 * horizontalProgress;
//                 const imageTranslateX = -slideMovement * 100;
//                 gsap.set(pinnedMarqueeimgClone, {
//                   x: `${imageTranslateX}%`,
//                 });
//               }
//             }

//             // Final position (95%+ progress)
//             else if (progress > 0.95) {
//               if (flipAnimation) {
//                 flipAnimation.progress(1);
//               }

//               if (pinnedMarqueeimgClone) {
//                 gsap.set(pinnedMarqueeimgClone, {
//                   x: "-200%",
//                 });
//               }

//               gsap.set(".horizontal-scroll-wrapper", {
//                 x: "-66.67%",
//               });
//             }
//           },
//           onLeaveBack: () => {
//             // Reset everything when scrolling back up
//             if (flipAnimation) {
//               flipAnimation.kill();
//               flipAnimation = null;
//             }

//             gsap.set(".cont", {
//               backgroundColor: lightColor,
//             });

//             gsap.set(".horizontal-scroll-wrapper", {
//               x: "0%",
//             });

//             if (pinnedMarqueeimgClone && isImgCloneActive) {
//               // Reset clone to initial position
//               const originalMarqueeImg =
//                 document.querySelector(".marq-img.pin img");
//               if (originalMarqueeImg) {
//                 const rect = originalMarqueeImg.getBoundingClientRect();
//                 const centerX = rect.left + rect.width / 2;
//                 const centerY = rect.top + rect.height / 2;

//                 gsap.set(pinnedMarqueeimgClone, {
//                   position: "fixed",
//                   left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
//                   top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
//                   width: originalMarqueeImg.offsetWidth + "px",
//                   height: originalMarqueeImg.offsetHeight + "px",
//                   transform: "rotate(-5deg)",
//                   x: "0%",
//                 });
//               }
//             }
//           },
//         });
//       });

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

//   return (
//     <div className="cont " id="recent-section">
//       <section className="hero-2 ">
//         <h1 className="h1-recent firstanimatetext max-sm:relative max-sm: max-sm:max-w-99  text-left">
//           Shall we move from words to visuals? <br />
//           Here’s where the vision comes to life.
//         </h1>
//       </section>

//       <section className="marq">
//         <div className="marq-wrapper">
//           <div className="marq-images">
//             <div className="marq-img">
//               <Image
//                 width={400}
//                 height={400}
//                 src="/Projects/images/PORSCHE/PORSCHE.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/8.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/5.jpg"
//                 alt="marq-img"
//                 className="img-recent object-bottom"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Projects/images/PORSCHE/PORSCHE.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/6.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/7.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img pin">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Projects/images/Disconected/disconected.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Projects/images/PORSCHE/PORSCHE.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/1.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/3.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 style={{ objectPosition: `50% 90%` }}
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/9.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Recent/10.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//             <div className="marq-img">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Projects/images/PORSCHE/PORSCHE.jpg"
//                 alt="marq-img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="horizontal-scroll">
//         <div className="horizontal-scroll-wrapper">
//           <div className="horizontal-slide horizontal-spacer"></div>
//           <div className="horizontal-slide">
//             <div className="col">
//               <h3 className="h3-recent">
//                 A landscape in constant transition, where every shape, sound and
//                 shadow refuse to stay still what seems stable begins to dissolve
//                 and what fades return again in a new form
//               </h3>
//             </div>
//             <div className="col">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Projects/images/TALISE/TALISE2.webp"
//                 alt="img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//           </div>
//           <div className="horizontal-slide">
//             <div className="col">
//               <h3 className="h3-recent">
//                 the rhythm of motion carries us forward into spaces that feel
//                 familiar yet remain undefined. each shift is subtle, yet
//                 together they remind us nothing we see is ever permanent.
//               </h3>
//             </div>
//             <div className="col">
//               <Image
//                 width={1920}
//                 height={1080}
//                 src="/Projects/images/TALISE/TALISE4.webp"
//                 alt="img"
//                 className="img-recent"
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="outro">
//         <p className="h1-recent secondanimatetext max-sm:relative md:w-[900px]     max-sm:max-w-98">
//           Every project here is a footprint of that process. From the broadest
//           layout to the finest pixel, you’re seeing the approach in action. <br />
//           Take a closer look.
//         </p>
//         <Image
//           src="/gradients/sky_gradient_white.png"
//           alt="gradient"
//           width={400}
//           height={400}
//           className="absolute inset-0 opacity-30 scale-150 top-[-5%] left-[-18%] max-sm:top-[-20%] max-sm:scale-125 z-200 object-contain"
//         />
//       </section>
//     </div>
//   );
// };

// export default Recent;
