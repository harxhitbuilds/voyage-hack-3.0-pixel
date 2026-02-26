"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { slides } from "@/constants/index";

export const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const go = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((idx + slides.length) % slides.length);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning],
  );

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [current, go]);

  if (!slides?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-900">
        <p className="text-sm text-zinc-600">No content available</p>
      </div>
    );
  }

  return (
    <div className="group relative h-full w-full overflow-hidden bg-black select-none">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          {/* Multi-layer gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 p-7">
            {/* Slide label */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                Featured
              </span>
            </div>
            <h3 className="text-3xl leading-tight font-black tracking-tight text-white drop-shadow-lg">
              {slide.title}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-zinc-300/80 drop-shadow">
              {slide.description}
            </p>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button
        onClick={() => go(current - 1)}
        className="absolute top-1/2 left-4 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:border-white/30 hover:bg-black/70"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute top-1/2 right-4 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:border-white/30 hover:bg-black/70"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Progress dots */}
      <div className="absolute right-7 bottom-7 z-20 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "h-1.5 w-6 bg-white"
                : "h-1.5 w-1.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-5 right-5 z-20 rounded-full border border-white/15 bg-black/50 px-3 py-1 backdrop-blur-sm">
        <span className="text-[11px] font-bold text-white/70 tabular-nums">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};
