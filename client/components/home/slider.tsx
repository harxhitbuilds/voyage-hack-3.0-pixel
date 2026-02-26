"use client";

import { useEffect, useState } from "react";

import { slides } from "@/constants/index";

export const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!slides || slides.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">No featured content available</p>
      </div>
    );
  }

  return (
    <div className="group relative h-full w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
            index === currentSlide ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          {/* Gradient layers */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 p-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-white/90">
                Featured
              </span>
            </div>
            <h3 className="text-2xl leading-tight font-bold tracking-tight text-white">
              {slide.title}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-zinc-300/80">
              {slide.description}
            </p>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute right-7 bottom-7 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "h-2 w-6 bg-white"
                : "h-2 w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-5 right-5 z-20 rounded-full border border-white/20 bg-black/40 px-3 py-1 backdrop-blur-sm">
        <span className="text-xs font-medium text-white/70">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
};
