"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAnimate from "@/Hooks/useAnimate";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// The hand-drawn signature, shared by the animated path and its blurred copy.
const SIGNATURE_D =
  "M-16.9136 489.299C-13.7043 477.36 -5.83596 467.019 1.39852 457.243C43.77 399.988 94.4031 349.142 146.141 300.466C235.078 216.791 328.218 136.876 425.213 62.6901C443.224 48.9141 468.997 30.0855 488.657 16.8407C493.638 13.4846 498.753 10.3267 503.898 7.22779C507.233 5.21897 513.309 -0.736034 514.741 2.88927C516.507 7.35998 511.638 12.0137 509.522 16.3273C498.984 37.8054 487.145 58.6916 474.575 79.0365C428.926 152.924 376.324 222.171 327.881 294.184C309.913 320.894 295.181 343.004 280.193 371.115C268.836 392.416 255.88 418.287 255.26 443.278C254.361 479.541 297.141 475.496 321.305 470.62C424.963 449.704 521.157 368.403 574.905 278.924C577.444 274.696 583.23 269.082 580.273 265.133C579.473 264.066 577.58 264.865 576.276 265.137C570.489 266.348 561.015 270.737 556.471 272.915C519.43 290.672 485.849 316.475 456.281 344.81C431.115 368.927 401.233 398.897 388.327 432.204C380.282 452.967 401.408 445.75 412.715 440.541C476.204 411.297 533.66 365.59 585.971 319.989C636.077 276.311 682.012 228.251 727.382 179.752C729.311 177.691 744.755 161.399 732.435 173.379C711.446 193.79 692.342 215.975 675.16 239.694C671.687 244.488 633.087 294.467 640.447 301.926C647.309 308.88 660.097 301.809 669.653 299.823C723.543 288.625 776.837 273.126 829.419 257.044C920.337 229.236 1009.59 196.465 1098.89 163.929C1099.35 163.76 1149.24 141.726 1150.06 150.066C1152.29 172.865 1150.33 197.066 1147.44 219.707C1145.34 236.216 1144.54 259.675 1167.46 258.417C1202.3 256.504 1238.33 234.155 1268.45 219.047C1339.63 183.338 1410.5 147.803 1485.42 120.354C1530.51 103.833 1581.51 84.119 1630.3 82.2506C1643.38 81.7496 1649.9 87.5531 1660.57 93.6864C1677.66 103.514 1696.98 102.138 1715.93 100.667";

export default function Hero() {
  const locationRef = useRef(null);
  const heroVisibleRef = useRef(true);
  const videoRef = useRef(null);
  const blurCanvasRef = useRef(null);
  const signatureRef = useRef(null);
  const signatureBlurRef = useRef(null);
  const heroTextBlurRef = useRef(null);
  const heroContainerRef = useRef(null);
  const locations = ["UAE", "UNITED STATES", "KSA", "EGYPT"];

  useEffect(() => {
    if (!locationRef.current) return;

    const locationElements =
      locationRef.current.querySelectorAll(".location-text");
    let currentIndex = 0;
    let timeoutId = null;

    // Set initial state - all hidden
    gsap.set(locationElements, { y: 100, opacity: 0 });

    const animateLocation = () => {
      const current = locationElements[currentIndex];
      const nextIndex = (currentIndex + 1) % locations.length;
      const next = locationElements[nextIndex];

      const tl = gsap.timeline();

      // Animate current out (up)
      tl.fromTo(
        current,
        { y: 0, opacity: 1, filter: "blur(0px)" },
        {
          y: -100,
          opacity: 0,
          duration: 0.5,
          filter: "blur(8px)",
          ease: "power2.in",
        }
      );

      // Animate next in (from bottom)
      tl.fromTo(
        next,
        { y: 100, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          filter: "blur(0px)",
        },
        "-=0.3"
      );

      currentIndex = nextIndex;
      timeoutId = setTimeout(tick, 2000);
    };

    // Don't keep swapping (blurred) text while nobody can see it.
    const tick = () => {
      if (document.hidden || !heroVisibleRef.current) {
        timeoutId = setTimeout(tick, 2000);
        return;
      }
      animateLocation();
    };

    // Function to start the location animation loop
    const startLocationAnimation = () => {
      // Show first location
      gsap.to(locationElements[0], {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      // Start animation loop after a brief delay
      timeoutId = setTimeout(tick, 2000);
    };
    // Expose the start function globally so it can be triggered after signature
    window.startLocationAnimation = startLocationAnimation;

    return () => {
      clearTimeout(timeoutId);
      delete window.startLocationAnimation;
    };
  }, [locations.length]);

  // Animation sequence handler
  useEffect(() => {
    // Set initial hidden state for ABBAS text only
    const heroText = document.querySelector("#hero-text");

    if (heroText) {
      gsap.set(heroText, {
        opacity: 0,
        filter: "blur(4px)",
      });
    }

    // Wait for preloader to finish
    const checkPreloader = setInterval(() => {
      if (window.__preloaderDone) {
        clearInterval(checkPreloader);

        // Start video playback when preloader is done
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.log("Video autoplay failed:", err);
          });
        }

        // Start animation sequence after 200ms
        setTimeout(() => {
          startAnimationSequence();
        }, 200);
      }
    }, 100);

    return () => {
      clearInterval(checkPreloader);
    };
  }, []);

  // Animation sequence function
  const startAnimationSequence = () => {
    const tl = gsap.timeline();
    const path = document.querySelector("#pathToAnimate1");

    

    // 1. Fade in ABBAS text from blur
    tl.fromTo(
      "#hero-text",
      {
        opacity: 0,
        filter: "blur(4px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          // Removes the will-change CSS property after the animation finishes
          if (heroContainerRef.current) {
            heroContainerRef.current.style.willChange = "auto";
          }
        },
      }
    );

    // 2. Animate signature
    if (path) {
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        visibility: "visible",
      });

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 3,
          ease: "power2.out",
        },
        "-=0.5"
      );
    }

    tl.call(() => {
      if (window.startLocationAnimation) {
        window.startLocationAnimation();
      }
    });
  };

  useAnimate(() => {
    const hero = document.querySelector(".hero-pin");
    const about = document.querySelector("#about");

    // Set initial state for hero text - hidden
    gsap.set("#hero-text", {
      opacity: 0,
      filter: "blur(4px)",
    });

    // Pin animation
    if (!hero || !about) return;

    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        hero.style.willChange = "transform";
      },
      onLeave: () => {
        heroVisibleRef.current = false;
        // Clean up will-change after pin — frees GPU compositing layer
        hero.style.willChange = "auto";
        // Pause the video when hero is fully scrolled past
        if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      onEnterBack: () => {
        heroVisibleRef.current = true;
        hero.style.willChange = "transform";
        // Resume video when scrolling back up
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      },
      onLeaveBack: () => {
        hero.style.willChange = "auto";
      },
    });

    // Hero blurs out as About slides over it. This used to be a full-screen
    // backdrop-filter: blur() layer with its opacity scrubbed — fading it was
    // cheap, but the blur itself was recomputed at full resolution for every
    // frame of the playing video. Instead, the video is drawn (pre-blurred)
    // into a small 320×180 canvas that CSS stretches over the hero; stretching
    // a tiny image *is* a blur. Its opacity is scrubbed exactly as before.
    const video = videoRef.current;
    const canvas = blurCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    let blurVisible = false;
    let running = true;
    let frameId = null;

    const drawBlur = () => {
      if (ctx && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };
    if (ctx) {
      // 2px here ≈ the old 12px once the 320px canvas is stretched to the
      // screen. "high" averages pixels when shrinking the 1280px video
      // (instead of sampling a few), so the blur doesn't shimmer.
      ctx.filter = "blur(2px)"; // ignored where unsupported; the stretch still blurs
      ctx.imageSmoothingQuality = "high";
    }

    // Redraw only when the video actually shows a new frame (~25fps), and
    // only while the blur layer is visible.
    const hasVideoFrameCallback = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    const scheduleDraw = () => {
      frameId = hasVideoFrameCallback
        ? video.requestVideoFrameCallback(onVideoFrame)
        : requestAnimationFrame(onVideoFrame);
    };
    const onVideoFrame = () => {
      if (!running) return;
      if (blurVisible) drawBlur();
      scheduleDraw();
    };
    if (ctx) scheduleDraw();

    // The old blur layer sat above everything in the hero, so ABBAS and the
    // signature blurred too. They get the same trick: a pre-blurred copy
    // cross-fades in while the sharp one fades out — opacity only.
    // Blur radius = the old backdrop-blur-md's 12px, in each SVG's units.
    const matchBlurRadius = () => {
      for (const [wrap, vbW, vbH] of [
        [heroTextBlurRef.current, 500, 160],
        [signatureBlurRef.current, 1718, 491],
      ]) {
        const svg = wrap?.querySelector("svg");
        if (!svg?.clientWidth) continue;
        const scale = Math.min(svg.clientWidth / vbW, svg.clientHeight / vbH);
        svg.querySelector("feGaussianBlur").setAttribute("stdDeviation", (12 / scale).toFixed(2));
      }
    };
    matchBlurRadius();

    const recede = gsap.timeline({
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onRefresh: matchBlurRadius,
      },
      onUpdate: () => {
        const visible = recede.progress() > 0;
        if (visible && !blurVisible) drawBlur(); // fresh frame before it fades in
        blurVisible = visible;
      },
    });
    // Blur layers use GSAP's default ease (power1.out), like the original
    // tween — the blur builds quickly at the start of the scroll.
    // The sharp copies fade on the exact same curve. For ABBAS, plus-lighter
    // (see the JSX) makes the two always sum to one solid image; the
    // signature is a thin line, so a plain cross-fade already looks right.
    recede
      .to([canvas, heroTextBlurRef.current, signatureBlurRef.current], { opacity: 1, ease: "power1.out" }, 0)
      .to([heroContainerRef.current, signatureRef.current], { opacity: 0, ease: "power1.out" }, 0);

    return () => {
      running = false;
      if (frameId == null) return;
      if (hasVideoFrameCallback) video.cancelVideoFrameCallback(frameId);
      else cancelAnimationFrame(frameId);
    };
  });

  return (
    <section
      className="hero-section hero-pin relative h-screen w-full overflow-hidden ">
      <div className="absolute inset-0 hero-media pointer-events-none ">
        {/* preload="auto" so it buffers during the ~7s preloader instead of
            starting cold (and stalling) on slow connections. The MP4 is for
            Safari/iOS versions that can't play WebM. */}
        <video
          ref={videoRef}
          aria-hidden="true"
          width={1280}
          height={720}
          loop={true}
          muted
          playsInline
          preload="auto"
          poster="/HeroImages/vidfinal.webp"
          className="object-cover w-full h-full "
        >
          <source src="/HeroImages/finalvidw.webm" type="video/webm" />
          <source src="/HeroImages/finalvidw.mp4" type="video/mp4" />
        </video>
        {/* Blurred copy of the video for the scroll blur (see useAnimate). */}
        <canvas
          ref={blurCanvasRef}
          width={320}
          height={180}
          aria-hidden="true"
          className="absolute overlay-blur-pin inset-0 w-full h-full object-cover opacity-0"
        />
        {/* overlay(s) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-[#434343]/40" />
      </div>

      <div ref={signatureRef} className="absolute inset-0 -rotate-8 top-12 left-30 z-99 mix-blend-exclusion max-sm:inset-0 max-sm:left-10 max-sm:top-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 1718 491"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          role="img"
          className="w-[84%] max-sm:w-[120%]"
        >
          <g>
            <path
              d={SIGNATURE_D}
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              id="pathToAnimate1"
              style={{ visibility: "hidden" }}
            ></path>
          </g>
        </svg>
      </div>

      {/* Pre-blurred copy of the signature for the scroll blur. The blur is
          baked in when it's first drawn; scrolling only changes opacity. */}
      <div
        ref={signatureBlurRef}
        aria-hidden="true"
        className="absolute inset-0 -rotate-8 top-12 left-30 z-99 mix-blend-exclusion max-sm:inset-0 max-sm:left-10 max-sm:top-40 opacity-0 pointer-events-none will-change-[opacity]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 1718 491"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          className="w-[84%] max-sm:w-[120%]"
        >
          <filter id="signatureBlur" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          <path
            d={SIGNATURE_D}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#signatureBlur)"
          />
        </svg>
      </div>

      {/* Sharp and pre-blurred ABBAS cross-fade inside this isolated group.
          plus-lighter makes (1−α)·sharp + α·blurred add up exactly, so the
          letters stay solid mid-way instead of turning see-through. */}
      <div className="absolute inset-0 z-30 isolate">
        <div
          className="relative z-30 flex flex-col items-center justify-center h-full pt-5 hero max-sm:top-11 mix-blend-plus-lighter"
          style={{ willChange: "filter" }}
          ref={heroContainerRef}
        >
          <svg
            role="img"
            aria-label="Abbas — photography"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 160"
            width={"100%"}
            height={"100%"}
            preserveAspectRatio="xMidYMid meet"
            className={"text-[20vw] z-40"}
          >
            <defs>
              <linearGradient id="serifGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#D7D7D7" />
                <stop offset="1" stopColor="#68A1B7" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="6"
                  floodColor="#000000"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            <g filter="url(#shadow)">
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                style={{ fontFamily: '"Work Sans", sans-serif' }}
                fontWeight="700"
                fontSize="92"
                fill="url(#serifGrad)"
                letterSpacing="-2"
                className="select-none h-text"
                id="hero-text"
              >
                ABBAS
              </text>
            </g>
          </svg>

          {/* Location Animation Component */}
          <div className="absolute bottom-20 max-sm:bottom-30 left-0 right-0 flex justify-center  ">
            <div
              ref={locationRef}
              className="relative h-24 w-full max-w-[520px] overflow-hidden  "
            >
              {locations.map((location) => (
                <div
                  key={location}
                  className="location-text absolute inset-0 flex items-center justify-center z-10 "
                >
                  <span className="text-white/90 text-2xl font-light tracking-[0.3em] max-sm:text-lg max-sm:tracking-[0.2em] ">
                    {location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pre-blurred copy of ABBAS, laid out exactly like the container above
            (same flex box, padding and mobile offset). */}
        <div
          ref={heroTextBlurRef}
          aria-hidden="true"
          className="absolute inset-0 z-30 flex flex-col items-center justify-center h-full pt-5 max-sm:top-11 opacity-0 pointer-events-none will-change-[opacity] mix-blend-plus-lighter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 160"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            className="text-[20vw]"
          >
            <filter id="heroTextBlur" x="-20%" y="-80%" width="140%" height="260%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <g filter="url(#heroTextBlur)">
              <g filter="url(#shadow)">
                <text
                  x="50%"
                  y="65%"
                  textAnchor="middle"
                  style={{ fontFamily: '"Work Sans", sans-serif' }}
                  fontWeight="700"
                  fontSize="92"
                  fill="url(#serifGrad)"
                  letterSpacing="-2"
                  className="select-none"
                >
                  ABBAS
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
