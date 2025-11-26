// // Add this to your main layout or _app.js file
// "use client";

// import { useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export function ScrollPerformanceConfig() {
//   useEffect(() => {
//     // Global ScrollTrigger configuration for better performance
//     ScrollTrigger.config({
//       // Limit the number of times ScrollTrigger checks for changes per second
//       limitCallbacks: true,
      
//       // Use this to sync with Locomotive's lerp for smoother animations
//       syncInterval: 0,
      
//       // Automatically kill ScrollTriggers when their trigger element is removed
//       autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      
//       // Ignore mobile URL bar resizing
//       ignoreMobileResize: true,
//     });

//     // Optimize GSAP ticker for smooth animations
//     gsap.ticker.lagSmoothing(0);

//     // Set default ease for smoother animations
//     gsap.defaults({
//       ease: "none",
//       duration: 1,
//     });

//     // Prevent scroll restoration issues
//     if ("scrollRestoration" in history) {
//       history.scrollRestoration = "manual";
//     }

//     // Force hardware acceleration on scroll
//     const style = document.createElement("style");
//     style.textContent = `
//       * {
//         -webkit-backface-visibility: hidden;
//         -moz-backface-visibility: hidden;
//         -webkit-transform: translate3d(0, 0, 0);
//         -moz-transform: translate3d(0, 0, 0);
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   return null;
// }

// // Usage: Add <ScrollPerformanceConfig /> to your root layout