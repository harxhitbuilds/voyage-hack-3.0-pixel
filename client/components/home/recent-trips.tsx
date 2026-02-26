"use client";

import { ArrowRight, MapPin, Plane, Star } from "lucide-react";
import Link from "next/link";

import { recentTrips } from "@/constants/index";

interface Trip {
  id: number;
  destination: string;
  date: string;
  planType: string;
  arViewed?: boolean;
  rating?: number;
  hasAR: boolean;
  has3D: boolean;
  hasVR: boolean;
  budget: string;
  participants: number;
}

const typeAccent: Record<string, { dot: string; label: string }> = {
  solo: {
    dot: "bg-blue-400",
    label: "text-blue-400 border-blue-500/20 bg-blue-500/8",
  },
  couple: {
    dot: "bg-pink-400",
    label: "text-pink-400 border-pink-500/20 bg-pink-500/8",
  },
  family: {
    dot: "bg-amber-400",
    label: "text-amber-400 border-amber-500/20 bg-amber-500/8",
  },
  group: {
    dot: "bg-green-400",
    label: "text-green-400 border-green-500/20 bg-green-500/8",
  },
};

const RecentTripsSection = () => {
  return (
    <div className="flex h-full flex-col bg-[#0d0d0d]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/5">
            <Plane className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <h2 className="text-sm font-bold text-white">Recent Trips</h2>
        </div>
        <Link
          href="/home/trips"
          className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600 transition-colors hover:text-white"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List */}
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 flex-1 space-y-1.5 overflow-y-auto p-3">
        {recentTrips.length > 0 ? (
          (recentTrips as Trip[]).slice(0, 5).map((trip) => {
            const accent = typeAccent[trip.planType] ?? {
              dot: "bg-zinc-500",
              label: "text-zinc-400 border-zinc-700 bg-zinc-800/50",
            };
            return (
              <div
                key={trip.id}
                className="group relative flex items-start gap-3 overflow-hidden rounded-xl border border-white/5 bg-white/2 px-3.5 py-3 transition-all hover:border-white/8 hover:bg-white/4"
              >
                {/* Left accent bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-0.5 rounded-l-xl ${accent.dot}`}
                />

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {trip.destination}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-600">
                    {trip.date}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${accent.label}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
                      />
                      {trip.planType}
                    </span>
                    <span className="text-[11px] text-zinc-600">
                      {trip.budget}
                    </span>
                    {trip.rating && (
                      <span className="ml-auto flex items-center gap-0.5 text-[11px] text-amber-400">
                        <Star className="h-2.5 w-2.5 fill-amber-400" />
                        {trip.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
              <Plane className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-400">
                No trips yet
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Start an AI trip call to get going
              </p>
            </div>
            <Link
              href="/home/trips"
              className="rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-white/12 hover:text-white"
            >
              Plan your first trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTripsSection;
