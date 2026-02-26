"use client";

import { format } from "date-fns";
import { Clock, DollarSign, Eye, MapPin, Share2, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Trip } from "@/store/trip.store";

interface TripTableRowProps {
  trip: Trip;
}

type CallStatus = "queued" | "ringing" | "in-progress" | "ended" | "failed";

const statusConfig: Record<CallStatus, { label: string; className: string }> = {
  queued: {
    label: "Queued",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  ringing: {
    label: "Ringing",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  ended: {
    label: "Completed",
    className: "bg-zinc-700/60 text-zinc-300 border-zinc-700",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "MMM dd, yyyy · HH:mm");
  } catch {
    return "—";
  }
};

const TripTableRow = ({ trip }: TripTableRowProps) => {
  const status = (trip.callStatus as CallStatus) ?? "queued";
  const config = statusConfig[status] ?? statusConfig.queued;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${trip._id}`;
    const shareData = {
      title: trip.name || "Check out my trip!",
      text: "I planned an amazing trip using AI. Check it out!",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
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
    <TableRow className="group border-zinc-800 transition-colors hover:bg-zinc-800/40">
      {/* Destination */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {trip.tripDetails?.destination || "Not specified"}
            </p>
            {trip.tripDetails?.startDate && (
              <p className="mt-0.5 text-xs text-zinc-500">
                {format(new Date(trip.tripDetails.startDate), "MMM dd, yyyy")}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          className={`rounded-full border text-xs font-medium ${config.className}`}
        >
          {config.label}
        </Badge>
      </TableCell>

      {/* Duration */}
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(trip.callDuration)}
        </div>
      </TableCell>

      {/* Travelers */}
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Users className="h-3.5 w-3.5" />
          {trip.tripDetails?.travelers || "—"}
        </div>
      </TableCell>

      {/* Budget */}
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <DollarSign className="h-3.5 w-3.5" />
          {trip.tripDetails?.budget || "—"}
        </div>
      </TableCell>

      {/* Created */}
      <TableCell>
        <span className="text-xs text-zinc-500">
          {formatDate(trip.createdAt)}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Link
            href={`/home/trip/${trip._id}`}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white transition-all hover:border-zinc-500 hover:bg-zinc-700"
          >
            <Eye className="h-3 w-3" />
            View
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="h-7 w-7 rounded-lg border border-zinc-800 p-0 text-zinc-500 hover:border-zinc-600 hover:text-white"
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TripTableRow;
