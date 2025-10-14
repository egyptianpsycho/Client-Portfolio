import React from "react";

const BehindSection = ({ BehindTLRef }) => {
  return (
    <section
      id="second-section"
      className="h-screen flex justify-center items-center 
      bg-gradient-to-bl to-[#000000] from-[#0a212b] text-white relative"
    >
      <div
        ref={BehindTLRef}
        className="subtitle behind-text absolute top-[-40%] right-[1%] max-w-lg text-left"
      >
        <h2 className="text-5xl font-bold mb-4 text-gradient">
          The Man Behind the Scene
        </h2>
        <p className="text-lg text-[#9ca3af] leading-relaxed">
          Meet Abbas — a storyteller whose lens reveals emotion beyond frames.
          Every image he captures is a glimpse into the unseen beauty that
          defines human connection.
        </p>
      </div>
    </section>
  );
};

export default BehindSection;
