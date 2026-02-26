"use client";

import { Loader2, Phone, Plus, Sparkles } from "lucide-react";

import { useEffect, useState } from "react";

import EmptyTrips from "@/components/trips/empty-trips";
import TripStatsRow from "@/components/trips/trip-stats-row";
import TripTable from "@/components/trips/trip-table";
import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/trip.store";

export default function TripsPage() {
  const { trips, loading, error, fetchTrips, createCall } = useTripStore();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleCreateCall = async () => {
    setIsCreating(true);
    try {
      await createCall();
    } catch {
      // error is handled in the store
    } finally {
      setIsCreating(false);
    }
  };

  /* ── Loading state ── */
  if (loading && trips.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
          <span className="text-xs font-semibold tracking-widest text-zinc-700 uppercase">
            Loading trips…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 px-1 py-8 pb-24">
      {/* ── Page Hero ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-[#0a0a0a]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-violet-600/8 blur-[80px]" />
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative flex items-start justify-between gap-6 px-8 py-8 md:px-10">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Sparkles className="h-3 w-3 text-violet-400" />
              <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                AI Travel Planner
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Your Trips
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
              Manage and track all your AI-guided travel conversations in one
              place.
            </p>
            {trips.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs font-medium text-zinc-400">
                  <Phone className="h-3 w-3" />
                  {trips.length} {trips.length === 1 ? "trip" : "trips"} total
                </span>
                {trips.filter((t) => t.callStatus === "ended").length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs font-medium text-emerald-400">
                    ✓ {trips.filter((t) => t.callStatus === "ended").length}{" "}
                    completed
                  </span>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleCreateCall}
            disabled={isCreating}
            className="shrink-0 gap-2.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:shadow-blue-500/30 disabled:opacity-60"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> New Trip
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-2xl border border-red-500/15 bg-red-500/5 px-5 py-3.5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Stats ── */}
      {trips.length > 0 && <TripStatsRow trips={trips} />}

      {/* ── Table or Empty ── */}
      {trips.length === 0 ? (
        <EmptyTrips onCreateCall={handleCreateCall} isCreating={isCreating} />
      ) : (
        <TripTable trips={trips} />
      )}
    </div>
  );
}
