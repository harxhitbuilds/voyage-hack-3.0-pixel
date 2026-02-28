"use client";

import {
  Brain,
  CheckCircle2,
  Loader2,
  Phone,
  PhoneCall,
  PhoneOff,
  Sparkles,
} from "lucide-react";

import { useEffect } from "react";

import { useCallStatusStream } from "@/hooks/use-call-status-stream";
import type { CallStatus } from "@/store/trip.store";

interface LiveCallBannerProps {
  callId: string;
  onComplete?: () => void;
}

const statusMeta: Record<
  string,
  { icon: React.ElementType; label: string; color: string; bg: string }
> = {
  queued: {
    icon: Phone,
    label: "Call queued…",
    color: "text-zinc-400",
    bg: "border-zinc-800/60 bg-zinc-950",
  },
  ringing: {
    icon: PhoneCall,
    label: "Phone is ringing…",
    color: "text-zinc-300",
    bg: "border-zinc-800/60 bg-zinc-950",
  },
  "in-progress": {
    icon: PhoneCall,
    label: "Call in progress — AI is listening",
    color: "text-zinc-200",
    bg: "border-zinc-700 bg-zinc-950",
  },
  ended: {
    icon: Brain,
    label: "Processing your trip with AI…",
    color: "text-zinc-300",
    bg: "border-zinc-800/60 bg-zinc-950",
  },
  complete: {
    icon: CheckCircle2,
    label: "✨ Itinerary generated! Refreshing…",
    color: "text-zinc-200",
    bg: "border-zinc-700 bg-zinc-950",
  },
  failed: {
    icon: PhoneOff,
    label: "Call failed",
    color: "text-red-400",
    bg: "border-red-500/20 bg-red-500/5",
  },
};

export default function LiveCallBanner({
  callId,
  onComplete,
}: LiveCallBannerProps) {
  const { event, isStreaming } = useCallStatusStream(callId);

  useEffect(() => {
    if (event?.status === "complete" && onComplete) {
      const t = setTimeout(onComplete, 1500);
      return () => clearTimeout(t);
    }
  }, [event, onComplete]);

  const key = event?.status ?? "queued";
  const meta = statusMeta[key] ?? statusMeta.queued;
  const Icon = meta.icon;

  const steps = [
    { label: "Call placed", done: true },
    {
      label: "In conversation",
      done: ["in-progress", "ended", "complete"].includes(key),
    },
    { label: "AI processing", done: ["ended", "complete"].includes(key) },
    { label: "Itinerary ready", done: key === "complete" },
  ];

  return (
    <div
      className={`rounded-xl border px-5 py-4 ${meta.bg} transition-all duration-500`}
    >
      {/* Status row */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
          {isStreaming && key !== "complete" ? (
            <Loader2 className={`h-4 w-4 animate-spin ${meta.color}`} />
          ) : (
            <Icon className={`h-4 w-4 ${meta.color}`} />
          )}
        </div>
        <div>
          <p className={`text-sm font-semibold ${meta.color}`}>{meta.label}</p>
          <p className="text-xs text-zinc-500">Call ID: {callId}</p>
        </div>
        {key === "complete" && (
          <Sparkles className="ml-auto h-4 w-4 animate-pulse text-zinc-300" />
        )}
      </div>

      {/* Progress steps */}
      <div className="mt-4 flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                step.done
                  ? "border-zinc-600 bg-zinc-800 text-zinc-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-600"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs ${step.done ? "text-zinc-300" : "text-zinc-600"}`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-6 ${step.done ? "bg-zinc-600" : "bg-zinc-800"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
