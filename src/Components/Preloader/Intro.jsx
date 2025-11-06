// "use client";
// import React, { useEffect } from "react";
// import "./Preloader.css";
// import gsap from "gsap";
// import Image from "next/image";

// const Intro = () => {
//   useEffect(() => {
//     const init = () => {
//       const ctx = gsap.context(() => {
//           let tl = gsap.timeline({ delay: 0 });
//           tl.to(".col", {
//             top: 0,
//             duration: 3,
//             ease: "power4.inOut",
//           });
    
//           tl.to(
//             ".c-1 .item",
//             {
//               top: 0,
//               stagger: 0.25,
//               duration: 3,
//               ease: "power4.inOut",
//             },
//             "-=2"
//           );
    
//           tl.to(
//             ".c-2 .item",
//             {
//               top: 0,
//               stagger: -0.25,
//               ease: "power4.inOut",
//               duration: 3,
//             },
//             "-=4"
//           );
    
//           tl.to(
//             ".c-3 .item",
//             {
//               top: 0,
//               stagger: 0.25,
//               duration: 3,
//               ease: "power4.inOut",
//             },
//             "-=4"
//           );
    
//           tl.to(
//             ".c-4 .item",
//             {
//               top: 0,
//               stagger: -0.25,
//               duration: 3,
//               ease: "power4.inOut",
//             },
//             "-=4"
//           );
    
//           tl.to(
//             ".c-5 .item",
//             {
//               top: 0,
//               stagger: 0.25,
//               duration: 3,
//               ease: "power4.inOut",
//             },
//             "-=4"
//           );
    
//           tl.to(
//             ".cont",
//             {
//               scale: 5.36,
//               duration: 4,
//               ease: "power4.inOut",
//             },
//             "-=2"
//           );
//           // content
//           tl.to(
//             ".nav-item a, .title p, .slide-num p, .preview Image fill",
//             {
//               top: 0,
//               stagger: 0.075,
//               duration: 1,
//               ease: "power3.out",
//             },
//             "-=1.5"
//           );
    
//           tl.to(
//             ".icon .ion-icon, .icon-2 ion-icon",
//             {
//               scale: 1,
//               stagger: 0.05,
//               ease: "power3.out",
//             },
//             "-=1"
//           );
//         });

//       return () => ctx.revert();
//     };

//     const wait = setInterval(() => {
//       if (window.__loco) {
//         clearInterval(wait);
//         init();
//       }
//     }, 100);

//     return () => clearInterval(wait);
//   }, []);
//   return (
//     <>
//       <div>
//       <div className="cont">
//         <div className="col c-1">
//           <div className="item">
//             <Image fill src="/Projects/images/PUMA/PUMAHERO.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/PORSCHE/PORSCHE.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Adidas/Adidas.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/CAR/CAR.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/CINEMA/CINEMA.jpg" alt="item" />
//           </div>
//         </div>
//         <div className="col c-2">
//           <div className="item">
//             <Image fill src="/Projects/images/TALISE/TALISEHERO.webp" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Jumeriah/JumeriahHERO.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Jumeriah2/JumeriahHero.webp" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Ganache/Ganache.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/ALULA/ALULA.jpg" alt="item" />
//           </div>
//         </div>
//         <div className="col c-3">
//           <div className="item">
//             <Image fill src="/Projects/images/staryouth/staryouth.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Jumeriah3/Jumeriah.jpg" alt="item" />
//           </div>
//           <div className="item ">
//             <Image fill src="/HeroImages/Cube.webp" alt="item" />
            

            
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Circle/Circle.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/BLACK/Black.jpg" alt="item" />
//           </div>
//         </div>
//         <div className="col c-4">
//           <div className="item">
//             <Image fill src="/Projects/images/ARSENAL/ARSENALHERO.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Disconected/disconected.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/WHITE/White.png" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/TEA/TEA.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Adidas2/Adidas2.webp" alt="item" />
//           </div>
//         </div>
//         <div className="col c-5">
//           <div className="item">
//             <Image fill src="/Projects/images/PEET/PeetHero.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Adidas3/Adidas.jpg" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/HeroImages/black.webp" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Night Crawler/Night Crawler.webp" alt="item" />
//           </div>
//           <div className="item">
//             <Image fill src="/Projects/images/Bare/BARE.jpg" alt="item" />
//           </div>
//         </div>
//       </div>
//       {/* <div className="content">
//         <nav>
//           <div className="nav-item">
//             <a href="#" id="active"> Work </a>
//           </div>
//           <div className="nav-item">
//             <a href="#" id="active"> About </a>
//           </div>
//         </nav>
//         <div className="hero">
//           <div className="icon">
//             <ion-icon name="add-sharp"></ion-icon>
//           </div>
//           <div className="title">
//             <p>The Regenration Site</p>
//           </div>
//           <div className="icon-2">
//             <ion-icon name="add-sharp"></ion-icon>
//           </div>
//         </div>
//         <footer>
//           <div className="preview">
//             <Image fill src="/HeroImages/black.webp" alt="prev" />
//             <Image fill src="/HeroImages/black.webp" alt="prev" />
//             <Image fill src="/HeroImages/black.webp" alt="prev" />
//             <Image fill src="/HeroImages/black.webp" alt="prev" />
//             <Image fill src="/HeroImages/black.webp" alt="prev" />
//             <Image fill src="/HeroImages/black.webp" alt="prev" />
//             <Image fill src="/HeroImages/black.webp" alt="prev" />
//           </div>
//           <div className="slide-num"><p>1 : 3</p></div>
//         </footer>
//       </div> */}
//     </div>
//     </>
//   );
// };

// export default Intro;
