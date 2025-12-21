"use client";
import React, { useRef } from "react";
import HeroSection from "./HeroSection";
import useBTLAnimations from "./useBTLAnimations";
import Status from "./Status";

const BTL = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textRef = useRef(null);


  useBTLAnimations(sectionRef, imageContainerRef, textRef  );

  return (
    <>
    <Status />
      <HeroSection
        sectionRef={sectionRef}
        imageContainerRef={imageContainerRef}
        textRef={textRef}
      />
    </>
  );
};

export default BTL;
