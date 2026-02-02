"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PROJECTSIMGS } from "../CONSTANTS";
import Image from "next/image";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import Modal from "@/Components/UI/Modal";
import useAnimate from "@/Hooks/useAnimate";

const Images = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const secRef = useRef(null);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(PROJECTSIMGS.length / ITEMS_PER_PAGE);

  // Handle mobile detection on client side only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current projects based on page
  const getCurrentProjects = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return PROJECTSIMGS.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of projects section
    secRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useAnimate(() => {
    if (window.innerWidth > 768) {
      const behindTitle2 = new SplitText(".behind-title2", { type: "chars" });
      behindTitle2.chars.forEach((char) => char.classList.add("text-gradient"));

      // Animate the title
      gsap.from(behindTitle2.chars, {
        opacity: 0,
        duration: 2,
        ease: "expo.out",
        stagger: 0.1,
        filter: "blur(15px)",
        y: 50,
        scrollTrigger: {
          trigger: "#Projects",
          scroller: "[data-scroll-container]",
          start: "top bottom-=30%",
          toggleActions: "play none none reverse",
        },
      });

      // Wait for images to load before animating
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

      // Animate images after they're loaded
      waitForImages().then(() => {
        const imageBoxes = gsap.utils.toArray(".project-item");

        gsap.from(imageBoxes, {
          opacity: 0,
          y: 200,
          duration: 1.2,
          filter: "blur(10px)",
          ease: "power3.out",
          delay: 0.3,
          stagger: 0.06,
          scrollTrigger: {
            trigger: secRef.current,
            scroller: "[data-scroll-container]",
            start: "top 60%",
            end: "bottom 20%",
          },
        });
      });

      gsap.fromTo(
        ".btn-container",
        {
          opacity: 0,
          duration: 3,
          filter: "blur(12px)",
          ease: "power4.inOut",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          scrollTrigger: {
            trigger: ".btn-container",
            scroller: "[data-scroll-container]",
            start: "top 70%",
          },
        }
      );
    }
  });

  const projectsToDisplay = isMobile ? getCurrentProjects() : PROJECTSIMGS;

  return (
    <div className="mt-94 relative " id="PROJECTS">
      <div>
        <div className=" z-100 text-center ">
          <h1
            className="text-9xl max-sm:text-[2.2rem] mb-5 relative inset-0 -top-90 tracking-[1.1rem] max-sm:tracking-[0.2rem] behind-title2 font-bold text-gradient  "
            style={{
              lineHeight: "12rem",
              fontFamily: " 'Bebas Neue', 'serif' ",
            }}
          >
            PHOTOGRAPHY
          </h1>
        </div>
      </div>{" "}
      <div className="mx-auto parent h-[90vh] -mt-100 " ref={secRef}>
        {projectsToDisplay.map((project, index) => {
          // Calculate the actual index for desktop layout classes
          const actualIndex = isMobile ? (currentPage - 1) * ITEMS_PER_PAGE + index : index;
          
          return (
            <div
              key={actualIndex}
              className={`project-item div${actualIndex + 1} cursor-pointer group `}
              onClick={() => {
                setSelectedProject(project);
                setModalOpen(true);
              }}
            >
              <Image
                src={project.cover}
                alt={project.alt}
                fill
                className="object-cover rounded-2xl scale-[0.98]  origin-center grayscale-75  transition-all duration-500 ease-out  group-hover:grayscale-0 group-hover:scale-105"
                style={{ objectPosition: "50% 20%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out " />

              {/* title on the bottom */}
              <div className="absolute bottom-5 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                <h3 className="text-white/80 text-xl font-semibold tracking-wide text-gradient  ">
                  {project.title}
                </h3>
              </div>
              <div className="blur-2xl opacity-10  scale-200 bg-slate-500/10 absolute inset-0" />
            </div>
          );
        })}
      </div>

      {/* Pagination controls for mobile */}
      {isMobile && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 mb-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg transition-all ${
                  currentPage === page
                    ? "bg-white text-black font-bold"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
          >
            Next
          </button>
        </div>
      )}

      <div>
        <Modal
          open={modalOpen}
          project={selectedProject}
          onClose={() => setModalOpen(false)}
        />
      </div>
      <div className=" flex justify-center  mt-10 mb-30 btn-container">
        <Link
          href={"https://www.behance.net/abbas_visuals"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="btn text-white text-3xl max-sm:text-xl   ">
            Show more Projects
          </Button>
        </Link>
      </div>
      <div className="relative">
        <hr className="premium-hr " />
      </div>
    </div>
  );
};

export default Images;