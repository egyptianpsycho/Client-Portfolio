"use client";
import React, { useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import BehindSection from "./BehindSection";
import useBTLAnimations from "./useBTLAnimations";

const BTL = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textRef = useRef(null);
  const BehindTLRef = useRef(null);

  useBTLAnimations(sectionRef, imageContainerRef, textRef , BehindTLRef);

  return (
    <>
      <HeroSection
        sectionRef={sectionRef}
        imageContainerRef={imageContainerRef}
        textRef={textRef}
      />
      <BehindSection BehindTLRef={BehindTLRef} />
    </>
  );
};

export default BTL;
