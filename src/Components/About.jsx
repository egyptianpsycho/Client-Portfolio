import React from "react";

const About = () => {
  return (
    <section
      className=" second relative h-screen bg-gradient-to-tr from-[#000000] to-[#2d1d1d] z-[10]  px-10 py-18"
      id="about"
    >
      <div
        className=" w-full font-normal text-[7.5rem] text-white leading-snug     "
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
          className="font-normal text-[7rem]"
          style={{ fontFamily: '"Nanum Myeongjo", sans-serif' }}
        >
          INNOVATION{" "}
          <span
            className="absolute end-20  "
            style={{ fontFamily: '"Work Sans", sans-serif' }}
          >
            STUDIO
          </span>
        </h1>
      </div>
    </section>
  );
};

export default About;
