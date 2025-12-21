"use client";
import React, {  useRef } from "react";
import BehindSection from "./BehindSection";
import useBTLAnimations from "./useBTLAnimations";
import Status from "./Status";

const BTL = () => {
  const BehindTLRef = useRef(null);
  const BehindImgRef = useRef(null);



  // useBTLAnimations(BehindTLRef ,BehindImgRef);

  return (
    <>
      <BehindSection BehindTLRef={BehindTLRef} BehindImgRef={BehindImgRef}  />
      <Status />
      
    </>
  );
};

export default BTL;
