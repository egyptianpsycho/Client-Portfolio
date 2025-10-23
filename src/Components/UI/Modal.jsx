"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Carousel from "./Carousel";
import { Button } from "@material-tailwind/react";
import Link from "next/link";

const Modal = ({ open, onClose, project }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  useEffect(() => {
    const loco = window.__loco;
    if (open) {
      document.body.style.overflow = "hidden";
      loco && loco.stop(); // stop locomotive scroll
      loco && loco.scrollTo(loco.scroll.instance.scroll.y, { duration: 0 });
    } else {
      document.body.style.overflow = "";
      loco && loco.start(); // resume locomotive scroll
    }

    return () => {
      document.body.style.overflow = "";
      loco && loco.start();
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3,  }
      );
      tl.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power4.out" },
        "<"
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
    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.3 },
      "<" // runs at the same time
    );
  };

  if (!open || !project) return null;

  return (
      <div
        ref={overlayRef}
        className="absolute inset-0 bottom-380 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div
          ref={contentRef}
          className="relative bg-[#0a0a0a]/90 rounded-2xl p-10 flex gap-12 items-start max-w-7xl w-full h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side: Info */}
          <div className="flex-1 flex flex-col justify-center text-white space-y-4">
            <h2 className="text-4xl font-bold text-gradient leading-snug">
              {project.title}
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-md">
              {project.description ||
                "No description provided for this project."}
            </p>
            <p className="text-gray-400 text-lg opacity-35 underline">
              {project.date}
            </p>
            <div className="flex justify-center absolute bottom-25  btn-container">
              <Link
                href={project?.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="btn text-white text-xl">
                  Show Full Project
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side: Carousel */}
          <div className="flex-1 flex justify-center items-center ">
            <Carousel images={project.images} cover={project.cover} />
          </div>
        </div>
      </div>
  );
};

export default Modal;
