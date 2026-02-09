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