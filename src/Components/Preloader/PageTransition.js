// // src/Components/PageTransition.js
// "use client";
// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

// export default function PageTransition({ children }) {
//   const pathname = usePathname();

//   useEffect(() => {
//     // Clean up on route change
//     if (window.__loco) {
//       window.__loco.scrollTo(0, { duration: 0, disableLerp: true });
//       // Give locomotive time to scroll before updating
//       setTimeout(() => {
//         if (window.__loco) {
//           window.__loco.update();
//         }
//       }, 100);
//     }
//   }, [pathname]);

//   return children;
// }