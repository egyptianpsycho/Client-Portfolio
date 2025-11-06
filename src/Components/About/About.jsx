import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <section
      className=" second relative h-screen  bg-gradient-to-tr to-[#000000] from-[#0a212b] z-[10]  px-10 py-18 overflow-hidden"
      id="about"
    >
      <div className=" flex flex-col h-full justify-between">
        <div
          className=" w-full font-normal text-[7.7rem] text-white leading-snug     "
          style={{ fontFamily: '"Work Sans", sans-serif' }}
        >
          <h1>
            WE’RE A GLOBAL{" "}
            <span style={{ fontFamily: '"Nanum Myeongjo", sans-serif' }}>
              {" "}
              CREATIVE &
            </span>
          </h1>
          <h1
            className="font-normal text-[8rem]"
            style={{ fontFamily: '"Nanum Myeongjo", sans-serif' }}
          >
            INNOVATION{" "}
            <span
              className="absolute end-16  "
              style={{ fontFamily: '"Work Sans", sans-serif' }}
            >
              STUDIO
            </span>
          </h1>
        </div>
        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={400}
          height={400}
          className="-z-20 absolute inset-0 -left-64 top-20 object-contain "
        />
        <Image
          src="/gradients/sky_gradient_white.png"
          alt="gradient"
          width={600}
          height={600}
          className="-z-20 absolute rotate-220  -right-70 top-100 object-contain "
        />
        <Image
          src="/AboutImages/World.svg"
          alt="World"
          fill
          priority
          className="-z-10 pt-18 absolute"
        />
        <div className="relative paragraph text-white leading-11  text-[2rem] max-w-5xl px-8 tracking-normal mt-80 ">
          <p
            className="w-full  "
            style={{ fontFamily: '"Work Sans", sans-serif' }}
          >
            Born from social and inspired by culture, we’re champions of
            storytelling across the platforms and technologies that shape the
            internet; today and tomorrow. We work with global brands to connect
            the dots in a maze of swipe, tap, forgettable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
