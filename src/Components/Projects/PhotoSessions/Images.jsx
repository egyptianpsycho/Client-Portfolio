"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PROJECTSIMGS } from "../CONSTANTS";
import Image from "next/image";
import Modal from "@/Components/UI/Modal";
import useAnimate from "@/Hooks/useAnimate";

const Images = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const secRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          scroller: "[data-scroll-container]",
          start: "top bottom-=30%",
          toggleActions: "play none none reverse",
        },
      });

      const waitForImages = () => {
        const images = secRef.current?.querySelectorAll("img");
        if (!images || images.length === 0) return Promise.resolve();
        const imagePromises = Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        });
        return Promise.all(imagePromises);
      };

      waitForImages().then(() => {
        const imageBoxes = gsap.utils.toArray(".project-item");
        gsap.set(secRef.current, { willChange: "transform, filter" });
        gsap.from(imageBoxes, {
          opacity: 0,
          y: 200,
          duration: 1.2,
          filter: "blur(10px)",
          ease: "power3.out",
          delay: 0.3,
          stagger: 0.06,
          onComplete: () => gsap.set(secRef.current, { willChange: "auto" }),
          scrollTrigger: {
            trigger: secRef.current,
            scroller: "[data-scroll-container]",
            start: "top 60%",
            end: "bottom 20%",
          },
        });
      });
    }
  });

  return (
    <div className="mt-94 relative" id="PROJECTS">
      <div className="z-100 text-center">
        <h1
          className="text-9xl max-sm:text-[2.2rem] mb-5 relative inset-0 -top-90 tracking-[1.1rem] max-sm:tracking-[0.2rem] behind-title2 font-bold text-gradient"
          style={{
            lineHeight: "12rem",
            fontFamily: "'Bebas Neue', 'serif'",
          }}
        >
          PHOTOGRAPHY
        </h1>
      </div>

      {isMobile ? (
        /* ── Mobile: full-width Instagram grid, all images, no pagination ── */
        <div
          ref={secRef}
          className="-mt-100  "
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {PROJECTSIMGS.map((project, index) => (
            <div
              key={index}
              className="project-item cursor-pointer group"
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                backgroundColor: "#111",
              }}
              onClick={() => {
                setSelectedProject(project);
                setModalOpen(true);
              }}
            >
              <Image
                src={project.cover}
                alt={project.alt}
                fill
                sizes="32vw"
                className="object-cover transition-all duration-500 ease-out grayscale-75 group-active:grayscale-0"
              />
              {/* dark overlay on tap */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none" />
              {/* title on tap */}
              <div className="absolute bottom-1 left-0 w-full px-1 text-center opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none">
                <p className="text-white/90 text-[0.5rem] font-semibold tracking-wide leading-tight truncate">
                  {project.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Desktop: original layout unchanged ── */
        <div className="mx-auto parent h-[90vh] -mt-100" ref={secRef}>
          {PROJECTSIMGS.map((project, index) => (
            <div
              key={index}
              className={`project-item div${index + 1} cursor-pointer group`}
              onClick={() => {
                setSelectedProject(project);
                setModalOpen(true);
              }}
            >
              <Image
                src={project.cover}
                alt={project.alt}
                fill
                className="object-cover rounded-2xl scale-[0.98] origin-center grayscale-75 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
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

      <Modal
        open={modalOpen}
        project={selectedProject}
        onClose={() => setModalOpen(false)}
      />

      <div className="relative mt-38">
        <hr className="premium-hr" />
      </div>
    </div>
  );
};

export default Images;