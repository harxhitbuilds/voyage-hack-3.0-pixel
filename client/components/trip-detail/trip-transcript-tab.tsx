"use client";

import { CheckCircle, Copy, FileText } from "lucide-react";
import { toast } from "sonner";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Trip } from "@/store/trip.store";

interface TripTranscriptTabProps {
  trip: Trip;
}

const TripTranscriptTab = ({ trip }: TripTranscriptTabProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!trip.transcript) return;
    try {
      await navigator.clipboard.writeText(trip.transcript);
      setCopied(true);
      toast.success("Transcript copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy transcript");
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Call Transcript</h3>
        </div>
        {trip.transcript && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-zinc-500 hover:text-white"
          >
            {copied ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        {trip.transcript ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-5">
            <pre className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">
              {trip.transcript}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-3 h-12 w-12 text-zinc-700" />
            <p className="text-sm font-medium text-zinc-400">
              No transcript available
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              The transcript will appear here once the call is processed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripTranscriptTab;
