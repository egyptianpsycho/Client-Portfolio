import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <section
      className=" second relative h-screen bg-gradient-to-tr from-[#000000] to-[#2d1d1d] z-[10]  px-10 py-18"
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
          src="/AboutImages/World.svg"
          alt="World"
          fill
          priority
          className="-z-10 pt-18 absolute"
        />
        <div className="relative paragraph text-white leading-11  text-[2rem] max-w-5xl px-8 tracking-normal mt-80 ">
          <p
            className="w-full "
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
