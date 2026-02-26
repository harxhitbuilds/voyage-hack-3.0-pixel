"use client";

import { Plane, Sparkles } from "lucide-react";

import type { Trip } from "@/store/trip.store";

import TripTableRow from "./trip-table-row";

interface TripTableProps {
  trips: Trip[];
}

const TripTable = ({ trips }: TripTableProps) => {
  const active = trips.filter(
    (t) => t.callStatus === "in-progress" || t.callStatus === "ringing",
  ).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0d0d0d]">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
          <Plane className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Your Trips</h3>
          <p className="text-xs text-zinc-600">
            AI-planned travel conversations
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {active > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {active} live
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs font-medium text-zinc-400">
            <Sparkles className="h-3 w-3 text-violet-400" />
            {trips.length} {trips.length === 1 ? "trip" : "trips"}
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1.2fr_auto] items-center gap-4 border-b border-white/4 bg-white/2 px-6 py-2.5 md:grid">
        {[
          "Destination",
          "Status",
          "Duration",
          "Travelers",
          "Budget",
          "Created",
          "",
        ].map((col) => (
          <span
            key={col}
            className="text-[9px] font-bold tracking-[0.12em] text-zinc-600 uppercase"
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/4">
        {trips.map((trip) => (
          <TripTableRow key={trip._id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default TripTable;
