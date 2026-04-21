"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";
import Modal from "./Modal";

// ---------------------------------------------------------------------------
// Cloudinary helpers
// ---------------------------------------------------------------------------

/**
 * Injects Cloudinary transformation params into a Cloudinary URL.
 * Works with versioned (/v123456/) and non-versioned URLs.
 *
 * @param {string} url   – original Cloudinary URL
 * @param {string} tfms  – transformation string e.g. "w_1200,q_auto,f_auto"
 */
function cloudinaryTransform(url, tfms) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/${tfms}/`);
}

/** Thumbnail used in the masonry grid — sized to the largest column width you'll ever render */
const THUMB_TFMS = "w_800,q_auto,f_auto,c_limit";

/** Full-res used when the lightbox / Modal opens the image */
const FULL_TFMS = "w_2400,q_auto,f_auto,c_limit";

// ---------------------------------------------------------------------------
// Responsive column count hook
// ---------------------------------------------------------------------------

function useColumns() {
  const getCount = () => {
    if (typeof window === "undefined") return 2;
    const w = window.innerWidth;
    if (w >= 1280) return 5;
    if (w >= 1024) return 4;
    if (w >= 640) return 3;
    return 2;
  };

  const [cols, setCols] = useState(getCount);

  useEffect(() => {
    function onResize() {
      setCols(getCount());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return cols;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ProjectViewer = ({ open, project, onClose }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const loaderRef = useRef(null);
  const centerTitleRef = useRef(null);
  const headerTitleRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadedCountRef = useRef(0);
  const totalRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const cols = useColumns();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open && project) {
      setAllLoaded(false);
      loadedCountRef.current = 0;
      setLoadedCount(0);
      const imgs = project.cover
        ? [project.cover, ...project.images]
        : project.images;
      totalRef.current = imgs.length;

      if (loaderRef.current)
        gsap.set(loaderRef.current, {
          opacity: 1,
          scale: 1,
          clearProps: "none",
        });
      if (contentRef.current)
        gsap.set(contentRef.current, { opacity: 0, y: 0 });
      if (centerTitleRef.current)
        gsap.set(centerTitleRef.current, {
          opacity: 0,
          filter: "blur(40px)",
          scale: 1.1,
          willChange: "transform, filter",
        });
      if (headerTitleRef.current)
        gsap.set(headerTitleRef.current, { opacity: 0, filter: "blur(12px)" });
    }
  }, [open, project]);

  useEffect(() => {
    const loco = window.__loco;
    if (open) {
      document.body.style.overflow = "hidden";
      loco?.stop();
    } else {
      document.body.style.overflow = "";
      loco?.start();
    }
    return () => {
      document.body.style.overflow = "";
      loco?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !overlayRef.current) return;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [open]);

  useEffect(() => {
    if (!allLoaded) return;

    const tl = gsap.timeline();

    tl.to(loaderRef.current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.3,
      ease: "power2.in",
    });

    tl.to(
      centerTitleRef.current,
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.1"
    );

    tl.to(centerTitleRef.current, {
      opacity: 0,
      filter: "blur(30px)",
      scale: 0.95,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () =>
        gsap.set(centerTitleRef.current, { willChange: "auto" }),
      delay: 0.55,
    });

    tl.fromTo(
      contentRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
      "-=0.2"
    );

    tl.to(
      headerTitleRef.current,
      { opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
      "-=0.2"
    );

    const items = contentRef.current.querySelectorAll(".viewer-img-item");
    if (items.length > 0) {
      const masonry = contentRef.current.querySelector(".masonry-grid-track");

      gsap.set(masonry, {
        willChange: "transform, filter",
      });

      tl.fromTo(
        items,
        { opacity: 0, scale: 0.95, filter: "blur(8px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: { amount: 0.5, from: "random" },
          ease: "power3.out",
          onComplete: () => {
            // Release the layer once animation is done
            gsap.set(masonry, { willChange: "auto" });
          },
        },
        "-=0.3"
      );
    }
  }, [allLoaded]);

  const handleImageLoad = useCallback(() => {
    loadedCountRef.current += 1;
    setLoadedCount(loadedCountRef.current);
    if (loadedCountRef.current >= totalRef.current) {
      setAllLoaded(true);
    }
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3 }, "<");
  };

  const handleImageClick = (idx, allImages) => {
    // Pass full-res URLs to the modal so the lightbox always gets crisp images
    const toFullRes = (src) => cloudinaryTransform(src, FULL_TFMS);

    const reordered = {
      ...project,
      cover: toFullRes(allImages[idx]),
      images: [
        ...allImages.slice(idx + 1).map(toFullRes),
        ...allImages.slice(0, idx).map(toFullRes),
      ],
    };
    setModalProject(reordered);
    setModalOpen(true);
  };

  if (!mounted || !open || !project) return null;

  const allImages = project.cover
    ? [project.cover, ...project.images]
    : project.images;

  const progress =
    totalRef.current > 0
      ? Math.round((loadedCount / totalRef.current) * 100)
      : 0;

  // Responsive sizes string matches the useColumns hook breakpoints
  const thumbSizes = [
    "(max-width: 639px) 48vw",
    "(max-width: 1023px) 32vw",
    "(max-width: 1279px) 25vw",
    "20vw",
  ].join(", ");

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      {/* ── Loader ── */}
      <div
        ref={loaderRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 pointer-events-none"
      >
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/8" />
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 animate-spin"
            style={{ animationDuration: "1.1s" }}
            viewBox="0 0 96 96"
            fill="none"
          >
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="url(#spinner-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="80 200"
            />
            <defs>
              <linearGradient id="spinner-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="text-white/70 tabular-nums"
            style={{
              fontFamily: "'Bebas Neue', serif",
              fontSize: "1.4rem",
              letterSpacing: "0.05rem",
            }}
          >
            {progress}%
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <span
            className="text-white tracking-[0.25rem] text-base"
            style={{ fontFamily: "'Bebas Neue', serif" }}
          >
            {project.title}
          </span>
          <span className="text-white/30 tracking-[0.2rem] text-[0.65rem]">
            LOADING {allImages.length} PHOTOS
          </span>
        </div>

        <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Big centered title ── */}
      <div
        ref={centerTitleRef}
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0, filter: "blur(40px)" }}
      >
        <h1
          className="text-gradient text-center px-6 leading-none select-none"
          style={{
            fontFamily: "'Bebas Neue', serif",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            letterSpacing: "0.15em",
          }}
        >
          {project.title}
        </h1>
      </div>

      {/* ── Grid ── */}
      <div
        ref={contentRef}
        className="w-full h-full flex flex-col"
        style={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-4 sm:px-8 pt-20 pb-4 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300 group cursor-pointer"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Bebas Neue', serif",
                letterSpacing: "0.2rem",
                fontSize: "1rem",
              }}
            >
              BACK
            </span>
          </button>

          <span className="h-4 w-px bg-white/20 shrink-0" />

          <h2
            ref={headerTitleRef}
            className="text-gradient truncate"
            style={{
              fontFamily: "'Bebas Neue', serif",
              fontSize: "1.3rem",
              letterSpacing: "0.2rem",
              opacity: 0,
              filter: "blur(12px)",
            }}
          >
            {project.title}
          </h2>

          <span
            className="text-white/30 ml-auto shrink-0 tracking-widest"
            style={{ fontSize: "0.75rem" }}
          >
            {allImages.length} PHOTOS
          </span>
        </div>

        {/* Masonry grid */}
        <div className="viewer-scroll flex-1 overflow-y-auto p-2 sm:p-3">
          <div
            style={{ columnCount: cols, columnGap: "8px" }}
            className="masonry-grid-track"
          >
            {allImages.map((src, idx) => (
              <div
                key={idx}
                className="viewer-img-item group cursor-pointer relative overflow-hidden rounded-sm border border-white/5 mb-2"
                style={{ breakInside: "avoid" }}
                onClick={() => handleImageClick(idx, allImages)}
              >
                <Image
                  src={cloudinaryTransform(src, THUMB_TFMS)}
                  alt={`${project.title} ${idx + 1}`}
                  width={0}
                  height={0}
                  sizes={thumbSizes}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  className="group-hover:scale-105 transition-all duration-500 ease-out"
                  onLoad={handleImageLoad}
                  onError={handleImageLoad}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 3h6m0 0v6m0-6L10 14M4 4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-5"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span
                    className="text-white/60 text-[0.6rem] tracking-widest"
                    style={{ fontFamily: "'Bebas Neue', serif" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        project={modalProject}
        onClose={() => setModalOpen(false)}
        isNested
      />
    </div>,
    document.body
  );
};

export default ProjectViewer;
