"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Lightbulb,
  MapPin,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ItineraryDay, Trip } from "@/store/trip.store";

interface TripItineraryTabProps {
  trip: Trip;
}

const DAY_COLORS = [
  "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  "from-violet-500/20 to-violet-500/5 border-violet-500/30",
  "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  "from-rose-500/20 to-rose-500/5 border-rose-500/30",
  "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
  "from-purple-500/20 to-purple-500/5 border-purple-500/30",
];

const DOT_COLORS = [
  "bg-blue-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-cyan-400",
  "bg-purple-400",
];

const NUMBER_COLORS = [
  "text-blue-400 border-blue-500/40",
  "text-violet-400 border-violet-500/40",
  "text-emerald-400 border-emerald-500/40",
  "text-amber-400 border-amber-500/40",
  "text-rose-400 border-rose-500/40",
  "text-cyan-400 border-cyan-500/40",
  "text-purple-400 border-purple-500/40",
];

interface DayCardProps {
  day: ItineraryDay;
  index: number;
  isLast: boolean;
}

const DayCard = ({ day, index, isLast }: DayCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const colorIdx = index % DAY_COLORS.length;

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-zinc-900 text-sm font-bold",
            NUMBER_COLORS[colorIdx],
          )}
        >
          {day.day}
        </div>
        {!isLast && (
          <div className="mt-2 w-0.5 flex-1 bg-linear-to-b from-zinc-700 to-transparent" />
        )}
      </div>

      {/* Card */}
      <div
        className={cn(
          "mb-8 flex-1 rounded-xl border bg-linear-to-br backdrop-blur-sm",
          DAY_COLORS[colorIdx],
        )}
      >
        {/* Card header */}
        <button
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-zinc-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Day {day.day}
                {day.title && day.title !== `Day ${day.day}` && (
                  <span className="ml-2 font-normal text-zinc-400">
                    — {day.title}
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500">
                {day.activities.length} activities
                {day.estimatedCost && ` · ${day.estimatedCost}`}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-zinc-500" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
          )}
        </button>

        {/* Expanded body */}
        {expanded && (
          <div className="space-y-4 border-t border-white/5 px-5 pt-4 pb-5">
            {/* Activities list */}
            {day.activities.length > 0 && (
              <ul className="space-y-2.5">
                {day.activities.map((act, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        DOT_COLORS[colorIdx],
                      )}
                    />
                    <span className="text-sm leading-relaxed text-zinc-300">
                      {act}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Cost + Tips row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {day.estimatedCost && (
                <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-3">
                  <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <p className="mb-0.5 text-xs font-medium tracking-wider text-zinc-500 uppercase">
                      Est. Cost
                    </p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {day.estimatedCost}
                    </p>
                  </div>
                </div>
              )}
              {day.tips && (
                <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="mb-0.5 text-xs font-medium tracking-wider text-zinc-500 uppercase">
                      Pro Tip
                    </p>
                    <p className="text-sm text-zinc-300">{day.tips}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TripItineraryTab = ({ trip }: TripItineraryTabProps) => {
  const itinerary = trip.itinerary ?? [];

  if (itinerary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-24 text-center">
        <Sparkles className="mb-4 h-14 w-14 text-zinc-700" />
        <h3 className="mb-1 text-base font-semibold text-white">
          No itinerary yet
        </h3>
        <p className="max-w-xs text-sm text-zinc-500">
          Your AI-generated day-by-day itinerary will appear here once the call
          is processed
        </p>
      </div>
    );
  }

  const totalDays = itinerary.length;
  const destination = trip.tripDetails?.destination ?? "Your Destination";

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-700 bg-linear-to-br from-blue-500/10 via-zinc-900 to-zinc-900 p-5 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
          <MapPin className="h-6 w-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">
            {destination} — {totalDays}-Day Itinerary
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            AI-generated personalised plan based on your travel preferences
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400">
            {totalDays} Days Planned
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="pt-2">
        {itinerary.map((day, i) => (
          <DayCard
            key={day.day}
            day={day}
            index={i}
            isLast={i === itinerary.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TripItineraryTab;
