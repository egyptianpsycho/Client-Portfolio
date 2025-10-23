"use client";
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause } from "lucide-react"; 

const VideoPlayer = ({ src, poster, classN }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

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
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 3000);
  };

  return (
    <div
      className="relative w-full h-full group cursor-pointer"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        poster={poster}
        className={`w-full h-full object-cover  ${classN}`}
        playsInline
        preload="none"
      />

      {/* Overlay icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/30 
        transition-opacity duration-500 ease-out pointer-events-none 
        ${showIcon ? "opacity-100" : "opacity-0"}`}
      >
        {isPlaying ? (
          <Pause className="text-white w-12 h-12 opacity-80" />
        ) : (
          <Play className="text-white w-12 h-12 opacity-80" />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
