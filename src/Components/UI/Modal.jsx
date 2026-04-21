"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Carousel from "./Carousel";

// isNested = true when launched from ProjectViewer (shows "BACK TO GALLERY" label)
const Modal = ({ open, onClose, project, isNested = false }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loco = window.__loco;
    if (open) {
      document.body.style.overflow = "hidden";
      loco && loco.stop();
      setIsLoading(true);
      setImagesLoaded(false);
    } else {
      document.body.style.overflow = "";
      loco && loco.start();
    }
    return () => {
      document.body.style.overflow = "";
      loco && loco.start();
    };
  }, [open]);

  useEffect(() => {
    if (open && project) {
      const allImages = project.cover
        ? [project.cover, ...project.images]
        : project.images;
      let loadedCount = 0;
      const total = allImages.length;
      if (total === 0) {
        setImagesLoaded(true);
        setIsLoading(false);
        return;
      }
      allImages.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === total) {
            setImagesLoaded(true);
            setTimeout(() => setIsLoading(false), 100);
          }
        };
        img.src = src;
      });
    }
  }, [open, project]);

  useEffect(() => {
    if (open && !isLoading && imagesLoaded) {
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0.1, ease: "power2.inOut" }
      );
      tl.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power4.out" },
        "<"
      );
      const firstBg = contentRef.current.querySelectorAll(".text__first-bg");
      const word = contentRef.current.querySelectorAll(".text__word");

      tl.to(firstBg, { scaleX: 1, duration: 0.2, ease: "power2.inOut" })
        .to(word, { opacity: 1, duration: 0.1 }, "-=0.1")
        .to(firstBg, { scaleX: 0, duration: 0.2, ease: "power2.inOut" })
        .fromTo(
          ".project-date",
          { opacity: 0, filter: "blur(5px)" },
          { opacity: 0.6, duration: 0.5, filter: "blur(0px)" },
          "-=0.2"
        )
        .fromTo(
          ".carousel-img:nth-child(1)",
          { opacity: 0, y: -400, scale: 0.4, filter: "blur(20px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power3.out",
          },
          "-=0.1"
        )
        
    }
  }, [open, isLoading, imagesLoaded]);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3 }, "<");
  };

  if (!open || !project) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <style>{`
        .text__first { position:relative; display:inline-block; }
        .text__word { opacity:0; }
        .text__first-bg {
          display:block; width:100%; height:100%; position:absolute;
          left:0; top:0; z-index:100; transform-origin:right; transform:scaleX(0);
        }
        .text__first-bg { background:linear-gradient(to right,#fff,#898989); }
        { background:linear-gradient(to left,#fff,#898989); }
        .btn {
          position:relative; overflow:hidden; background-color:black; display:inline-block;
          border:2px solid rgb(144,146,148); transition:all 0.3s ease;
          padding:17px 72px; cursor:pointer; border-radius:12px;
          font-family:"Bebas Neue",cursive; letter-spacing:0.1rem; word-spacing:0.1rem;
        }
        @media(max-width:640px){ .btn{ padding:12px 40px; font-size:1rem; } }
        .btn:hover {
          box-shadow:1px 1px 25px 5px rgba(122,160,196,0.4);
          color:black; background-color:rgb(228,222,212);
          transition-duration:1.3s; transition-delay:0.09s;
        }
        
        .loader-spinner {
          border:3px solid rgba(255,255,255,0.1); border-top:3px solid white;
          border-radius:50%; width:50px; height:50px;
          animation:spin 1s linear infinite;
        }
        @keyframes spin{ 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

      <div
        ref={contentRef}
        className="relative min-h-[50vh] bg-[#0a0a0a]/80 rounded-2xl p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-12 items-start max-w-7xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close / Back button ── */}
        {isNested ? (
          // Back-to-gallery button (when opened from ProjectViewer)
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all duration-300 group cursor-pointer"
            aria-label="Back to gallery"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300"
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
                fontSize: "0.85rem",
                letterSpacing: "0.15rem",
              }}
            >
              GALLERY
            </span>
          </button>
        ) : (
          // Standard X close button
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 cursor-pointer flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

       
        {isLoading ? (
          <div className="flex items-center justify-center w-full min-h-[400px]">
            <div className="loader-spinner" />
          </div>
        ) : (
          <>
            {/* Left: Info */}
            <div className="flex-1 flex flex-col justify-center text-white space-y-3 sm:space-y-4 w-full md:max-w-[45%] order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug overflow-hidden">
                <span className="text__first">
                  <span className="text__word text-gradient">{project.title}</span>
                  <span className="text__first-bg" />
                </span>
              </h2>
              
              <p className="text-gray-400 text-sm sm:text-base project-date underline opacity-0">
                {project.date}
              </p>
            </div>

            {/* Right: Carousel */}
            <div className="flex-1 flex justify-center items-center w-full order-2 md:max-w-[55%]">
              <Carousel images={project.images} cover={project.cover} />
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;