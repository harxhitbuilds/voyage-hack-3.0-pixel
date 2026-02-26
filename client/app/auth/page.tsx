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
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  return (
    <div className="relative h-screen min-h-screen w-full bg-black px-56 py-12">
      <motion.div
        className="absolute inset-0 z-0"
        animate={controls}
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 10%, #000000 40%, #f59e0b 100%)
          `,
        }}
      />
      <div className="relative z-10 flex h-full items-center justify-between rounded-xl border border-zinc-900 bg-black p-2">
        <AuthVideo />
        <AuthCard />
      </div>
    </div>
  );
};
export default AuthPage;
