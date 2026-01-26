"use client";
import React, { useRef, useState } from "react";
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
  const secRef = useRef(null);

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
            img.onerror = resolve; // Resolve even on error to not block animation
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

  return (
    <div className="mt-94 relative " id="PROJECTS">
      <div>
        <div className=" z-100 text-center ">
          <h1
            className="text-9xl max-sm:text-[2.2rem] mb-5 relative inset-0 -top-90 tracking-[1.1rem] max-sm:tracking-[0.2rem] behind-title2 font-bold text-gradient  "
            style={{
              lineHeight: "12rem", // Note: You might want to reduce this for mobile too
              fontFamily: " 'Bebas Neue', 'serif' ",
            }}
          >
            PHOTOGRAPHY
          </h1>
        </div>
      </div>{" "}
      <div className="mx-auto parent h-[90vh] -mt-100 " ref={secRef}>
        {PROJECTSIMGS.map((project, index) => (
          <div
            key={index}
            className={`project-item div${index + 1} cursor-pointer group `}
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
        ))}
      </div>
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

// "use client";
// import React, { useRef, useState } from "react";
// import gsap from "gsap";
// import { SplitText } from "gsap/SplitText";
// import { PROJECTSIMGS } from "../CONSTANTS";
// import Image from "next/image";
// import { Button } from "@material-tailwind/react";
// import Link from "next/link";
// import Modal from "@/Components/UI/Modal";
// import useAnimate from "@/Hooks/useAnimate";

// const Images = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const secRef = useRef(null);
//   useAnimate(() => {
//     const behindTitle2 = new SplitText(".behind-title2", { type: "chars" });
//     const titles = gsap.utils.toArray(".project-title");
//     behindTitle2.chars.forEach((char) => char.classList.add("text-gradient"));

//     titles.forEach((title) => {
//       const split = new SplitText(title, { type: "chars" });

//       // When hovering over the card
//       title.closest(".group").addEventListener("mouseenter", () => {
//         gsap.fromTo(
//           split.chars,
//           { y: 30, opacity: 0, rotateX: 90, filter: "blur(20px)" },
//           {
//             y: 0,
//             opacity: 1,
//             rotateX: 0,
//             duration: 0.6,
//             stagger: 0.04,
//             filter: "blur(0px)",
//             ease: "back.out(1.7)",
//           }
//         );
//       });

//       title.closest(".group").addEventListener("mouseleave", () => {
//         gsap.to(split.chars, {
//           y: -10,
//           opacity: 0.2,
//           duration: 0.5,
//           stagger: 0.03,
//           ease: "power2.in",
//         });
//       });
//     });

//     // create a timeline using the same ScrollTrigger

//     // first: your original character animation
//     gsap.from(behindTitle2.chars, {
//       opacity: 0,
//       duration: 2,
//       ease: "expo.out",
//       stagger: 0.1,
//       filter: "blur(30px)",
//       y: 50,
//       scrollTrigger: {
//         trigger: "#Projects",
//         scroller: "[data-scroll-container]",
//         start: "top bottom-=30%",
//         toggleActions: "play none none reverse",
//       },
//     });

//     const imageBoxes = gsap.utils.toArray(".project-item");
//     // gsap.utils.shuffle(imageBoxes);

//     gsap.from(imageBoxes, {
//       opacity: 0,
//       y: 200,
//       duration: 1.2,
//       filter: "blur(10px)",
//       ease: "power3.out",
//       stagger: 0.06,
//       scrollTrigger: {
//         trigger: secRef.current,
//         scroller: "[data-scroll-container]",
//         start: "top 60%",
//         end: "bottom 20%",
//       },
//     });
//     gsap.from(".btn-container", {
//       opacity: 0,
//       y: 200,
//       duration: 1.2,
//       filter: "blur(5px)",
//       ease: "power4.inOut",
//       scrollTrigger: {
//         trigger: ".btn-container",
//         scroller: "[data-scroll-container]",
//         start: "top 98%",
//       },
//     });
//   });

//   return (
//     <div className="mt-94 relative">
//       <div>
//         <div className=" z-100 text-center ">
//           <h1
//             className="text-9xl max-sm:text-4xl mb-5 relative inset-0 -top-90   behind-title2 font-bold  text-gradient "
//             style={{
//               clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%) ",
//               lineHeight: "12rem",
//               fontFamily: " 'Bebas Neue', 'serif' ",
//               letterSpacing: "1.1rem",
//             }}
//           >
//             PROJECTS
//           </h1>
//         </div>
//       </div>{" "}
//       <div className="mx-auto parent h-[90vh] -mt-100 " ref={secRef}>
//         {PROJECTSIMGS.map((project, index) => (
//           <div
//             key={index}
//             className={`project-item div${index + 1} cursor-pointer group `}
//             onClick={() => {
//               setSelectedProject(project);
//               setModalOpen(true);
//             }}
//           >
//             <Image
//               src={project.cover}
//               alt={project.alt}
//               fill
//               className="object-cover rounded-2xl scale-[0.98]  origin-center grayscale-75  transition-all duration-500 ease-out  group-hover:grayscale-0 group-hover:scale-105"
//               style={{ objectPosition: "50% 20%" }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out " />

//             {/* title on the bottom */}
//             <div className="absolute bottom-5 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">
//               <h3 className="text-white/80 text-xl font-semibold tracking-wide text-gradient project-title ">
//                 {project.title}
//               </h3>
//             </div>
//             <div className="blur-2xl opacity-10  scale-200 bg-slate-500/10 absolute inset-0" />
//           </div>
//         ))}
//       </div>
//       <div>
//         <Modal
//           open={modalOpen}
//           project={selectedProject}
//           onClose={() => setModalOpen(false)}
//         />
//       </div>
//       <div className=" flex justify-center  mt-10 mb-30 btn-container">
//         <Link
//           href={"https://www.behance.net/abbas_visuals"}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Button className="btn text-white text-3xl max-sm:text-xl   ">
//             Show more Projects
//           </Button>
//         </Link>
//       </div>
//       <div className="relative">
//         <hr className="premium-hr " />
//       </div>
//     </div>
//   );
// };

// export default Images;
