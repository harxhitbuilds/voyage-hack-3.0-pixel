"use client";

import {
  ArrowRight,
  Box,
  Compass,
  Globe,
  MapPin,
  Mic,
  Zap,
} from "lucide-react";
import Link from "next/link";

import RecentTripsSection from "@/components/home/recent-trips";
import { Slider } from "@/components/home/slider";
import { useAuthStore } from "@/store/auth.store";

const stats = [
  {
    icon: Globe,
    label: "Monuments",
    value: "500+",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Box,
    label: "3D Models",
    value: "120+",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Compass,
    label: "VR Tours",
    value: "80+",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: MapPin,
    label: "Cities",
    value: "40+",
    color: "from-amber-500 to-orange-500",
  },
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
      <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-[#0a0a0a]">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />

        <div className="relative px-8 py-10 md:px-12">
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">
              {greeting}
            </span>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-5xl leading-[1.05] font-black tracking-tight text-white md:text-6xl">
                Welcome back,{" "}
                <span className="relative">
                  <span className="bg-linear-to-r from-blue-400 via-violet-400 to-blue-300 bg-clip-text text-transparent">
                    {firstName}
                  </span>
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-linear-to-r from-blue-500/50 to-transparent" />
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
                Explore India's living heritage through AI-guided trips,
                immersive AR models, and cinematic VR experiences.
              </p>

              {/* Action buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/home/trips"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
                >
                  <Mic className="h-4 w-4" />
                  New AI Trip
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </Link>
                <Link
                  href="/home/experience"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <Compass className="h-4 w-4" />
                  Explore Heritage
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
              {stats.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="group relative overflow-hidden rounded-2xl border border-white/6 bg-white/3 p-4 text-center backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/6"
                >
                  <div
                    className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br ${color} p-px`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0a0a0a]">
                      <Icon className="h-3.5 w-3.5 text-zinc-300" />
                    </div>
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
          <div className="mt-6 flex items-center gap-2">
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
              Powered by Nimbus AI
            </span>
          </div>
        </div>
      </div>

      {/* ── Slider + Recent Trips ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-105 overflow-hidden rounded-2xl border border-white/6 shadow-2xl shadow-black/60 lg:col-span-2">
          <Slider />
        </div>
        <div className="h-105 overflow-hidden rounded-2xl border border-white/6">
          <RecentTripsSection />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
