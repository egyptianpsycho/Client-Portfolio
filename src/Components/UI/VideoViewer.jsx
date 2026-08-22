"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Hls from "hls.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isEmbeddable(url) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}
function toEmbedUrl(url) {
  if (/youtu\.be\/([^?&]+)/.test(url)) {
    const id = url.match(/youtu\.be\/([^?&]+)/)[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (/youtube\.com\/watch\?v=/.test(url)) {
    const id = url.match(/v=([^&]+)/)[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (/vimeo\.com\/(\d+)/.test(url)) {
    const id = url.match(/vimeo\.com\/(\d+)/)[1];
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return url;
}
function fmt(s) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <rect x="5" y="3" width="4" height="18" rx="1" />
      <rect x="15" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
function IconVolume() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconMute() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line
        x1="23"
        y1="9"
        x2="17"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="9"
        x2="23"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconFullscreen() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-4 h-4"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}
function IconExitFullscreen() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-4 h-4"
    >
      <path d="M8 3v3a1 1 0 0 1-1 1H3M16 3v3a1 1 0 0 0 1 1h3M21 16h-3a1 1 0 0 0-1 1v3M3 16h3a1 1 0 0 1 1 1v3" />
    </svg>
  );
}
function IconLoader() {
  return (
    <svg
      className="animate-spin w-10 h-10 text-white/60"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Custom Animated Play/Pause Button ───────────────────────────────────────

function ThemedPlayPause({ isPlaying }) {
  return (
    <button
      className="play-pause-btn pointer-events-none max-sm:scale-75 text-primary"
      type="button"
      aria-label={isPlaying ? "Pause" : "Play"}
      data-playing={isPlaying}
    >
      <svg
        className="play-pause-btn__svg"
        viewBox="0 0 100 100"
        width="80px"
        height="80px"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={7}
        >
          <circle cx="50" cy="50" r="46" opacity="0.2" />
          <line
            className="play-pause-btn__svg-line1"
            x1="42"
            y1="30"
            x2="42"
            y2="70"
          />
          <line
            className="play-pause-btn__svg-line2"
            x1="42"
            y1="70"
            x2="70"
            y2="50"
          />
          <line
            className="play-pause-btn__svg-line3"
            x1="70"
            y1="50"
            x2="42"
            y2="30"
          />
          <circle
            className="play-pause-btn__svg-ring1"
            cx="50"
            cy="50"
            r="46"
          />
          <path
            className="play-pause-btn__svg-ring2"
            strokeDasharray="55 365"
            strokeDashoffset="55"
            d="M 41.996 4.631 C 41.996 4.631 47.464 3.48 52.3 7.107 C 58.062 11.43 58 18 58 18 L 58 70"
          />
          <path
            className="play-pause-btn__svg-ring3"
            strokeDasharray="40 365"
            strokeDashoffset="40"
            d="M 41.996 4.631 C 41.996 4.631 47.464 3.48 52.3 7.107 C 58.062 11.43 58 18 58 18 L 58 76"
            transform="scale(1, -1)"
          />
        </g>
      </svg>
    </button>
  );
}

// ─── Native Video Player ──────────────────────────────────────────────────────

function NativePlayer({ src, onOrientation }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const progressRef = useRef(null);
  const hideTimer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasStartedRef = useRef(false);
  const [hasEverPlayed, setHasEverPlayed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (/\.m3u8(\?|$)/i.test(src) && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else {
      video.src = src;
    }
    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => {
      setDuration(video.duration);
      const w = video.videoWidth;
      const h = video.videoHeight;
      const o = h > w * 1.1 ? "portrait" : w > h * 1.1 ? "landscape" : "square";
      setOrientation(o);
      onOrientation?.(o);
    };
    const onPlaying = () => {
      hasStartedRef.current = true;
      setIsLoading(false);
      setIsPlaying(true);
      setHasEverPlayed(true);
    };
    const onWaiting = () => {
      if (hasStartedRef.current) setIsLoading(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      video.currentTime = 0;
    };
    const onTime = () => {
      setCurrentTime(video.currentTime);
      setProgress(video.duration ? video.currentTime / video.duration : 0);
    };
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTime);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTime);
    };
  }, []);

  useEffect(() => {
    if (hasEverPlayed) resetHideTimer();
  }, [hasEverPlayed]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (containerRef.current) containerRef.current.style.cursor = "default";
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
        if (document.fullscreenElement && containerRef.current) {
          containerRef.current.style.cursor = "none";
        }
      }
    }, 2800);
  }, []);

  useEffect(
    () => () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    },
    []
  );

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (hasEverPlayed) resetHideTimer();
    if (v.paused) {
      setIsLoading(true);
      v.play().catch(() => setIsLoading(false));
    } else v.pause();
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    resetHideTimer();
  };
  const toggleFullscreen = (e) => {
    e.stopPropagation();
    resetHideTimer();
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };
  const seekTo = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    v.currentTime = ratio * v.duration;
    resetHideTimer();
  };

  let responsiveMaxWidthClass = "";
  if (orientation === "portrait") {
    responsiveMaxWidthClass =
      "max-w-[min(calc(60vh*0.5625),420px)] md:max-w-[min(calc(85vh*0.5625),520px)]";
  } else if (orientation === "square") {
    responsiveMaxWidthClass =
      "max-w-[min(50vh,500px)] md:max-w-[min(80vh,680px)]";
  } else if (orientation === "landscape") {
    responsiveMaxWidthClass =
      "max-w-[min(calc(75vh*1.7778),1200px)] md:max-w-[min(calc(85vh*1.7778),1200px)]";
  }

  const playerStyle =
    orientation === null
      ? { width: 0, height: 0, overflow: "hidden", opacity: 0 }
      : {
          width: "100%",
          aspectRatio:
            orientation === "portrait"
              ? "9/16"
              : orientation === "square"
              ? "1/1"
              : "16/9",
          margin: "0 auto",
        };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black select-none shadow-2xl rounded-sm overflow-hidden ${responsiveMaxWidthClass}`}
      style={playerStyle}
      onMouseMove={() => {
        if (hasEverPlayed) resetHideTimer();
      }}
      onMouseEnter={() => {
        if (hasEverPlayed) resetHideTimer();
      }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain absolute inset-0"
        playsInline
        preload="metadata"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none z-10">
          <IconLoader />
        </div>
      )}

      {!isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: showControls || !isPlaying ? 1 : 0 }}
        >
          <ThemedPlayPause isPlaying={isPlaying} />
        </div>
      )}

      {hasEverPlayed && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300"
          style={{ opacity: showControls ? 1 : 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          <div className="relative px-3 pb-3 pt-8 flex flex-col gap-2">
            <div
              ref={progressRef}
              className="w-full h-1 bg-white/20 rounded-full cursor-pointer group/bar"
              onClick={seekTo}
            >
              <div
                className="h-full bg-white rounded-full relative transition-none"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-3 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors shrink-0"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>
              <span className="font-mono text-[10px] text-white/70 tabular-nums shrink-0">
                {fmt(currentTime)} / {fmt(duration)}
              </span>
              <div className="flex-1" />
              <button
                onClick={toggleMute}
                className="text-white hover:text-primary transition-colors shrink-0"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <IconMute /> : <IconVolume />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary transition-colors shrink-0"
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VideoViewer ──────────────────────────────────────────────────────────────

export function VideoViewer({ open, project, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const headerTitleRef = useRef(null);
  const loaderRef = useRef(null);
  const centerTitleRef = useRef(null);

  const [entryLoadDone, setEntryLoadDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewerOrientation, setViewerOrientation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open && project) {
      setViewerOrientation(null);
      setEntryLoadDone(false);
      setProgress(0);
      setAllLoaded(false);

      if (contentRef.current) contentRef.current.scrollTop = 0;

      // Reset animation states on open[cite: 1]
      if (loaderRef.current) gsap.set(loaderRef.current, { opacity: 1, scale: 1, clearProps: "none" });
      if (contentRef.current) gsap.set(contentRef.current, { opacity: 0, y: 0 });
      if (centerTitleRef.current)
        gsap.set(centerTitleRef.current, {
          opacity: 0,
          filter: "blur(40px)",
          scale: 1.1,
          willChange: "transform, filter",
        });
      if (headerTitleRef.current)
        gsap.set(headerTitleRef.current, { opacity: 0, filter: "blur(12px)", x: -20 });
    }
  }, [open, project]);

  // Simulate progress[cite: 1]
  useEffect(() => {
    if (open && !allLoaded) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return Math.min(prev + Math.floor(Math.random() * 10) + 5, 95);
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [open, allLoaded]);

  // Finish loader trigger for native player
  useEffect(() => {
    if (viewerOrientation !== null) setEntryLoadDone(true);
  }, [viewerOrientation]);

  // Finish loader trigger for iframe embeds
  useEffect(() => {
    if (open && project && isEmbeddable(project.video)) {
      const t = setTimeout(() => setEntryLoadDone(true), 750);
      return () => clearTimeout(t);
    }
  }, [open, project?.video]);

  // Snap progress to 100% and trigger GSAP timeline when loaded
  useEffect(() => {
    if (entryLoadDone) {
      setProgress(100);
      const t = setTimeout(() => setAllLoaded(true), 250);
      return () => clearTimeout(t);
    }
  }, [entryLoadDone]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("lenis-stopped");
    const lenis = window.__lenis;
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.classList.remove("lenis-stopped");
      lenis?.start();
    };
  }, [open]);

  // Fade in overlay[cite: 1]
  useEffect(() => {
    if (!open || !overlayRef.current) return;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [open]);

  // Intro Sequence Timeline[cite: 1]
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
      onComplete: () => gsap.set(centerTitleRef.current, { willChange: "auto" }),
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
      { opacity: 1, filter: "blur(0px)", x: 0, duration: 0.6, ease: "power3.out" },
      "-=0.2"
    );
  }, [allLoaded]);

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3 }, "<");
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!mounted || !open || !project) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-black flex flex-col"
      style={{ opacity: 0 }}
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* ── Loader ── */}
      <div
        ref={loaderRef}
        className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-8 pointer-events-none"
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
            LOADING VIDEO
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
        className="absolute inset-0 z-[90] flex items-center justify-center pointer-events-none"
        style={{ opacity: 0, filter: "blur(40px)" }}
      >
        <h1
          className="text-gradient text-center px-6 leading-none select-none font-bold"
          style={{
            fontFamily: "'Bebas Neue', serif",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            letterSpacing: "0.15em",
          }}
        >
          {project.title}
        </h1>
      </div>

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 sm:px-8 py-5 shrink-0 border-b border-white/5 relative z-10">
        <button
          onClick={handleClose}
          className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors duration-200 group"
        >
          <svg
            viewBox="0 0 16 16"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M10 3L5 8l5 5" />
          </svg>
          <span className="font-mono font-semi-bold text-[14px] uppercase tracking-[0.2em] leading-none">
            Back
          </span>
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="flex-1 w-full h-full overflow-hidden no-scrollbar relative z-10"
        style={{ opacity: 0 }}
      >
        <div className="min-h-full w-full flex flex-col md:flex-row items-center md:items-stretch justify-center gap-10 md:gap-16 px-5 py-12 md:py-16 md:px-12 mx-auto max-w-[1800px]">
          {/* ── Text Details (Left Desktop, Bottom Mobile) ───────────────── */}
          <div
            ref={headerTitleRef}
            className="w-full md:w-[400px] lg:w-[480px] shrink-0 flex flex-col justify-center order-2 md:order-1"
            style={{ opacity: 0, filter: "blur(12px)" }}
          >
            <div className="flex flex-col gap-4">
              {project.id && (
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
                  {project.id}
                </span>
              )}

              <h2 className="fontyff text-4xl lg:text-6xl uppercase tracking-tighter leading-[0.9] text-white break-words">
                {project.title}
              </h2>
            </div>
          </div>

          {/* ── Video Player (Right Desktop, Top Mobile) ─────────────────── */}
          <div className="w-full flex-1 flex flex-col items-center justify-center order-1 md:order-2 shrink-0 md:shrink min-h-[40vh]">
            {isEmbeddable(project.video) ? (
              <div
                className="w-full relative shadow-2xl rounded-sm overflow-hidden"
                style={{
                  aspectRatio: "16/9",
                  width: "100%",
                  maxWidth: "min(calc(85vh * 1.7778), 1200px)",
                }}
              >
                <iframe
                  src={toEmbedUrl(project.video)}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <NativePlayer
                key={project.video}
                src={project.video}
                onOrientation={setViewerOrientation}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default VideoViewer;