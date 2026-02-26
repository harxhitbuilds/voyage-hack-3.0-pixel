"use client";
import { motion, useAnimation } from "motion/react";

import { useEffect } from "react";

import AuthCard from "@/components/auth/auth-card";
import AuthVideo from "@/components/auth/auth-video";

const AuthPage = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      backgroundPosition: [
        "50% 10%",
        "52% 15%",
        "48% 12%",
        "53% 18%",
        "50% 10%",
      ],
      backgroundSize: [
        "100% 100%",
        "110% 110%",
        "105% 105%",
        "115% 120%",
        "100% 100%",
      ],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    });
  }, [controls]);

  return (
    <div className="relative min-h-screen w-full bg-black px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-20 lg:py-12">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={controls}
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 10%, #000000 40%, #f59e0b 100%)`,
        }}
      />

      {/* Content card */}
      <div className="relative z-10 flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-black sm:min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] md:flex-row">
        {/* Video panel — hidden on mobile, shown md+ */}
        <AuthVideo />

        {/* Auth card — full width on mobile, flex-1 on md+ */}
        <div className="flex flex-1 items-center justify-center py-10 md:py-0">
          <AuthCard />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
