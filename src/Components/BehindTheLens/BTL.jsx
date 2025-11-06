"use client";
import React, { useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import BehindSection from "./BehindSection";
import useBTLAnimations from "./useBTLAnimations";
import Status from "./Status";

const BTL = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textRef = useRef(null);
  const BehindTLRef = useRef(null);
  const BehindImgRef = useRef(null);
  const BehindCardRef = useRef(null);
  const tRef = useRef(null);
  const typingRef  = useRef(null);



  useBTLAnimations(sectionRef, imageContainerRef, textRef , BehindTLRef ,BehindImgRef,BehindCardRef,tRef,typingRef );

  return (
    <>
      <HeroSection
        sectionRef={sectionRef}
        imageContainerRef={imageContainerRef}
        textRef={textRef}
      />
      <BehindSection BehindTLRef={BehindTLRef} BehindImgRef={BehindImgRef} BehindCardRef={BehindCardRef} tRef={tRef} typingRef={typingRef} />
      <Status />
    </>
  );
};

export default BTL;
