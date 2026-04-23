"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PROJECTSIMGS } from "../CONSTANTS";
import Image from "next/image";
import ProjectViewer from "@/Components/UI/ProjectViewer";
import useAnimate from "@/Hooks/useAnimate";

const CATEGORIES = ["All", "advertising", "Hospitality", "Fine Art", "F & B","Architecture", "Product"];

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

      // wait for images to load logic
      const waitForImages = () => {
        const images = secRef.current?.querySelectorAll("img");
        if (!images || images.length === 0) return Promise.resolve();
        return Promise.all(
          Array.from(images).map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) => {
                  img.onload = res;
                  img.onerror = res;
                })
          )
        );
      };

      waitForImages().then(() => {
        const imageBoxes = gsap.utils.toArray(".project-item");
        if (!imageBoxes.length) return;
      
        // Group cards by their rendered top position = visual row
        const rowMap = new Map();
        imageBoxes.forEach((el) => {
          const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
          if (!rowMap.has(top)) rowMap.set(top, []);
          rowMap.get(top).push(el);
        });
      
        // Sort rows top → bottom
        const rows = [...rowMap.entries()]
          .sort(([a], [b]) => a - b)
          .map(([, els]) => els);
      
        const fromVars = {
          opacity: 0,
          scale: 0.85,
          rotateX: 8,
          y: 150,
          filter: "blur(12px) brightness(0.4)",
          transformOrigin: "center bottom",
        };
      
        const toVars = {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          y: 0,
          filter: "blur(0px) brightness(1)",
          duration: 1.4,
          ease: "expo.out",
          stagger: { amount: 0.35, from: "start" },
        };
      
        // First 3 rows: animate together on section enter
        const eagerRows = rows.slice(0, 3).flat();
        gsap.set(secRef.current, { willChange: "transform, filter" });
      
        gsap.fromTo(eagerRows, fromVars, {
          ...toVars,
          scrollTrigger: {
            trigger: secRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onComplete: () => gsap.set(secRef.current, { willChange: "auto" }),
        });
      
        // Remaining rows: each animates when it enters the viewport
        rows.slice(3).forEach((rowEls) => {
          gsap.set(rowEls, { opacity: 0, scale: 0.85, rotateX: 8, y: 150,
            filter: "blur(12px) brightness(0.4)", transformOrigin: "center bottom" });
      
          gsap.fromTo(rowEls, fromVars, {
            ...toVars,
            scrollTrigger: {
              trigger: rowEls[0],       // trigger on the first card of each row
              start: "top 90%",
              toggleActions: "play none none none",
              onEnter: () => gsap.set(rowEls[0], { willChange: "transform, filter, opacity" }),
            },
            onComplete: () => gsap.set(rowEls[0], { willChange: "auto" }),              
          });
        });
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
  
    gsap.fromTo(
      imageBoxes,
      {
        opacity: 0,
        scale: 0.85,
        rotateX: 8,
        y: 150,
        filter: "blur(12px) brightness(0.4)",
        transformOrigin: "center bottom",
      },
      {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        y: 0,
        filter: "blur(0px) brightness(1)",
        duration: 1.4,
        ease: "expo.out",
        stagger: { amount: 1.2, from: "start" },
      }
    );
  }, [displayedCategory, isTransitioning]);

  const openProject = (project) => {
    setSelectedProject(project);
    setViewerOpen(true);
  };

  return (
    <div className="sm:pt-94 relative" id="PROJECTS">
      <div className="z-100 text-center">
        <h1
          className="text-9xl max-sm:text-[2.2rem] mb-5 relative inset-0 -top-90 max-sm:top-0 tracking-[1.1rem] max-sm:tracking-[0.2rem] behind-title2 font-bold text-gradient"
          style={{
            lineHeight: isMobile ? "1.15" : "12rem",
            fontFamily: "'Bebas Neue', 'serif'",
          }}
        >
          PHOTOGRAPHY
        </h1>
      </div>

      {/* ── Category dropdown ── */}
      <div className="bottom-8 max-sm:right-18 max-sm:mb-2 md:bottom-104 mt-8 pl-4 relative z-50">
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 max-sm:px-3 max-sm:py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 uppercase"
            style={{
              fontFamily: "'Bebas Neue', serif",
              fontSize: isMobile ? "0.8rem" : "1rem",
              letterSpacing: isMobile ? "0.1rem" : "0.2rem",
            }}
          >
            {selectedCategory}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 ${
                dropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div
            className={`absolute top-full mt-2 w-44 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 origin-top ${
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
                  fontFamily: "'Bebas Neue', serif",
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
              <Image
                src={project.cover}
                alt={project.alt}
                fill
                className="object-cover rounded-2xl scale-[0.98] origin-center  transition-all duration-500 ease-out  group-hover:scale-105"
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


//

// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import { SplitText } from "gsap/SplitText";
// import { PROJECTSIMGS } from "../CONSTANTS";
// import Image from "next/image";
// import Modal from "@/Components/UI/Modal";
// import useAnimate from "@/Hooks/useAnimate";
// const CATEGORIES = ["All", "Portrait", "Commercial", "Sport", "Cars"];

// const Images = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const secRef = useRef(null);

//   const filteredProjects =
//     selectedCategory === "All"
//       ? PROJECTSIMGS
//       : PROJECTSIMGS.filter(
//           (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
//         );

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useAnimate(() => {
//     if (window.innerWidth > 768) {
//       const behindTitle2 = new SplitText(".behind-title2", { type: "chars" });
//       behindTitle2.chars.forEach((char) => char.classList.add("text-gradient"));

//       gsap.set(behindTitle2.elements[0], { willChange: "transform, filter" });
//       gsap.from(behindTitle2.chars, {
//         opacity: 0,
//         duration: 2,
//         ease: "expo.out",
//         stagger: 0.1,
//         filter: "blur(15px)",
//         y: 50,
//         onComplete: () => gsap.set(behindTitle2, { willChange: "auto" }),
//         scrollTrigger: {
//           trigger: "#Projects",
//           scroller: "[data-scroll-container]",
//           start: "top bottom-=30%",
//           toggleActions: "play none none reverse",
//         },
//       });

//       const waitForImages = () => {
//         const images = secRef.current?.querySelectorAll("img");
//         if (!images || images.length === 0) return Promise.resolve();
//         const imagePromises = Array.from(images).map((img) => {
//           if (img.complete) return Promise.resolve();
//           return new Promise((resolve) => {
//             img.onload = resolve;
//             img.onerror = resolve;
//           });
//         });
//         return Promise.all(imagePromises);
//       };

//       waitForImages().then(() => {
//         const imageBoxes = gsap.utils.toArray(".project-item");
//         gsap.set(secRef.current, { willChange: "transform, filter" });
//         gsap.from(imageBoxes, {
//           opacity: 0,
//           y: 200,
//           duration: 1.2,
//           filter: "blur(10px)",
//           ease: "power3.out",
//           delay: 0.3,
//           stagger: 0.06,
//           onComplete: () => gsap.set(secRef.current, { willChange: "auto" }),
//           scrollTrigger: {
//             trigger: secRef.current,
//             scroller: "[data-scroll-container]",
//             start: "top 60%",
//             end: "bottom 20%",
//           },
//         });
//       });
//     }
//   });

//   return (
//     <div className="pt-94 relative" id="PROJECTS">
//       <div className="z-100 text-center">
//         <h1
//           className="text-9xl max-sm:text-[2.2rem] mb-5 relative inset-0 -top-90 tracking-[1.1rem] max-sm:tracking-[0.2rem] behind-title2 font-bold text-gradient"
//           style={{
//             lineHeight: "12rem",
//             fontFamily: "'Bebas Neue', 'serif'",
//           }}
//         >
//           PHOTOGRAPHY
//         </h1>
//       </div>

// <div className="bottom-104 mt-8 pl-4  relative z-50">
//         <div ref={dropdownRef} className="relative">
//           <button
//             onClick={() => setDropdownOpen((prev) => !prev)}
//             className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 tracking-[0.2rem] text-sm uppercase"
//             style={{ fontFamily: "'Bebas Neue', serif", fontSize: "1rem", letterSpacing: "0.2rem" }}
//           >
//             {selectedCategory}
//             {/* Chevron */}
//             <svg
//               className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </button>

//           {/* Dropdown Menu */}
//           <div
//             className={`absolute top-full  mt-2 w-44 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 origin-top ${
//               dropdownOpen
//                 ? "opacity-100 scale-100 pointer-events-auto"
//                 : "opacity-0 scale-95 pointer-events-none"
//             }`}
//           >
//             {CATEGORIES.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => {
//                   setSelectedCategory(cat);
//                   setDropdownOpen(false);
//                 }}
//                 className={`w-full px-5 py-3 text-left text-sm tracking-[0.15rem] uppercase transition-all duration-200
//                   ${
//                     selectedCategory === cat
//                       ? "text-white bg-white/10"
//                       : "text-white/50 hover:text-white hover:bg-white/5"
//                   }`}
//                 style={{ fontFamily: "'Bebas Neue', serif", fontSize: "0.95rem" }}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {isMobile ? (
//         <div
//           ref={secRef}
//           className="-mt-6"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: "2px",
//             width: "100vw",
//             marginLeft: "calc(-50vw + 50%)",
//           }}
//         >
//           {filteredProjects.map((project, index) => (
//             <div
//               key={project.id ?? index}
//               className="project-item cursor-pointer group"
//               style={{
//                 position: "relative",
//                 aspectRatio: "1 / 1",
//                 overflow: "hidden",
//                 backgroundColor: "#111",
//               }}
//               onClick={() => {
//                 setSelectedProject(project);
//                 setModalOpen(true);
//               }}
//             >
//               <Image
//                 src={project.cover}
//                 alt={project.alt}
//                 fill
//                 sizes="32vw"
//                 className="object-cover transition-all duration-500 ease-out grayscale-75 group-active:grayscale-0"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none" />
//               <div className="absolute bottom-1 left-0 w-full px-1 text-center opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none">
//                 <p className="text-white/90 text-[0.5rem] font-semibold tracking-wide leading-tight truncate">
//                   {project.title}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* Desktop Layout*/
// <div
//   className={`mx-auto parent h-[90vh] -mt-100 ${selectedCategory !== "All" ? "filtered" : ""}`}
//   ref={secRef}
// >          {filteredProjects.map((project, index) => (
//             <div
//               key={project.id ?? index}
//               className={`project-item div${index + 1} cursor-pointer group`}
//               onClick={() => {
//                 setSelectedProject(project);
//                 setModalOpen(true);
//               }}
//             >
//               <Image
//                 src={project.cover}
//                 alt={project.alt}
//                 fill
//                 className="object-cover rounded-2xl scale-[0.98] origin-center grayscale-75 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
//                 style={{ objectPosition: "50% 20%" }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
//               <div className="absolute bottom-5 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
//                 <h3 className="text-white/80 text-xl font-semibold tracking-wide text-gradient">
//                   {project.title}
//                 </h3>
//               </div>
//               <div className="opacity-10 scale-200 bg-slate-500/10 absolute inset-0" />
//             </div>
//           ))}
//         </div>
//       )}

//       <Modal
//         open={modalOpen}
//         project={selectedProject}
//         onClose={() => setModalOpen(false)}
//       />

//       <div className="relative mt-38">
//         <hr className="premium-hr" />
//       </div>
//     </div>
//   );
// };

// export default Images;
