"use client";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Carousel from "./Carousel";
import { Button } from "@material-tailwind/react";
import Link from "next/link";

const Modal = ({ open, onClose, project }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const glareRef = useRef(null);

  useEffect(() => {
    const loco = window.__loco;
    if (open) {
      document.body.style.overflow = "hidden";
      loco && loco.stop();
      loco && loco.scrollTo(loco.scroll.instance.scroll.y, { duration: 0 });
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
    if (open) {
      const tl = gsap.timeline();

      // Modal entrance
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

      // Text animation from the first modal
      const firstBg = contentRef.current.querySelectorAll(".text__first-bg");
      const secBg = contentRef.current.querySelectorAll(".text__second-bg");
      const word = contentRef.current.querySelectorAll(".text__word");

      tl.to(firstBg, { scaleX: 1, duration: 0.2, ease: "power2.inOut" })
        .to(secBg, { scaleX: 1, duration: 0.2, ease: "power2.inOut" })
        .to(word, { opacity: 1, duration: 0.1 }, "-=0.1")
        .to(firstBg, { scaleX: 0, duration: 0.2, ease: "power2.inOut" })
        .to(secBg, { scaleX: 0, duration: 0.2, ease: "power2.inOut" })
        .fromTo(
          ".project-date",
          { opacity: 0, filter: "blur(5px)" },
          { opacity: 0.6, duration: 0.5, filter: "blur(0px)" },
          "-=0.2"
        )
        .fromTo(
          ".carousel-img:nth-child(-n+2)",
          { opacity: 0, y: -400, scale: 0.4, filter: "blur(20px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            scale: 1,
            duration: 0.7,
            delay:0.1,
            stagger: 0.2,
            ease: "power3.out",
          },
          "-=0.1"
        )
        .fromTo(
          glareRef.current,
          { left: "-100%" },
          { 
            left: "100%", 
            duration: 0.9, 
            ease: "power2.inOut"
          },
          "-=1.2"
        );
    }
  }, [open]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });
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
        .text__first, .text__second {
          position: relative;
          display: inline-block;
        }

        .text__word {
          opacity: 0;
        }

        .text__first-bg, .text__second-bg {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 100;
          transform-origin: right;
          transform: scaleX(0);
        }

        .text__first-bg {
          background: linear-gradient(to right, #ffffff, #898989);
        }

        .text__second-bg {
          background: linear-gradient(to left, #ffffff, #898989);
        }

        .btn {
          position: relative;
          overflow: hidden;
          background-color: black;
          display: inline-block;
          border: 2px solid rgb(144, 146, 148);
          transition: all 0.3s ease;
          padding: 17px 72px;
          cursor: pointer;
          border-radius: 12px;
          font-family: "Bebas Neue", cursive;
          letter-spacing: 0.1rem;
          word-spacing: 0.1rem;
        }

        @media (max-width: 500px) {
          .btn {
            padding: 8px 15px;
          }
        }

        .btn:hover {
          box-shadow: 1px 1px 25px 5px rgba(122, 160, 196, 0.4);
          color: black;
          background-color: rgb(228, 222, 212);
          transition-duration: 1.3s;
          transition-delay: 0.09s;
        }

        .btn-glare-effect {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(122, 160, 196, 0.4), transparent);
          pointer-events: none;
          z-index: 1;
        }

        .btn:hover .btn-glare-effect {
          animation: glare-hover 0.9s ease;
        }

        @keyframes glare-hover {
          from { left: -100%; }
          to { left: 100%; }
        }

        .btn > span:not(.btn-glare-effect) {
          position: relative;
          z-index: 2;
        }
      `}</style>

      <div
        ref={contentRef}
        className="relative bg-[#0a0a0a]/80 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 items-start max-w-7xl w-full h-auto max-h-[90vh] md:h-[80vh] overflow-y-auto md:overflow-hidden border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Info */}
        <div className="flex-1 flex flex-col justify-center text-white space-y-3 sm:space-y-4 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug overflow-hidden">
            <span className="text__first">
              <span className="text__word text-gradient">{project.title}</span>
              <span className="text__first-bg"></span>
            </span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-full md:max-w-md overflow-hidden">
            <span className="text__second">
              <span className="text__word">
                {project.description ||
                  "No description provided for this project."}
              </span>
              <span className="text__second-bg"></span>
            </span>
          </p>

          <p className="text-gray-400 text-base sm:text-lg project-date underline max-sm:mt-1 opacity-0 ">
            {project.date}
          </p>

          <div className="flex justify-center max-sm:justify-end md:absolute md:bottom-25 btn-container pt-4 md:pt-0 max-sm:relative max-sm:bottom-16 max-sm:scale-80 max-sm:left-8 max-sm:mb-2">
            <Link
              href={project?.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="btn text-white text-lg sm:text-xl">
                <span ref={glareRef} className="btn-glare-effect"></span>
                <span>Show Full Project</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Carousel */}
        <div className="flex-1 flex justify-center items-center w-full min-h-[250px] sm:min-h-[300px] ">
          <Carousel images={project.images} cover={project.cover} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;