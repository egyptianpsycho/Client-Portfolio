import Image from 'next/image'
import React from 'react'

const PreHero = () => {
  return (
    <section
          className="hero-section relative h-screen w-full overflow-hidden z  "
        >
          <div className="absolute inset-0 hero-media pointer-events-none ">
            {/* <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent pointer-events-none" /> */}
    
            <Image
              src="/HeroImages/CubeE.webp"
              alt="HeroImage"
              fill
              priority
              quality={0}
              className="object-cover  "
            />
            {/* overlay(s) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-[#434343]/40" />
          </div>
    
          
         
        </section>
  )
}

export default PreHero
// import Image from 'next/image'
// import React from 'react'

// const PreHero = () => {
//   return (
//     <section
//           className="hero-section relative h-screen w-full overflow-hidden z  "
//         >
//           <div className="absolute inset-0 hero-media pointer-events-none ">
//             {/* <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent pointer-events-none" /> */}
    
//             <Image
//               src="/HeroImages/CubeE.webp"
//               alt="HeroImage"
//               fill
//               priority
//               quality={0}
//               className="object-cover  "
//             />
//             {/* overlay(s) */}
//             <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-[#434343]/40" />
//           </div>
    
          
//           <div
//             className="relative z-30 flex items-center justify-center h-full pt-5 hero max-sm:top-11  "
//             style={{ willChange: "filter" }}
//           >
//             {/* svg content unchanged */}
//             {/*  */}
    
//             {/*  */}
//             <svg
//               role="img"
//               aria-label="Abbas — photography"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 500 160"
//               width={"100%"}
//               height={"100%"}
//               preserveAspectRatio="xMidYMid meet"
//               className={" text-[20vw] z-40 "}
//             >
//               <defs>
//                 <linearGradient id="serifGrad" x1="0" x2="1" y1="0" y2="1">
//                   <stop offset="0" stopColor="#D7D7D7" />
//                   <stop offset="1" stopColor="#68A1B7" />
//                 </linearGradient>
//                 <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
//                   <feDropShadow
//                     dx="0"
//                     dy="2"
//                     stdDeviation="6"
//                     floodColor="#000000"
//                     floodOpacity="0.35"
//                   />
//                 </filter>
//               </defs>
    
//               <g filter="url(#shadow)">
//                 <text
//                   x="50%"
//                   y="65%"
//                   textAnchor="middle"
//                   style={{ fontFamily: '"Work Sans", sans-serif' }}
//                   fontWeight="700"
//                   fontSize="92"
//                   fill="url(#serifGrad)"
//                   letterSpacing="-2"
//                   className="select-none h-text "
//                   id="hero-text"
//                 >
//                   ABBAS
//                 </text>
//               </g>
//             </svg>
//           </div>
//         </section>
//   )
// }

// export default PreHero


// import Image from 'next/image'
// import React from 'react'

// const PreHero = () => {
//   return (
//     <section
//           className="hero-section relative h-screen w-full overflow-hidden z  "
//         >
//           <div className="absolute inset-0 hero-media pointer-events-none ">
//             {/* <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent pointer-events-none" /> */}
    
//             <Image
//               src="/HeroImages/ttt.jpeg"
//               alt="HeroImage"
//               fill
//               priority
//               quality={0}
//               className="object-cover  "
//             />
//             {/* overlay(s) */}
//             {/* <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-[#434343]/40" /> */}
//           </div>
    
          
//           <div
//             className="relative z-30 flex items-center justify-center h-full pt-5 hero max-sm:top-11  "
//             style={{ willChange: "filter" }}
//           >
//             {/* svg content unchanged */}
//             {/*  */}
    
//             {/*  */}
            
//           </div>
//         </section>
//   )
// }

// export default PreHero
