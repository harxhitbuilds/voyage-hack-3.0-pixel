"use client";

import { Loader2, Mic, Phone, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyTripsProps {
  onCreateCall: () => void;
  isCreating: boolean;
}

const features = [
  {
    icon: Sparkles,
    label: "AI Itinerary",
    desc: "Full trip plan built by voice",
  },
  { icon: Mic, label: "Voice Guided", desc: "Just speak, Nimbus plans" },
  { icon: Phone, label: "Live Call", desc: "Real-time AI conversation" },
];

const EmptyTrips = ({ onCreateCall, isCreating }: EmptyTripsProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950">
      <div className="flex flex-col items-center gap-8 px-6 py-16 text-center">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
          <Phone className="h-7 w-7 text-zinc-400" />
        </div>

        {/* Copy */}
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-white">
            Start your first AI trip
          </h3>
          <p className="text-sm leading-relaxed text-zinc-500">
            Have a live voice conversation with Nimbus AI. It will plan your
            entire trip — destination, itinerary, budget, and AR heritage
            experiences.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid w-full max-w-lg grid-cols-3 gap-3">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                <Icon className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <p className="text-xs font-semibold text-white">{label}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-500">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          onClick={onCreateCall}
          disabled={isCreating}
          className="gap-2 rounded-lg bg-white px-8 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating call…
            </>
          ) : (
            <>
              <Phone className="h-4 w-4" />
              Start AI Trip Call
            </>
          )}
        </Button>

        <p className="text-[11px] text-zinc-600">
          No card required &nbsp;·&nbsp; Free to explore
        </p>
      </div>
    </div>
  );
};

export default EmptyTrips;
