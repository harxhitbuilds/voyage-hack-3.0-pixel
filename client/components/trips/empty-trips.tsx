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
    <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-[#0d0d0d]">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-600/5 via-transparent to-violet-600/5" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="relative flex flex-col items-center gap-10 px-6 py-20 text-center">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 scale-150 rounded-3xl bg-blue-500/10 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 to-violet-500/10">
            <Phone className="h-9 w-9 text-blue-400" />
          </div>
        </div>

        {/* Copy */}
        <div className="max-w-md space-y-3">
          <h3 className="text-2xl font-black tracking-tight text-white">
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
              className="group rounded-2xl border border-white/6 bg-white/3 p-4 transition-all hover:border-white/10 hover:bg-white/5"
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <Icon className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <p className="text-xs font-bold text-white">{label}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-600">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          onClick={onCreateCall}
          disabled={isCreating}
          className="relative gap-2.5 overflow-hidden rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30 disabled:opacity-60"
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 hover:translate-x-full" />
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

        <p className="text-[11px] text-zinc-700">
          No card required &nbsp;·&nbsp; Free to explore
        </p>
      </div>
    </div>
  );
};

export default EmptyTrips;
