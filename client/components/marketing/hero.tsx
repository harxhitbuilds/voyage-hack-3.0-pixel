"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./land-btn";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const [loading, setLoading] = useState(true);

  const totalVideos = 4;
  const nextVdRef = useRef<HTMLVideoElement>(null);

  const handleMainVideoReady = () => {
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleMiniVdClick = () => {
    setHasClicked(true);

    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1.5, // increased from 1 for slower expansion
          ease: "power1.inOut",
          onStart: () => {
            nextVdRef.current?.play();
          },
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 2, // increased from 1.5 for slower transition
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    },
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
      duration: 1.5, // Added duration to potentially slow down if scrub wasn't controlling it fully, though scrub makes it scroll-dependent. The ease is already smooth.
    });
  });

  const getVideoSrc = (index: number) => `videos/herosection.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* Loading overlay with fade-out */}
      <div
        className={`flex-center absolute z-100 h-dvh w-screen overflow-hidden bg-violet-50 transition-opacity duration-700 ${
          loading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>

      <div
        id="video-frame"
        className="bg-blue-75 relative z-10 h-dvh w-screen overflow-hidden rounded-lg"
      >
        <div>
          {/* Mini video click target — smaller on mobile */}
          <div className="mask-clip-path absolute-center absolute z-50 size-40 cursor-pointer overflow-hidden rounded-lg sm:size-52 md:size-64">
            <div
              onClick={handleMiniVdClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={nextVdRef}
                src={getVideoSrc((currentIndex % totalVideos) + 1)}
                loop
                muted
                playsInline
                id="current-video"
                className="size-40 origin-center scale-150 object-cover object-center sm:size-52 md:size-64"
              />
            </div>
          </div>

          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            playsInline
            id="next-video"
            className="absolute-center invisible absolute z-20 size-40 object-cover object-center sm:size-52 md:size-64"
          />
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex,
            )}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 size-full object-cover object-center"
            onCanPlayThrough={handleMainVideoReady}
            onLoadedData={handleMainVideoReady}
          />
        </div>

        {/* Bottom-right NIMBUS inside video frame */}
        <h1 className="special-font hero-heading text-blue-75 absolute right-3 bottom-3 z-40 sm:right-5 sm:bottom-5">
          N<b>I</b>M<b>BU</b>S
        </h1>

        <div className="absolute top-0 left-0 z-40 size-full">
          <div className="mt-16 px-4 sm:mt-24 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              EXPLORE <br /> INDIA
            </h1>

            <p className="font-robert-regular mt-2 mb-4 max-w-64 text-sm text-blue-100 sm:mb-5 sm:max-w-72 sm:text-base">
              Command the Journey. <br />
              Architect the Experience
            </p>
            <a href="/auth">
              <Button
                id="watch-trailer"
                title="Start Journey"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom-right NIMBUS outside video frame (parallax layer) */}
      <h1 className="special-font hero-heading absolute right-3 bottom-3 text-black sm:right-5 sm:bottom-5">
        NIMBUS
      </h1>
    </div>
  );
};

export default Hero;
