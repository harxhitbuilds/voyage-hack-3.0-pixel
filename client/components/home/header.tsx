"use client";

import { ArrowRight, Box, Compass, Globe, MapPin, Mic } from "lucide-react";
import Link from "next/link";

import RecentTripsSection from "@/components/home/recent-trips";
import { Slider } from "@/components/home/slider";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "../ui/button";

const stats = [
  { icon: Globe, label: "Monuments", value: "8+" },
  { icon: Box, label: "3D Models", value: "8+" },
  { icon: Compass, label: "VR Tours", value: "8+" },
  { icon: MapPin, label: "Cities", value: "8+" },
];

const HomeHeader = () => {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] || "Traveler";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <div>
        {/* Eyebrow */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/50 px-3.5 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-400" />
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
            {greeting}
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl leading-[1.05] font-black tracking-tight text-white md:text-4xl">
              Welcome back, <span className="text-zinc-300">{firstName}</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">
              Explore India's living heritage through AI-guided trips, immersive
              AR models, and cinematic VR experiences.
            </p>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/home/trips">
                <Button
                  variant="outline"
                  className="gap-2 rounded-lg border-zinc-800 bg-transparent text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <Mic className="h-4 w-4" />
                  New AI Trip
                </Button>
              </Link>
              <Link href="/home/experience">
                <Button className="gap-2 rounded-lg bg-white text-sm font-semibold text-black hover:bg-zinc-200">
                  <Compass className="h-4 w-4" />
                  Explore Heritage
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="group h-28 w-28 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 p-4 text-center transition-colors hover:border-zinc-700"
              >
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <Icon className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <p className="text-xl font-black text-white tabular-nums">
                  {value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-zinc-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Powered by pill */}
        <div className="mt-5 flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
            Powered by Nimbus AI
          </span>
        </div>
      </div>

      {/* ── Slider + Recent Trips ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-105 overflow-hidden rounded-xl border border-zinc-800/60 shadow-2xl shadow-black/60 lg:col-span-2">
          <Slider />
        </div>
        <div className="h-105 overflow-hidden rounded-xl border border-zinc-800/60">
          <RecentTripsSection />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
