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
    <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-zinc-800/60 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
          <Plane className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Your Trips</h3>
          <p className="text-xs text-zinc-500">
            AI-planned travel conversations
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {active > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400" />
              {active} live
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
            <Sparkles className="h-3 w-3 text-zinc-400" />
            {trips.length} {trips.length === 1 ? "trip" : "trips"}
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1.2fr_auto] items-center gap-4 border-b border-zinc-800/40 bg-zinc-900/30 px-6 py-2.5 md:grid">
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
      <div className="divide-y divide-zinc-800/40">
        {trips.map((trip) => (
          <TripTableRow key={trip._id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default TripTable;
