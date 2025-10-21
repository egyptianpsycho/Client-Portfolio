"use client";

import { useEffect } from "react";
import "./Preloader.css";

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const finish = () => {
      // Add class to run your "closing" animations
      preloader.classList.add("preloaded");

      // After animation ends, remove element and emit event
      setTimeout(() => {
        preloader.remove();
        // Emit an event so other code (e.g. loco init) can react
        window.dispatchEvent(new Event("preloaderFinished"));
      }, 1000); // keep in sync with your CSS animation timing
    };

    // Try load event first
    window.addEventListener("load", finish, { once: true });

    // Fallback in case `load` doesn't fire (Next.js etc.)
    const fallback = setTimeout(finish, 3000);

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div id="preloader">
      <div className="loader_line"></div>
    </div>
  );
}
