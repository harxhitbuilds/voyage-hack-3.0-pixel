"use client";

import { Clock, MapPin, Phone, Timer } from "lucide-react";

import type { Trip } from "@/store/trip.store";

interface TripStatsRowProps {
  trips: Trip[];
}

const TripStatsRow = ({ trips }: TripStatsRowProps) => {
  const totalDurationMinutes = Math.round(
    trips.reduce((acc, trip) => acc + (trip.callDuration || 0), 0) / 60,
  );

  const stats = [
    {
      icon: Phone,
      label: "Total Calls",
      value: trips.length,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Clock,
      label: "Completed",
      value: trips.filter((t) => t.callStatus === "ended").length,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: MapPin,
      label: "With Destinations",
      value: trips.filter((t) => t.tripDetails?.destination).length,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: Timer,
      label: "Total Duration",
      value: `${totalDurationMinutes}m`,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 backdrop-blur-sm"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${bg}`}
          >
            <Icon className={`h-4 w-4 ${color}`} />
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
  );
};

export default TripStatsRow;
