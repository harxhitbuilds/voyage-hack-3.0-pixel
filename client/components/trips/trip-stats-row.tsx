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
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completed,
      sub: `${completedPct}% success`,
    },
    {
      icon: MapPin,
      label: "Destinations",
      value: destinations,
      sub: "planned",
    },
    {
      icon: Timer,
      label: "Talk Time",
      value: `${totalDurationMinutes}m`,
      sub: "duration",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, sub }) => (
        <div
          key={label}
          className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 p-5 transition-colors hover:border-zinc-700"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <Icon className="h-4 w-4 text-zinc-400" />
            </div>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
              {sub}
            </span>
          </div>

          <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs font-medium text-zinc-500">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default TripStatsRow;
