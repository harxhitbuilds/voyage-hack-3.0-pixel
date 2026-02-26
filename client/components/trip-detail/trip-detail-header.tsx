"use client";

import { format } from "date-fns";
import { Download, Share } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Trip } from "@/store/trip.store";

import TripStatusBadge from "./trip-status-badge";

interface TripDetailHeaderProps {
  trip: Trip;
  tripId: string;
}

const TripDetailHeader = ({ trip, tripId }: TripDetailHeaderProps) => {
  const createdAt = trip.createdAt
    ? format(new Date(trip.createdAt), "MMM dd, yyyy 'at' HH:mm")
    : null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/home/trip/${tripId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: trip.name ?? "Check out my trip!",
          text: "I planned an amazing trip using AI. Check it out!",
          url: shareUrl,
        });
        toast.success("Trip shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Share link copied to clipboard!");
        } catch {
          toast.error("Failed to copy share link");
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Title + meta */}
      <div className="space-y-2">
        <SectionHeading
          heading={trip.tripDetails?.destination ?? "Trip Details"}
        />
        <div className="flex flex-wrap items-center gap-3">
          <TripStatusBadge status={trip.callStatus} />
          {createdAt && (
            <span className="text-xs text-zinc-500">Created {createdAt}</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2 border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-zinc-500 hover:text-white"
        >
          <Share className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-zinc-500 hover:text-white"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default TripDetailHeader;
