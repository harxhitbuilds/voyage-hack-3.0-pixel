"use client";

import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import type { Trip } from "@/store/trip.store";

interface TripTableRowProps {
  trip: Trip;
}

type CallStatus = "queued" | "ringing" | "in-progress" | "ended" | "failed";

const statusConfig: Record<
  CallStatus,
  { label: string; color: string; dot: string }
> = {
  queued: {
    label: "Queued",
    color: "text-amber-400 border-amber-500/20 bg-amber-500/8",
    dot: "bg-amber-400",
  },
  ringing: {
    label: "Ringing",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/8",
    dot: "bg-blue-400 animate-ping",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/8",
    dot: "bg-emerald-400 animate-pulse",
  },
  ended: {
    label: "Completed",
    color: "text-zinc-400 border-white/8 bg-white/4",
    dot: "bg-zinc-500",
  },
  failed: {
    label: "Failed",
    color: "text-red-400 border-red-500/20 bg-red-500/8",
    dot: "bg-red-400",
  },
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "—";
  }
};

const TripTableRow = ({ trip }: TripTableRowProps) => {
  const status = (trip.callStatus as CallStatus) ?? "queued";
  const config = statusConfig[status] ?? statusConfig.queued;
  const destination = trip.tripDetails?.destination || "Unknown destination";
  const initials = destination.slice(0, 2).toUpperCase();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${trip._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: trip.name || "My Trip", url: shareUrl });
        toast.success("Trip shared!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied!");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied!");
        } catch {
          toast.error("Failed to copy link");
        }
      }
    }
  };

  return (
    <div className="group grid grid-cols-1 items-center gap-3 px-6 py-4 transition-colors hover:bg-white/2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1.2fr_auto] md:gap-4">
      {/* Destination */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Avatar */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-white/5">
          <span className="text-xs font-black text-zinc-300">{initials}</span>
          {status === "in-progress" && (
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 translate-x-0.5 translate-y-0.5 rounded-full border-2 border-[#0d0d0d] bg-emerald-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {destination}
          </p>
          {trip.tripDetails?.startDate ? (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-600">
              <Calendar className="h-2.5 w-2.5" />
              {format(new Date(trip.tripDetails.startDate), "MMM dd, yyyy")}
            </p>
          ) : (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-600">
              <MapPin className="h-2.5 w-2.5" />
              AI Trip
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${config.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
        <Clock className="h-3.5 w-3.5 shrink-0 text-zinc-700" />
        {formatDuration(trip.callDuration)}
      </div>

      {/* Travelers */}
      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
        <Users className="h-3.5 w-3.5 shrink-0 text-zinc-700" />
        {trip.tripDetails?.travelers || "—"}
      </div>

      {/* Budget */}
      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
        <DollarSign className="h-3.5 w-3.5 shrink-0 text-zinc-700" />
        {trip.tripDetails?.budget || "—"}
      </div>

      {/* Created */}
      <div className="text-[11px] text-zinc-600">
        {formatDate(trip.createdAt)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/home/trip/${trip._id}`}
          className="group/btn relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:border-white/15 hover:bg-white/8 hover:text-white"
        >
          <Eye className="h-3 w-3" />
          View
        </Link>
        <button
          onClick={handleShare}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/6 text-zinc-600 transition-all hover:border-white/12 hover:text-zinc-300"
          title="Share trip"
        >
          <Share2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default TripTableRow;
