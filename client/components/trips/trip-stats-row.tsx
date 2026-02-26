"use client";

import { CheckCircle2, MapPin, Phone, Timer } from "lucide-react";

import type { Trip } from "@/store/trip.store";

interface TripStatsRowProps {
  trips: Trip[];
}

const TripStatsRow = ({ trips }: TripStatsRowProps) => {
  const totalDurationMinutes = Math.round(
    trips.reduce((acc, trip) => acc + (trip.callDuration || 0), 0) / 60,
  );
  const completed = trips.filter((t) => t.callStatus === "ended").length;
  const destinations = trips.filter((t) => t.tripDetails?.destination).length;
  const completedPct =
    trips.length > 0 ? Math.round((completed / trips.length) * 100) : 0;

  const stats = [
    {
      icon: Phone,
      label: "Total Calls",
      value: trips.length,
      sub: "all time",
      accent: "#3b82f6",
      bar: 100,
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completed,
      sub: `${completedPct}% success rate`,
      accent: "#10b981",
      bar: completedPct,
    },
    {
      icon: MapPin,
      label: "Destinations",
      value: destinations,
      sub: "places planned",
      accent: "#8b5cf6",
      bar:
        trips.length > 0 ? Math.round((destinations / trips.length) * 100) : 0,
    },
    {
      icon: Timer,
      label: "Talk Time",
      value: `${totalDurationMinutes}m`,
      sub: "total duration",
      accent: "#f59e0b",
      bar: Math.min(100, totalDurationMinutes),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, sub, accent, bar }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-white/6 bg-[#0d0d0d] p-5 transition-all hover:border-white/10"
        >
          {/* Subtle glow on hover */}
          <div
            className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
            style={{ background: accent }}
          />

          <div className="mb-4 flex items-center justify-between">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: `${accent}18`,
                border: `1px solid ${accent}30`,
              }}
            >
              <Icon className="h-4 w-4" style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
              {sub}
            </span>
          </div>

          <p className="text-3xl font-black text-white tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs font-medium text-zinc-500">{label}</p>

          {/* Progress bar */}
          <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${bar}%`,
                background: `linear-gradient(to right, ${accent}80, ${accent})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripStatsRow;
