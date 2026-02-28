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
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          <span className="text-xs font-semibold tracking-widest text-zinc-600 uppercase">
            Loading trips…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-8 px-8 py-10 pb-24 md:px-8">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/50 px-3 py-1.5">
            <Sparkles className="h-3 w-3 text-zinc-400" />
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              AI Travel Planner
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Your Trips
          </h1>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Manage and track all your AI-guided travel conversations in one
            place.
          </p>
          {trips.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
                <Phone className="h-3 w-3 text-zinc-400" />
                {trips.length} {trips.length === 1 ? "trip" : "trips"} total
              </span>
              {trips.filter((t) => t.callStatus === "ended").length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
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
          className="shrink-0 gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
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

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3.5">
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
