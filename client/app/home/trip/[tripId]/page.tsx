"use client";

import { Brain, Loader2, Phone } from "lucide-react";

import { use, useEffect, useState } from "react";

import TripDetailHeader from "@/components/trip-detail/trip-detail-header";
import TripDetailsTab from "@/components/trip-detail/trip-details-tab";
import TripInsightsTab from "@/components/trip-detail/trip-insights-tab";
import TripItineraryTab from "@/components/trip-detail/trip-itinerary-tab";
import TripOverviewTab from "@/components/trip-detail/trip-overview-tab";
import TripTabs, { type TabId } from "@/components/trip-detail/trip-tabs";
import TripTranscriptTab from "@/components/trip-detail/trip-transcript-tab";
import { useTripStore } from "@/store/trip.store";

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export default function TripDetailPage({ params }: PageProps) {
  const { tripId } = use(params);

  const { trip, loading, error, getTripById } = useTripStore();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  useEffect(() => {
    if (tripId) getTripById(tripId);
  }, [tripId, getTripById]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading trip details…</span>
        </div>
      </div>
    );
  }

  /* ── Error / not found ── */
  if (error || !trip) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
          <Phone className="h-6 w-6 text-zinc-400" />
        </div>
        <h3 className="text-base font-semibold text-white">Trip not found</h3>
        <p className="max-w-xs text-sm text-zinc-500">
          {error ?? "The trip you're looking for doesn't exist or was deleted."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-8 px-8 py-10 pb-24 md:px-8">
      {/* Header */}
      <TripDetailHeader trip={trip} tripId={tripId} />

      {/* Tab navigation */}
      <TripTabs active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === "overview" && <TripOverviewTab trip={trip} />}
      {activeTab === "details" && <TripDetailsTab trip={trip} />}
      {activeTab === "itinerary" && <TripItineraryTab trip={trip} />}
      {activeTab === "transcript" && <TripTranscriptTab trip={trip} />}
      {activeTab === "insights" && <TripInsightsTab trip={trip} />}
    </div>
  );
}
