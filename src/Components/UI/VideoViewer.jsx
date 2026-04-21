"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const VideoViewer = ({ open, project, onClose }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const loaderRef = useRef(null);
  const centerTitleRef = useRef(null);
  const headerTitleRef = useRef(null);
  const videoWrapRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open && project) {
      setVideoReady(false);
      setLoadProgress(0);

      if (loaderRef.current)
        gsap.set(loaderRef.current, { opacity: 1, scale: 1, clearProps: "none" });
      if (contentRef.current)
        gsap.set(contentRef.current, { opacity: 0, y: 0 });
      if (centerTitleRef.current)
        gsap.set(centerTitleRef.current, { opacity: 0, filter: "blur(40px)", scale: 1.1 });
      if (headerTitleRef.current)
        gsap.set(headerTitleRef.current, { opacity: 0, filter: "blur(12px)" });
      if (videoWrapRef.current)
        gsap.set(videoWrapRef.current, { opacity: 0, scale: 0.97 });
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
    if (!videoReady) return;

    const tl = gsap.timeline();

    tl.to(loaderRef.current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.3,
      ease: "power2.in",
    });

    tl.to(
      centerTitleRef.current,
      { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.7, ease: "power3.out" },
      "-=0.1"
    );

    tl.to(centerTitleRef.current, {
      opacity: 0,
      filter: "blur(30px)",
      scale: 0.95,
      duration: 0.5,
      ease: "power2.in",
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

    tl.fromTo(
      videoWrapRef.current,
      { opacity: 0, scale: 0.97, filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out" },
      "-=0.3"
    );
  }, [videoReady]);

  const handleVideoCanPlay = useCallback(() => {
    setVideoReady(true);
  }, []);

  const handleVideoProgress = useCallback((e) => {
    const video = e.target;
    if (video.duration && video.buffered.length > 0) {
      const buffered = video.buffered.end(video.buffered.length - 1);
      setLoadProgress(Math.min(Math.round((buffered / video.duration) * 100), 99));
    }
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, { y: 30, opacity: 0, duration: 0.25, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3 }, "<");
  };

  if (!mounted || !open || !project) return null;

  const displayProgress = videoReady ? 100 : loadProgress;

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
              cx="48" cy="48" r="44"
              stroke="url(#vid-spinner-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="80 200"
            />
            <defs>
              <linearGradient id="vid-spinner-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="text-white/70 tabular-nums"
            style={{ fontFamily: "'Bebas Neue', serif", fontSize: "1.4rem", letterSpacing: "0.05rem" }}
          >
            {displayProgress}%
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
            LOADING VIDEO
          </span>
        </div>

        <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>

      {/* ── Cinematic title intro ── */}
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

      {/* ── Main content ── */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span style={{ fontFamily: "'Bebas Neue', serif", letterSpacing: "0.2rem", fontSize: "1rem" }}>
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

          {project.durtaion && (
            <span className="text-white/30 ml-auto shrink-0 tracking-widest" style={{ fontSize: "0.75rem" }}>
              {project.durtaion}
            </span>
          )}
        </div>

        {/* Video area */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-4 sm:p-8">
          <div
            ref={videoWrapRef}
            className="w-full max-w-5xl rounded-2xl overflow-hidden border border-white/10"
            style={{ opacity: 0 }}
          >
            <video
              key={project.videoURL}
              src={project.videoURL}
              poster={project.thummnail}
              controls
              autoPlay
              playsInline
              className="w-full h-auto block bg-black"
              onCanPlay={handleVideoCanPlay}
              onProgress={handleVideoProgress}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 sm:px-8 py-4 border-t border-white/10 bg-black/30 backdrop-blur-md flex items-center gap-4">
          <span
            className="text-white/20 text-[0.65rem] tracking-[0.25rem]"
            style={{ fontFamily: "'Bebas Neue', serif" }}
          >
            {project.title}
          </span>
          {project.description && (
            <>
              <span className="h-3 w-px bg-white/10 shrink-0" />
              <p className="text-white/30 text-xs tracking-wider truncate">
                {project.description}
              </p>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VideoViewer;