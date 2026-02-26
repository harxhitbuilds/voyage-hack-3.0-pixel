"use client";

import { Compass, Globe, MapPin, TrendingUp } from "lucide-react";

import RecentTripsSection from "@/components/home/recent-trips";
import { Slider } from "@/components/home/slider";
import { useAuthStore } from "@/store/auth.store";

const stats = [
  { icon: Globe, label: "Monuments", value: "500+" },
  { icon: Compass, label: "AR Experiences", value: "120+" },
  { icon: TrendingUp, label: "VR Tours", value: "80+" },
  { icon: MapPin, label: "Cities Covered", value: "40+" },
];

const HomeHeader = () => {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] || "Traveler";

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back,{" "}
          <span className="bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            {firstName}
          </span>
        </h1>
        <p className="text-sm text-zinc-500">
          Explore India's heritage through immersive AR, VR and 3D experiences.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 backdrop-blur-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Icon className="h-4 w-4 text-zinc-300" />
            </div>
            <div>
              <p className="text-base leading-none font-bold text-white">
                {value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Slider + Recent Trips */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-105 overflow-hidden rounded-2xl border border-zinc-800 shadow-lg lg:col-span-2">
          <Slider />
        </div>
        <div className="h-105 overflow-hidden rounded-2xl border border-zinc-800">
          <RecentTripsSection />
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
