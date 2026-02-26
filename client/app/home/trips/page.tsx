"use client";

import { Loader2, Plus } from "lucide-react";

import { useEffect, useState } from "react";

import EmptyTrips from "@/components/trips/empty-trips";
import TripStatsRow from "@/components/trips/trip-stats-row";
import TripTable from "@/components/trips/trip-table";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
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

  /* --- Initial loading state --- */
  if (loading && trips.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading your trips�</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 px-1 py-8 pb-24">
      {/* -- Page header -- */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <SectionHeading heading="Your Trips" />
          <p className="text-sm text-zinc-500">
            Track and manage your AI travel planning conversations
          </p>
        </div>

        <Button
          onClick={handleCreateCall}
          disabled={isCreating}
          className="shrink-0 gap-2 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating call�
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              New Trip Call
            </>
          )}
        </Button>
      </div>

      {/* -- Error banner -- */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* -- Stats row (only when trips exist) -- */}
      {trips.length > 0 && <TripStatsRow trips={trips} />}

      {/* -- Table or empty state -- */}
      {trips.length === 0 ? (
        <EmptyTrips onCreateCall={handleCreateCall} isCreating={isCreating} />
      ) : (
        <TripTable trips={trips} />
      )}
    </div>
  );
}
