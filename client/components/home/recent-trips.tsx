"use client";

import { ChevronRight, MapPin, Plane, Star } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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

const planTypeColors: Record<string, string> = {
  solo: "bg-blue-500/10 text-blue-400",
  couple: "bg-pink-500/10 text-pink-400",
  family: "bg-amber-500/10 text-amber-400",
  group: "bg-green-500/10 text-green-400",
};

const RecentTripsSection = () => {
  return (
    <div className="flex h-full flex-col bg-zinc-900/60 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold tracking-tight text-white">
            Recent Trips
          </h2>
        </div>
        <Link
          href="/my-trips"
          className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-white"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {recentTrips.length > 0 ? (
          (recentTrips as Trip[]).slice(0, 5).map((trip) => (
            <div
              key={trip.id}
              className="group flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition-all hover:border-zinc-700 hover:bg-zinc-800/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <MapPin className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {trip.destination}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">{trip.date}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      planTypeColors[trip.planType] ??
                      "bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {trip.planType}
                  </span>
                  <span className="text-xs text-zinc-600">{trip.budget}</span>
                  {trip.rating && (
                    <span className="ml-auto flex items-center gap-0.5 text-xs text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {trip.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800">
              <Plane className="h-5 w-5 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-500">No recent trips found</p>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
            >
              Plan your first trip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTripsSection;
