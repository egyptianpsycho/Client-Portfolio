"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ images,cover }) => {
    const allImages = cover ? [cover, ...images] : images;

  const swiperRef = useRef(null);

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[FreeMode]}
        spaceBetween={20}
        slidesPerView={1}
        freeMode={true}
        centeredSlides={true}
        grabCursor={true}
        className="w-full max-w-[800px]"
      >
        {allImages.map((img, idx) => (
          <SwiperSlide key={idx} className="!w-[500px] rounded-xl overflow-hidden ">
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full rounded-xl object-cover "
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center gap-4 mt-4  z-9 absolute ">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute
            right-50 top-70 p-2 bg-gray-600/40 hover:bg-gray-600/60 cursor-pointer rounded-full transition"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className=" absolute top-70 right-35  p-2 bg-gray-600/40 cursor-pointer hover:bg-gray-600/60 rounded-full transition"

        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
