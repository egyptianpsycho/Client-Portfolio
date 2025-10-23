"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);


export function LampDemo({ children }) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.__loco) {
        window.__loco.update();
        ScrollTrigger.refresh();
      }
    }, 200);
  
    return () => clearTimeout(timer);
  }, []);
  return <LampContainer>{children}</LampContainer>;
}

export const LampContainer = ({ children, className }) => {
  // lamp line timing
  const lampDelay = 0.3;
  const lampDuration = 0.8;
  const overlaysDelay = lampDelay + lampDuration + 0.05; // 1.15s (small buffer)

  return (
    <div
      className={cn(
        "relative flex min-h-screen  flex-col items-center justify-center overflow-hidden  w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        {/* LEFT CONIC (overlay) */}
        <motion.div
          initial={{ opacity: 0, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            width: { delay: lampDelay, duration: lampDuration, ease: "easeInOut" },
            opacity: { delay: overlaysDelay, duration: 0.45, ease: "easeInOut" },
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-zinc-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] opacity-0"
        >
          <div className="absolute  w-[100%] left-0  h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)] opacity-0" />
          <div className="absolute  w-40 h-[100%] left-0  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)] opacity-0" />
        </motion.div>

        {/* RIGHT CONIC (overlay) */}
        <motion.div
          initial={{ opacity: 0, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            width: { delay: lampDelay, duration: lampDuration, ease: "easeInOut" },
            opacity: { delay: overlaysDelay, duration: 0.45, ease: "easeInOut" },
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top] opacity-0"
        >
          <div className="absolute  w-40 h-[100%] right-0   bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)] opacity-0" />
          <div className="absolute  w-[100%] right-0  h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)] opacity-0" />
        </motion.div>

        

        

        {/* rounded bright hotspot */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: overlaysDelay + 0.06, duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-zinc-300  blur-3xl opacity-0"
        />

        {/* inner lamp blur (previous motion) - keep width anim but hide until overlaysDelay */}
        <motion.div
          initial={{ opacity: 0, width: "8rem" }}
          whileInView={{ opacity: 1, width: "16rem" }}
          transition={{
            width: { delay: lampDelay, duration: lampDuration, ease: "easeInOut" },
            opacity: { delay: overlaysDelay, duration: 0.45, ease: "easeInOut" },
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-zinc-200 blur-2xl opacity-0"
        ></motion.div>

        {/* lamp line (kept exactly as you had it) */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "40rem" }}
          transition={{
            delay: lampDelay,
            duration: lampDuration,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[40rem] -translate-y-[7rem] bg-zinc-400 "
        ></motion.div>

        {/* black piece under lamp (kept but make it fade in after lamp as well) */}
        <div
          className="absolute  w-[40rem] h-44 bg-black z-99 -translate-y-[12.5rem]"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem]"></div>
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
