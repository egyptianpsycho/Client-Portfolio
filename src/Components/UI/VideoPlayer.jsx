"use client";
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause } from "lucide-react"; // clean lightweight icons

const VideoPlayer = ({ src, poster, classN }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="relative w-full h-full group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        poster={poster}
        className={`w-full h-full object-cover  ${classN}`}
        playsInline
      />

      {/* Overlay icon */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 transition-opacity duration-300 ease-out">
          {isPlaying ? (
            <Pause className="text-white w-12 h-12 opacity-80" />
          ) : (
            <Play className="text-white w-12 h-12 opacity-80" />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

// "use client";
// import React, { useEffect, useRef } from "react";
// import Hls from "hls.js";

// const VideoPlayer = ({ src, poster,classN }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (Hls.isSupported()) {
//       const hls = new Hls();
//       hls.loadSource(src);
//       hls.attachMedia(videoRef.current);
//     } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
//       // For Safari
//       videoRef.current.src = src;
//     }
//   }, [src]);
// const handleClick = () => {
//   const video = videoRef.current;
//   if (!isPlaying) {
//     video.play();
//     setIsPlaying(true);
//   } else {
//     video.pause();
//     setIsPlaying(false);
//   }
// };

//   return (
//     <video
//       ref={videoRef}
//       poster={poster}
//       className={`w-full h-full cursor-pointer  ${classN}`}
//       preload="none"
//       playsInline
//      onClick={handleClick}

//     />
//   );
// };

// export default VideoPlayer;
