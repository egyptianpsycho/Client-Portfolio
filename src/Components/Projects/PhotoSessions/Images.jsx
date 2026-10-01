"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { PROJECTSIMGS } from "../CONSTANTS";
import Image from "next/image";
import ProjectViewer from "@/Components/UI/ProjectViewer";
import useAnimate from "@/Hooks/useAnimate";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CATEGORIES = ["All", "advertising", "Hospitality", "Fine Art", "F & B","Architecture", "Product"];

const CARD_HIDDEN = {
  opacity: 0,
  scale: 0.9,
  rotateX: 8,
  y: 120,
  transformOrigin: "center bottom",
};
const CARD_SHOWN = {
  opacity: 1,
  scale: 1,
  rotateX: 0,
  y: 0,
  duration: 1.4,
  ease: "expo.out",
};

const Images = () => {
  const [viewerOpen, setViewerOpen] = useState(false); // ← was modalOpen
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayedCategory, setDisplayedCategory] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const secRef = useRef(null);
  const isFirstRender = useRef(true);


  const filteredProjects =
    displayedCategory === "All"
      ? PROJECTSIMGS
      : PROJECTSIMGS.filter(
          (p) => p.category?.toLowerCase() === displayedCategory.toLowerCase()
        );

  const handleCategoryChange = (cat) => {
    if (cat === displayedCategory) {
      setDropdownOpen(false);
      return;
    }
    setDropdownOpen(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setDisplayedCategory(cat);
      setSelectedCategory(cat);
      setIsTransitioning(false);
    }, 350);
  };

  // mobile check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // dropdown click outside handle
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // animations
  useAnimate(() => {
    if (window.innerWidth > 768) {
      const behindTitle2 = new SplitText(".behind-title2", { type: "chars" });
      behindTitle2.chars.forEach((char) => char.classList.add("text-gradient"));
      gsap.set(behindTitle2.elements[0], { willChange: "transform, filter" });
      gsap.from(behindTitle2.chars, {
        opacity: 0,
        duration: 2,
        ease: "expo.out",
        stagger: 0.1,
        filter: "blur(15px)",
        y: 50,
        onComplete: () => gsap.set(behindTitle2, { willChange: "auto" }),
        scrollTrigger: {
          trigger: "#Projects",
          // scroller: "[data-scroll-container]",
          start: "top bottom-=30%",
          toggleActions: "play none none reverse",
        },
      });

      // Reveal each card as it scrolls in — no waiting on image loads (the
      // old version waited for every lazy image on the grid, so cards far
      // below kept everything hidden), and transform/opacity only: animating
      // blur + brightness filters on dozens of photos was the jank.
      gsap.set(".project-item", CARD_HIDDEN);
      ScrollTrigger.batch(".project-item", {
        start: "top 92%",
        once: true,
        onEnter: (cards) =>
          gsap.to(cards, { ...CARD_SHOWN, stagger: 0.08, overwrite: true }),
      });
    }
  });

  useEffect(() => {
    // Skip the very first render — useAnimate handles the initial reveal
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isTransitioning || typeof window === "undefined" || window.innerWidth <= 768) return;

    const imageBoxes = gsap.utils.toArray(".project-item");
    if (!imageBoxes.length) return;

    gsap.fromTo(imageBoxes, CARD_HIDDEN, {
      ...CARD_SHOWN,
      stagger: { amount: 1.2, from: "start" },
    });
    // The grid's height changes with the filter; re-measure what's below it.
    ScrollTrigger.refresh();
  }, [displayedCategory, isTransitioning]);

  const openProject = (project) => {
    setSelectedProject(project);
    setViewerOpen(true);
  };

  return (
    <div className="sm:pt-94 px-14 relative" id="PROJECTS">
      <div className="z-100 text-center">
        <h1
          className="text-9xl glowy-text max-sm:text-[2.2rem] mb-5 relative inset-0 -top-90 max-sm:top-0 tracking-[1.1rem] max-sm:tracking-[0.2rem] behind-title2 font-bold "
          style={{
            lineHeight: isMobile ? "1.15" : "12rem",
            fontFamily: "var(--font-bebas-neue), sans-serif",
          }}
        >
          PHOTOGRAPHY
        </h1>
      </div>

      {/* ── Category dropdown ── */}
      <div className="bottom-8 max-sm:right-18 max-sm:mb-2 md:bottom-104 mt-8 pl-4 relative z-50">
        <div 
          ref={dropdownRef} 
          className="relative inline-block cursor-pointer"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 transition-all duration-300 uppercase"
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: isMobile ? "1rem" : "1.25rem",
              letterSpacing: isMobile ? "0.1rem" : "0.2rem",
            }}
          >
            <span className="text-white/70">CATEGORY</span>
            <span className="text-amber-50">/ {selectedCategory}</span>
          </div>

          {/* Invisible bridge to prevent hover loss */}
          <div className="absolute top-full h-3 w-full" />

          <div
            className={`absolute top-full mt-3 w-44 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 origin-top ${
              dropdownOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full px-5 py-3 text-left text-sm tracking-[0.15rem] uppercase transition-all duration-200 ${
                  selectedCategory === cat
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
                style={{
                  fontFamily: "var(--font-bebas-neue), sans-serif",
                  fontSize: "0.95rem",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile 3-col Instagram grid ── */}
      {isMobile ? (
        <div
          ref={secRef}
          className={`-mt-6 transition-grid ${
            isTransitioning ? "grid-exit" : "grid-enter"
          }`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id ?? index}
              className="project-item cursor-pointer group"
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                backgroundColor: "#111",
              }}
              onClick={() => openProject(project)}
            >
              <Image
                src={project.cover}
                alt={project.alt}
                fill
                sizes="32vw"
                className="object-cover transition-all duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none" />
              <div className="absolute bottom-1 left-0 w-full px-1 text-center opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none">
                <p className="text-white/90 text-[0.5rem] font-semibold tracking-wide leading-tight truncate">
                  {project.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Desktop bento grid ── */
        <div
        className={`mx-auto parent -mt-100 transition-grid ${
          isTransitioning ? "grid-exit" : "grid-enter"
        } ${displayedCategory !== "All" ? "filtered" : "h-[240vh]"}`}
          ref={secRef}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id ?? index}
              className={`project-item div${index + 1} cursor-pointer group`}
              onClick={() => openProject(project)}
            >
              {/* Without sizes, fill images default to 100vw — every card
                  downloaded a 1920–3840px file for a ~20vw tile. */}
              <Image
                src={project.cover}
                alt={project.alt}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 22vw"
                className="object-cover rounded-2xl scale-[0.98] origin-center  transition-transform duration-500 ease-out  group-hover:scale-105"
                style={{ objectPosition: "50% 20%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
              <div className="absolute bottom-5 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                <h3 className="text-white/80 text-xl font-semibold tracking-wide text-gradient">
                  {project.title}
                </h3>
              </div>
              <div className="opacity-10 scale-200 bg-slate-500/10 absolute inset-0" />
            </div>
          ))}
        </div>
      )}

      {/* ── Project Viewer ── */}
      <ProjectViewer
        open={viewerOpen}
        project={selectedProject}
        onClose={() => setViewerOpen(false)}
      />


<div className="relative mt-38">
         <hr className="premium-hr from-black via-white to-black bg-gradient-to-l w-full h-0.5 " />
       </div>
     </div>    
  );
};

export default Images;