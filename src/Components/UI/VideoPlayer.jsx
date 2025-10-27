"use client";
import React, { useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Loader2 } from "lucide-react";

const VideoPlayer = ({ src, poster, classN }) => {
  const videoRef = useRef(null);
  const [hls, setHls] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;

    // Initialize HLS only on first click
    if (!hls && Hls.isSupported()) {
      const newHls = new Hls();
      newHls.loadSource(src);
      newHls.attachMedia(video);
      setHls(newHls);

      // Listen for buffering events
      newHls.on(Hls.Events.BUFFER_STALLED, () => setIsLoading(true));
      newHls.on(Hls.Events.BUFFER_APPENDED, () => setIsLoading(false));
    } else if (!hls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 2000);
    } else {
      // Show spinner immediately when attempting to play
      setIsLoading(true);
      video.play();
    }

    // Handle events properly
    video.onplaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 2000);
    };

    video.onwaiting = () => setIsLoading(true);
  };

  return (
    <div
      className="relative w-full h-full group cursor-pointer"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        poster={poster}
        className={`w-full h-full object-cover ${classN}`}
        playsInline
        preload="none"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {/* Play/Pause Icon (only when not loading) */}
      {!isLoading && (
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
      )}
    </div>
  );
};

export default VideoPlayer;
