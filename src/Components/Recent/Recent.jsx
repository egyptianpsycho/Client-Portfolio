"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import "./styles.css";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, Flip, SplitText);


const Recent = () => {
  // Refs for Pre-Production
  const preProductionTitleRef = useRef(null);
  const preProductionTextRef = useRef(null);
  
  // Refs for Production
  const productionTitleRef = useRef(null);
  const productionTextRef = useRef(null);
  
  // Refs for Post-Production
  const postProductionTitleRef = useRef(null);
  const postProductionTextRef = useRef(null);

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

        // Pre-Production animations
        if (preProductionTitleRef.current) {
          gsap.set(preProductionTitleRef.current, { yPercent: 120 });
          ScrollTrigger.create({
            trigger: preProductionTitleRef.current,
            start: "top 75%",
            scroller: "[data-scroll-container]",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                preProductionTitleRef.current,
                { filter: "blur(4px)" },
                {
                  yPercent: 0,
                  duration: 1.8,
                  filter: "blur(0px)",
                  ease: "power3.out",
                }
              );
            },
          });
        }

        if (preProductionTextRef.current) {
          gsap.set(preProductionTextRef.current, { yPercent: 120 });
          ScrollTrigger.create({
            trigger: preProductionTextRef.current,
            start: "top 85%",
            scroller: "[data-scroll-container]",
            toggleActions: "play none none reverse",
            onEnter: () => {
              gsap.fromTo(
                preProductionTextRef.current,
                { filter: "blur(4px)" },
                {
                  yPercent: 0,
                  duration: 1.2,
                  filter: "blur(0px)",
                  ease: "power3.out",
                }
              );
            },
          });
        }

        // Production animations
        if (productionTitleRef.current) {
          gsap.set(productionTitleRef.current, { yPercent: 120 });
          ScrollTrigger.create({
            trigger: productionTitleRef.current,
            start: "top 75%",
            scroller: "[data-scroll-container]",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                productionTitleRef.current,
                { filter: "blur(4px)" },
                {
                  yPercent: 0,
                  duration: 1.8,
                  filter: "blur(0px)",
                  ease: "power3.out",
                }
              );
            },
          });
        }

        if (productionTextRef.current) {
          gsap.set(productionTextRef.current, { yPercent: 120 });
          ScrollTrigger.create({
            trigger: productionTextRef.current,
            start: "top 85%",
            scroller: "[data-scroll-container]",
            toggleActions: "play none none reverse",
            onEnter: () => {
              gsap.fromTo(
                productionTextRef.current,
                { filter: "blur(4px)" },
                {
                  yPercent: 0,
                  duration: 1.2,
                  filter: "blur(0px)",
                  ease: "power3.out",
                }
              );
            },
          });
        }

        // Post-Production animations
        if (postProductionTitleRef.current) {
          gsap.set(postProductionTitleRef.current, { yPercent: 120 });
          ScrollTrigger.create({
            trigger: postProductionTitleRef.current,
            start: "top 75%",
            scroller: "[data-scroll-container]",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                postProductionTitleRef.current,
                { filter: "blur(4px)" },
                {
                  yPercent: 0,
                  duration: 1.8,
                  filter: "blur(0px)",
                  ease: "power3.out",
                }
              );
            },
          });
        }

        if (postProductionTextRef.current) {
          gsap.set(postProductionTextRef.current, { yPercent: 120 });
          ScrollTrigger.create({
            trigger: postProductionTextRef.current,
            start: "top 85%",
            scroller: "[data-scroll-container]",
            toggleActions: "play none none reverse",
            onEnter: () => {
              gsap.fromTo(
                postProductionTextRef.current,
                { filter: "blur(4px)" },
                {
                  yPercent: 0,
                  duration: 1.2,
                  filter: "blur(0px)",
                  ease: "power3.out",
                }
              );
            },
          });
        }

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
              const wrapperTranslateX = -75 * horizontalProgress;

              gsap.set(".horizontal-scroll-wrapper", {
                x: `${wrapperTranslateX}%`,
              });

              if (pinnedMarqueeimgClone) {
                const slideMovement = (75 / 100) * 4 * horizontalProgress;
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
                  x: "-300%",
                });
              }

              gsap.set(".horizontal-scroll-wrapper", {
                x: "-75%",
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
                className="img-recent"
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre3.webp"
                alt="marq-img"
                className="img-recent object-bottom "
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/pre3.webp"
                alt="marq-img"
                className="img-recent "
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/1.webp"
                alt="marq-img"
                className="img-recent "
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/2.JPG"
                alt="marq-img"
                className="img-recent "
                loading="lazy"
              />
            </div>
            <div className="marq-img pin">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/pin.webp"
                alt="marq-img"
                className="img-recent "
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/4.webp"
                alt="marq-img"
                className="img-recent "
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/5.webp"
                alt="marq-img"
                className="img-recent "
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/3.jpg"
                alt="marq-img"
                className="img-recent "
                style={{ objectPosition: `50% 90%` }}
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/6.png"
                alt="marq-img"
                className="img-recent "
                loading="lazy"
              />
            </div>
            <div className="marq-img">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/7.webp"
                alt="marq-img"
                className="img-recent "
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
                <div style={{ overflow: "hidden" }}>
                  <h2 ref={preProductionTitleRef} className="production-title Recent-title-">PRE-PRODUCTION</h2>
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p ref={preProductionTextRef} className="production-text Recent-paragraph-">
                  Where strategy gets a spine. We tear down your brief, rebuild it from the ground up, and forge a visual treatment that dictates the tone, texture, and tension of the entire campaign.
                  </p>
                </div>
              </div>
            </div>
            <div className="col h-180 ">
              <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/3.jpg"
                alt="Pre-production"
                className="img-recent  object-bottom"
                loading="lazy"
              />
            </div>
          </div>

          {/* Production Slide */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content">
                <div style={{ overflow: "hidden" }}>
                  <h2 ref={productionTitleRef} className="production-title Recent-title-">PRODUCTION</h2>
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p ref={productionTextRef} className="production-text Recent-paragraph-">
                  The executed principle. Working within this defined system, we generate the raw assets. The environment is managed, the detail attended to, ensuring the principle is rendered as material.
                  </p>
                </div>
              </div>
            </div>
            <div className="col h-180">
               <Image
                width={1920}
                height={1080}
                src="/Recent/A/B/7.webp"
                alt="Production"
                className="img-recent  object-bottom "
                style={{ width: `700px` }}

                loading="lazy"
              />
            </div>
          </div>

          {/* Post-Production Slide */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content Recent-title-">
                <div style={{ overflow: "hidden" }}>
                  <h2 ref={postProductionTitleRef} className="production-title Recent-paragraph-">POST-PRODUCTION</h2>
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p ref={postProductionTextRef} className="production-text ">
                  The work is launched into the cultural stream. Finalized with a critical eye, it is placed in influential media and scaled for public impact, beginning its dialogue.
                  </p>
                </div>
              </div>
            </div>
            <div className="col post-production-images">
              <div className="img-stack">
              <Image
                  width={1920}
                  height={1080}
                  src="/Recent/A/B/4.webp"
                  alt="Post-production 1"
                  className="img-recent  "
                  style={{ objectPosition: `50% 70%` }}
                  loading="lazy"
                />
                <Image
                  width={1920}
                  height={1080}
                  src="/Recent/A/B/5.webp"
                  alt="Post-production 2"
                  className="img-recent "
                  loading="lazy"
                />
                <Image
                  width={1920}
                  height={1080}
                  src="/Recent/A/B/1.webp"
                  alt="Post-production 3"
                  className="img-recent "
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="outro ">
        <p className="h1-recent secondanimatetext max-sm:relative md:w-[950px] max-sm:max-w-98  pb-20 text-left"
        >
        Every project is a footprint of the process.<br/> From broad layout to the finest pixel 
        </p>
        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={400}
          className="absolute inset-0 opacity-30 scale-150 top-[-50%]  left-[-18%] max-sm:top-[-20%] max-sm:scale-125 z-200 object-contain testing-test-altra"
          height={400}
        />
      </section>
    </div>
  );
};

export default Recent;