"use client";
import React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import "./styles.css";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";
import useAnimate from "@/Hooks/useAnimate";

gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

const Recent = () => {
  // useAnimate waits for the preloader and creates these triggers in page
  // order with the other sections, and reverts everything on unmount
  // (the old useEffect never reverted its gsap.context).
  useAnimate(() => {
    // ── Cache all DOM refs once ──────────────────────────────────
    const contEl       = document.querySelector(".cont");
    const marqImagesEl = document.querySelector(".marq-images");
    const hsWrapper    = document.querySelector(".horizontal-scroll-wrapper");
    const originalImg  = document.querySelector(".marq-img.pin img");

    // The whole section is display:none on phones — don't build pins
    // and per-frame work for something that isn't rendered.
    if (!contEl || getComputedStyle(contEl).display === "none") return;

    // Most of these images start 2–3 screen-widths off to the side (the
    // horizontal slides, the far end of the marquee). Native lazy-loading
    // only fetched them once they slid into view, so they popped in late.
    contEl.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = "eager";
    });

    const lightColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--light")
      .trim();
    const darkColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--dark")
      .trim();

    // ── QuickSetters — zero thrash per frame ─────────────────────
    const setContBg   = gsap.quickSetter(contEl,    "backgroundColor");
    const setWrapperX = gsap.quickSetter(hsWrapper, "x", "%");
    const setMarqX    = gsap.quickSetter(marqImagesEl, "x", "%");

    // ── Colour interpolator ──────────────────────────────────────
    const interpolateBg = gsap.utils.interpolate(lightColor, darkColor);
    let lastBg = null;
    const setBg = (c) => {
      if (c !== lastBg) setContBg((lastBg = c));
    };

    // ── remap helper (clamps 0→1) ────────────────────────────────
    const remap = (val, lo, hi) =>
      Math.min(1, Math.max(0, (val - lo) / (hi - lo)));

    // ── Text-split animations ────────────────────────────────────
    // Per-letter blur is expensive when each letter is repainted every
    // frame. Promoting the pieces to their own GPU layers only while their
    // trigger is active lets the compositor apply the blur instead, and
    // drops the layers again once the text is off screen.
    const firstSplit  = new SplitText(".firstanimatetext",  { type: "chars" });
    const secondSplit = new SplitText(".secondanimatetext", { type: "words" });
    const promoteWhileActive = (els) => (self) =>
      gsap.set(els, { willChange: self.isActive ? "transform, filter" : "auto" });

    gsap.fromTo(
      firstSplit.chars,
      { color: "#A9A9A9", filter: "blur(4px)", x: 10, y: 10 },
      {
        y: 0, x: 0, color: "#101010", filter: "blur(0px)",
        stagger: 0.05,
        scrollTrigger: {
          trigger: "#recent-section",
          start: "top bottom-=15%",
          end: "bottom bottom+=140%",
          scrub: 1,
          onToggle: promoteWhileActive(firstSplit.chars),
        },
      }
    );

    gsap.fromTo(
      secondSplit.words,
      { color: "#708090", filter: "blur(4px)", x: 10, y: 10 },
      {
        y: 0, x: 0, color: "#edf1e8", filter: "blur(0px)",
        stagger: 0.05,
        scrollTrigger: {
          trigger: ".outro",
          start: () =>
            window.innerWidth < 768 ? "top bottom-=180%" : "top bottom-=430%",
          end: () =>
            window.innerWidth < 768 ? "bottom bottom-=190%" : "bottom bottom-=440%",
          scrub: 1,
          onToggle: promoteWhileActive(secondSplit.words),
        },
      }
    );

    // ── Marq parallax ────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: ".marq",
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => setMarqX(-75 + self.progress * 25),
    });

    // ── Slide content timelines ──────────────────────────────────
    const SLIDE_WINDOWS = [
      [0.06, 0.36],
      [0.40, 0.70],
      [0.73, 1.00],
    ];

    const slides = gsap.utils.toArray(
      ".horizontal-slide:not(.horizontal-spacer)"
    );

    const slideTLs = slides.map((slide) => {
      const title = slide.querySelector(".production-title");
      const text  = slide.querySelector(".production-text");

      const tl = gsap.timeline({ paused: true });

      tl.fromTo(
        title,
        { y: 55, opacity: 0, filter: "blur(12px)" },
        {
          y: 0, opacity: 1, filter: "blur(0px)",
          duration: 1, ease: "power3.out",
          onStart: () => { if (title) title.style.willChange = "transform, filter"; },
          onComplete: () => { if (title) title.style.willChange = "auto"; },
        },
        0
      )
      .fromTo(
        text,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power2.out" },
        0.22
      );

      return tl;
    });

    // ── Clone management ─────────────────────────────────────────
    // The clone used to be created at the exact moment it was needed;
    // a fresh <img> decodes asynchronously, so for a few frames neither
    // it nor the (already hidden) original was painted — the "missing
    // image" glitch. Now it's built and decoded up front, shown first,
    // and the original is hidden only on the following frame.
    let cloneActive = false;
    let flipAnim    = null;
    let flipCreated = false;

    const clone = originalImg ? originalImg.cloneNode(true) : null;
    if (clone) {
      clone.removeAttribute("loading");
      gsap.set(clone, {
        position: "fixed",
        margin: 0,
        transformOrigin: "center center",
        pointerEvents: "none",
        zIndex: 100,
        visibility: "hidden",
      });
      document.body.appendChild(clone);
      clone.decode?.().catch(() => {});
    }
    const setCloneX = clone ? gsap.quickSetter(clone, "x", "%") : null;

    // Lay the clone exactly over the original. getBoundingClientRect()
    // of the tilted image is its (larger) axis-aligned box, so use the
    // box's centre plus the image's own untransformed size.
    function placeCloneOnOriginal() {
      const rect = originalImg.getBoundingClientRect();
      const w = originalImg.offsetWidth;
      const h = originalImg.offsetHeight;
      // The clone is reused, and a Flip that was stopped part-way leaves its
      // own x/y/scale on it — that leftover offset is what made the image
      // land below its slot when re-entering the section. Start clean.
      gsap.set(clone, { clearProps: "transform" });
      gsap.set(clone, {
        left:   rect.left + rect.width  / 2 - w / 2,
        top:    rect.top  + rect.height / 2 - h / 2,
        width:  w,
        height: h,
        rotation: -5,
        transformOrigin: "center center",
      });
    }

    function createClone() {
      if (cloneActive || !clone) return;
      placeCloneOnOriginal();
      gsap.set(clone, { visibility: "visible", willChange: "transform" });
      cloneActive = true;
      flipCreated = false;
      requestAnimationFrame(() => {
        if (cloneActive) gsap.set(originalImg, { opacity: 0 });
      });
    }

    function removeClone() {
      if (!cloneActive) return;
      flipAnim?.kill();
      flipAnim    = null;
      flipCreated = false;
      gsap.set(originalImg, { opacity: 1 });
      gsap.set(clone, { visibility: "hidden", willChange: "auto" });
      cloneActive = false;
    }

    // ── Pin the horizontal section ───────────────────────────────
    ScrollTrigger.create({
      trigger: ".horizontal-scroll",
      start: "top top",
      end: () =>
        `+=${window.innerHeight * (window.innerWidth <= 768 ? 1.5 : 4)}`,
      pin: true,
    });

    // ── Clone enter / exit ───────────────────────────────────────
    ScrollTrigger.create({
      trigger: ".marq",
      start: "top top",
      onEnter:     createClone,
      onEnterBack: createClone,
      onLeaveBack: removeClone,
    });

    // ── Main orchestration trigger ───────────────────────────────
    ScrollTrigger.create({
      trigger: ".horizontal-scroll",
      start: "top 50%",
      end: () =>
        `+=${window.innerHeight * (window.innerWidth <= 768 ? 2 : 4.5)}`,

      onUpdate: (self) => {
        const progress = self.progress;

        setBg(progress < 0.05
          ? interpolateBg(progress / 0.05)
          : darkColor
        );

        // — Phase 1: Flip expand (0 → 0.2) —
        if (progress <= 0.2) {
          if (!flipCreated && clone && cloneActive) {
            const state = Flip.getState(clone);
            gsap.set(clone, {
              left: "0px", top: "0px",
              width: "100%", height: "100svh",
              rotation: 0, x: "0%",
            });
            flipAnim    = Flip.from(state, { duration: 1, ease: "none", paused: true });
            flipCreated = true;
          }
          if (flipAnim) flipAnim.progress(progress / 0.2);
          setWrapperX(0);
        }

        // — Phase 2: Horizontal scroll (0.2 → 0.95) —
        else if (progress <= 0.95) {
          if (flipAnim) flipAnim.progress(1);

          const hp = (progress - 0.2) / 0.75;
          setWrapperX(-75 * hp);
          if (setCloneX) setCloneX(-(75 / 100) * 4 * hp * 100);

          slideTLs.forEach((tl, i) => {
            const [lo, hi] = SLIDE_WINDOWS[i];
            tl.progress(remap(hp, lo, hi));
          });
        }

        // — Phase 3: Past end (> 0.95) —
        else {
          if (flipAnim) flipAnim.progress(1);
          setWrapperX(-75);
          if (setCloneX) setCloneX(-300);
          slideTLs.forEach((tl) => tl.progress(1));
        }
      },

      onLeaveBack: () => {
        flipAnim?.kill();
        flipAnim    = null;
        flipCreated = false;

        setBg(lightColor);
        setWrapperX(0);
        slideTLs.forEach((tl) => tl.progress(0));

        if (cloneActive) placeCloneOnOriginal();
      },
    });

    // The clone lives on <body>, outside anything context.revert() undoes.
    return () => {
      clone?.remove();
      if (originalImg) gsap.set(originalImg, { opacity: 1 });
    };
  });

  return (
    <div className="cont max-sm:hidden" id="recent-section">
      <section className="hero-2">
        <h1 className="h1-recent firstanimatetext max-sm:relative max-sm:max-w-99 text-left">
          <span className="!font-semibold">Shall we move from</span>
          <br />
          <span className="!font-semibold">words to visuals?</span>
          <br />
          <span className="sm:text-[3rem] text-[2rem]">Here's where the </span>{" "}
          <br className="sm:hidden" />
          <span className="sm:text-[3rem] text-[2rem]">vision </span>{""}
          <br className="hidden sm:block" />
          <span className="sm:text-[3rem] text-[2rem]">comes to life.</span>
        </h1>
      </section>

      <section className="marq">
        <div className="marq-wrapper">
          <div className="marq-images">
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={400} height={400} src="/Recent/A/pre3.webp" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={120} height={120} src="/Recent/A/pre4.webp" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={400} height={400} src="/Recent/A/pre3.webp" alt="marq-img" className="img-recent object-bottom" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={800} height={800} src="/Recent/A/pre3.webp" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={1600} height={900} src="/Recent/A/B/1.webp" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={1600} height={900} src="/Recent/A/B/2.JPG" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img pin">
              <Image sizes="100vw" width={1920} height={1080} src="/Recent/A/B/7.webp" alt="marq-img" priority className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={1600} height={900} src="/Recent/A/B/4.webp" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={1600} height={900} src="/Recent/A/B/5.webp" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={1600} height={900} src="/Recent/A/B/3.jpg" alt="marq-img" className="img-recent" style={{ objectPosition: "50% 90%" }}  />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={1600} height={900} src="/Recent/A/B/6.png" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={1600} height={900} src="/Recent/A/B/7.webp" alt="marq-img" className="img-recent" />
            </div>
            <div className="marq-img">
              <Image sizes="(max-width: 1000px) 45vw, 23vw" width={400} height={400} src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="marq-img" className="img-recent" />
            </div>
          </div>
        </div>
      </section>

      <section className="horizontal-scroll">
        <div className="horizontal-scroll-wrapper">
          <div className="horizontal-slide horizontal-spacer" />

          {/* Pre-Production */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content">
                <h2 className="production-title">PRE-PRODUCTION</h2>
                <p className="production-text">
                  Where strategy gets a spine. We tear down your brief, rebuild
                  it from the ground up, and forge a visual treatment that
                  dictates the tone, texture, and tension of the entire campaign.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="img-stack">
                <Image sizes="(max-width: 1000px) 100vw, 27vw" width={1920} height={1080} src="/Recent/A/B/pt2.webp"   alt="Pre-production"   className="img-recent" />
                <Image sizes="(max-width: 1000px) 100vw, 27vw" width={1920} height={1080} src="/Recent/A/B/recrec.webp" alt="Pre-production"   className="img-recent max-sm:hidden" />
                <Image sizes="(max-width: 1000px) 100vw, 27vw" width={1920} height={1080} src="/Recent/A/B/rec.webp"    alt="Pre-production"   className="img-recent" />
              </div>
            </div>
          </div>

          {/* Production */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content">
                <h2 className="production-title">PRODUCTION</h2>
                <p className="production-text">
                  The executed principle. Working within this defined system, we
                  generate the raw assets. The environment is managed, the detail
                  attended to, ensuring the principle is rendered as material.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="img-stack !w-full">
                <Image sizes="(max-width: 1000px) 100vw, 40vw" width={1920} height={1080} src="/Recent/A/B/3CROP.jpg" alt="Production" className="img-recent" />
                <Image sizes="(max-width: 1000px) 100vw, 40vw" width={1920} height={1080} src="/Recent/A/B/6.png"     alt="Production" className="img-recent" />
              </div>
            </div>
          </div>

          {/* Post-Production */}
          <div className="horizontal-slide">
            <div className="col">
              <div className="production-content">
                <h2 className="production-title text-nowrap">POST-PRODUCTION</h2>
                <p className="production-text">
                  The work is launched into the cultural stream. Finalized with a
                  critical eye, it is placed in influential media and scaled for
                  public impact, beginning its dialogue.
                </p>
              </div>
            </div>
            <div className="col post-production-images">
              <div className="img-stack">
                <Image sizes="(max-width: 1000px) 100vw, 27vw" width={1920} height={1080} src="/Recent/A/B/4.webp" alt="Post-production 1" className="img-recent" />
                <Image sizes="(max-width: 1000px) 100vw, 27vw" width={1920} height={1080} src="/Recent/A/B/5.webp" alt="Post-production 2" className="img-recent" />
                <Image sizes="(max-width: 1000px) 100vw, 27vw" width={1920} height={1080} src="/Recent/A/B/1.webp" alt="Post-production 3" className="img-recent max-sm:hidden" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <p className="h1-recent secondanimatetext max-sm:relative md:w-[950px] max-sm:max-w-98 pb-20 text-left">
          <span className="sm:font-semibold sm:text-nowrap">
            Every project is a footprint of the process.
          </span>
          <br />
          <span className="sm:text-[2.8rem]">
            From broad layout to the finest pixel
          </span>
        </p>
        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={400}
          height={400}
          className="absolute inset-0 opacity-30 scale-150 top-[-50%] left-[-18%] max-sm:top-[-20%] max-sm:scale-125 z-200 object-contain testing-test-altra"
        />
      </section>
    </div>
  );
};

export default Recent;