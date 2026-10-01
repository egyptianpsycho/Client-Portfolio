"use client";
import React, { useRef, useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./Videos.css";
import { PROJECTSVIDS } from "../CONSTANTS";
import useAnimate from "@/Hooks/useAnimate";
// ── Adjust this import path to wherever you placed VideoViewer.jsx ──
import { VideoViewer } from "@/Components/UI/VideoViewer";
gsap.registerPlugin(ScrollTrigger, SplitText);

// Mux serves thumbnail.png at the video's full resolution (~300 KB each).
// Ask for a WebP at card size instead (~6 KB) — same frame, same `time`.
function muxThumb(url, width = 960) {
  if (!url || !url.includes("image.mux.com")) return url;
  const u = new URL(url.replace(/\/thumbnail\.(png|jpg)/, "/thumbnail.webp"));
  if (!u.searchParams.has("width")) u.searchParams.set("width", String(width));
  return u.toString();
}

// ─── Map your constants to the shape VideoViewer expects ─────────────────────
// If your PROJECTSVIDS already has these fields, this just normalises them.
// Fields VideoViewer uses: id, title, meta, cover, video, client, duration, description
const PROJECTS = PROJECTSVIDS.map((p, i) => ({
  id:
    p.id != null
      ? String(p.id).padStart(2, "0")
      : String(i + 1).padStart(2, "0"),
  title: p.title ?? null,
  meta: p.client && p.year ? `${p.client} / ${p.year}` : null,
  cover: muxThumb(p.thummnail ?? p.thumbnail ?? null), // handles the typo in your constants
  video: p.videoURL,
  client: p.client ?? null,
  duration: p.durtaion ?? p.duration ?? null, // handles the typo in your constants
  description: p.description ?? null,
}));

// ─── VideoCard ────────────────────────────────────────────────────────────────
// Thumbnail button that sits in the bento grid and opens the VideoViewer
function VideoCard({ p, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      className="group relative w-full h-full text-left cursor-pointer overflow-hidden  block"
    >
      {/* Thumbnail */}
      {p.cover && (
        <img
          src={p.cover}
          loading="lazy"
          decoding="async"
          alt={p.title ?? "Video project"}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

      {/* Top-left: project number */}
      {p.id && (
        <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-white/80 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          #{p.id}
        </div>
      )}

      {/* Top-right: duration (Hover Only with slide-down effect) */}
      {p.duration && (
        <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-white/60 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          {p.duration}
        </div>
      )}

      {/* Centered play button (hover only) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-14 md:size-16 rounded-full border border-white/40 bg-black/30 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
          <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[13px] border-l-white ml-0.5" />
        </div>
      </div>

      {/* Bottom: title + client */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
        {p.title && (
          <h3
            className="font-display text-base sm:text-xl md:text-2xl uppercase tracking-tight text-white leading-none truncate"
            style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
          >
            {p.title}
          </h3>
        )}
        {p.client && (
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/70 mt-1 truncate">
            {p.client}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
    </button>
  );
}

// ─── Videos ───────────────────────────────────────────────────────────────────
const Videos = () => {
  const vidSecRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(null); // the project currently open in VideoViewer

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ── GSAP scroll animations (desktop only, unchanged from original) ──────────
  useAnimate(() => {
    if (window.innerWidth > 768) {
      const vidTitle = new SplitText(".vid-title", { type: "chars" });
      vidTitle.chars.forEach((char) => char.classList.add("text-gradient"));

      gsap.set(vidTitle.elements[0], { willChange: "transform, filter" });
      gsap.from(vidTitle.chars, {
        opacity: 0,
        duration: 2,
        ease: "expo.out",
        stagger: 0.1,
        filter: "blur(15px)",
        y: 50,
        onComplete: () => gsap.set(vidTitle, { willChange: "auto" }),
        scrollTrigger: {
          trigger: "#videos-section",
          start: "top bottom-=30%",
          toggleActions: "play none none reverse",
        },
      });

      // Reveal cards as they scroll in (batched, so cards entering together
      // stagger together). This grid is a dense masonry, so the old
      // "group by row top" logic put nearly every card in its own row.
      gsap.set(".video-item", { opacity: 0, y: 80, scale: 0.95 });
      ScrollTrigger.batch(".video-item", {
        start: "top 92%",
        once: true,
        onEnter: (cards) =>
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });
    }
  });

  return (
    <div id="videos-section" className="relative mt-20 px-14" ref={vidSecRef}>
      {/* ── Section title ─────────────────────────────────────────────────── */}
      <h1
        className="text-9xl max-sm:text-4xl mb-10 lg:leading-[11rem] text-center glowy-text videos-title vid-title font-bold text-nowrap"
        style={{ fontFamily: "var(--font-bebas-neue), sans-serif", letterSpacing: "0.4rem" }}
      >
        VISION IN <br className="sm:hidden" /> MOTION
      </h1>

      {isMobile ? (
        /* ── Mobile: 2-column grid, all cards normal ── */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2px",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="video-item"
              style={{
                aspectRatio: "1 / 1",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <VideoCard p={project} onOpen={setActive} />
            </div>
          ))}
        </div>
      ) : (
        /* ── Desktop: 4-column bento grid ── */
        <div className="parent-video mx-auto">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className={`video-item overflow-hidden relative div${
                index + 1
              }-video cursor-pointer rounded-2xl`}
            >
              <VideoCard p={project} onOpen={setActive} />
            </div>
          ))}
        </div>
      )}

      {/* ── VideoViewer modal ─────────────────────────────────────────────── */}
      <VideoViewer
        open={!!active}
        project={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
};

export default Videos;
