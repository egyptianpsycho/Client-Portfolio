
"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ images, cover }) => {
  const allImages = cover ? [cover, ...images] : images;
  const swiperRef = useRef(null);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* Swiper Container */}
      <div className="w-full relative">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[FreeMode]}
          spaceBetween={20}
          slidesPerView={1}
          freeMode={true}
          centeredSlides={true}
          grabCursor={true}
          className="w-full max-w-full"
        >
          {allImages.map((img, idx) => (
            <SwiperSlide
              key={idx}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-[500px] rounded-xl overflow-hidden">
                <img
                  src={img}
                  alt={`slide-${idx}`}
                  className="w-full h-auto carousel-img rounded-xl object-cover"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons - Desktop */}
        <div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-4 z-10">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-2 bg-gray-600/40 hover:bg-gray-600/60 cursor-pointer rounded-full transition-all duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-2 bg-gray-600/40 cursor-pointer hover:bg-gray-600/60 rounded-full transition-all duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons - Mobile (below carousel) */}
      <div className="flex md:hidden justify-center gap-4 mt-4 z-10  ">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="p-2 bg-gray-600/40 hover:bg-gray-600/60 cursor-pointer rounded-full transition-all duration-200 "
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="p-2 bg-gray-600/40 cursor-pointer hover:bg-gray-600/60 rounded-full transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;