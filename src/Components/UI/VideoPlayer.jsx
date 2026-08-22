"use client";
import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import { Loader2 } from "lucide-react";
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const VideoPlayer = ({ src, poster, classN }) => {
  const videoRef = useRef(null);
  const [hls, setHls] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [showIcon, setShowIcon] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hideTimeoutRef = useRef(null);

  // ── Duration & Progress States ─────────────────────────────────────────
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const togglePlay = async (e) => {
    e.stopPropagation();
    const video = videoRef.current;
  
    if (!hls && Hls.isSupported()) {
      const newHls = new Hls();
      newHls.loadSource(src);
      newHls.attachMedia(video);
      setHls(newHls);
  
      newHls.on(Hls.Events.BUFFER_STALLED, () => setIsLoading(true));
      newHls.on(Hls.Events.BUFFER_APPENDED, () => setIsLoading(false));
    } else if (!hls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  
    setShowIcon(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowIcon(false), 2000);
  
    await wait(300);
  
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      return;
    }
  
    setIsLoading(true);
    video.play().catch(() => setIsLoading(false));
  };

  useEffect(() => {
    const video = videoRef.current;
    
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePause = () => setIsPlaying(false);

    video?.addEventListener("playing", handlePlaying);
    video?.addEventListener("waiting", handleWaiting);
    video?.addEventListener("pause", handlePause);

    return () => {
      video?.removeEventListener("playing", handlePlaying);
      video?.removeEventListener("waiting", handleWaiting);
      video?.removeEventListener("pause", handlePause);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // ── Format Time Helper ─────────────────────────────────────────────────
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // ── Seek Handler for the Slider ────────────────────────────────────────
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setProgress(e.target.value);
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
        className={`w-full h-full object-cover ${classN}   `}
        playsInline
        preload="none"
        loop
        // Track time and duration dynamically
        onTimeUpdate={(e) => {
          setCurrentTime(e.target.currentTime);
          if (e.target.duration) {
            setProgress((e.target.currentTime / e.target.duration) * 100);
          }
        }}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
      />

      {isLoading  && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {!isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none z-10
          ${isHovered || showIcon ? "opacity-100" : "opacity-0"}`}
        >
          <button
            className="play-pause-btn pointer-events-none max-sm:scale-70"
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            data-playing={isPlaying}
          >
            <svg
              className="play-pause-btn__svg"
              viewBox="0 0 100 100"
              width="80px"
              height="80px"
              aria-hidden="true"
            >
              <g
                fill="none"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="7"
              >
                <circle cx="50" cy="50" r="46" opacity="0.2" />
                <line className="play-pause-btn__svg-line1" x1="42" y1="30" x2="42" y2="70" />
                <line className="play-pause-btn__svg-line2" x1="42" y1="70" x2="70" y2="50" />
                <line className="play-pause-btn__svg-line3" x1="70" y1="50" x2="42" y2="30" />
                <circle className="play-pause-btn__svg-ring1" cx="50" cy="50" r="46" />
                <path
                  className="play-pause-btn__svg-ring2"
                  strokeDasharray="55 365"
                  strokeDashoffset="55"
                  d="M 41.996 4.631 C 41.996 4.631 47.464 3.48 52.3 7.107 C 58.062 11.43 58 18 58 18 L 58 70"
                />
                <path
                  className="play-pause-btn__svg-ring3"
                  strokeDasharray="40 365"
                  strokeDashoffset="40"
                  d="M 41.996 4.631 C 41.996 4.631 47.464 3.48 52.3 7.107 C 58.062 11.43 58 18 58 18 L 58 76"
                  transform="scale(1, -1)"
                />
              </g>
            </svg>
          </button>
        </div>
      )}

      {/* ── Custom Duration & Progress Bar ─────────────────────────────────── */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3 z-30 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        onClick={(e) => e.stopPropagation()} // Stop click from playing/pausing video when dragging slider
      >
        <span className="text-white text-xs font-mono">{formatTime(currentTime)}</span>
        
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer hover:h-1.5 transition-all
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                     [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white 
                     [&::-webkit-slider-thumb]:rounded-full"
        />
        
        <span className="text-white text-xs font-mono">{formatTime(duration)}</span>
      </div>
      
    </div>
  );
};

export default VideoPlayer;