"use client";

import { Loader2, Phone, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyTripsProps {
  onCreateCall: () => void;
  isCreating: boolean;
}

const EmptyTrips = ({ onCreateCall, isCreating }: EmptyTripsProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-20 text-center">
      {/* Icon */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800/80">
        <Phone className="h-7 w-7 text-zinc-500" />
      </div>

      {/* Copy */}
      <h3 className="mb-1.5 text-base font-semibold text-white">
        No trips yet
      </h3>
      <p className="mb-6 max-w-xs text-sm text-zinc-500">
        Start an AI-powered trip planning call to see your conversations and
        destinations here.
      </p>

      {/* CTA */}
      <Button
        onClick={onCreateCall}
        disabled={isCreating}
        className="gap-2 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {isCreating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating call…
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Create your first trip
          </>
        )}
      </Button>
    </div>
  );
};

export default EmptyTrips;
