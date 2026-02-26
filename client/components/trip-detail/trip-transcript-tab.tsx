"use client";

import { Bot, CheckCircle, Copy, FileText, User } from "lucide-react";
import { toast } from "sonner";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Trip } from "@/store/trip.store";

interface TripTranscriptTabProps {
  trip: Trip;
}

interface TranscriptTurn {
  speaker: "AI" | "User" | "Unknown";
  text: string;
}

/** Parse raw transcript text into speaker turns */
function parseTranscript(raw: string): TranscriptTurn[] {
  if (!raw?.trim()) return [];

  // Support common formats: "AI: ...", "User: ...", "Assistant: ...", "Bot: ..."
  // Also handle lines without a clear speaker tag
  const lines = raw
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const turns: TranscriptTurn[] = [];

  for (const line of lines) {
    const aiMatch = line.match(/^(AI|Assistant|Bot|VAPI|System)\s*:\s*/i);
    const userMatch = line.match(/^(User|Human|Customer|You)\s*:\s*/i);

    if (aiMatch) {
      turns.push({ speaker: "AI", text: line.slice(aiMatch[0].length).trim() });
    } else if (userMatch) {
      turns.push({
        speaker: "User",
        text: line.slice(userMatch[0].length).trim(),
      });
    } else if (turns.length > 0) {
      // Continuation of previous turn
      turns[turns.length - 1].text += " " + line;
    } else {
      turns.push({ speaker: "Unknown", text: line });
    }
  }

  return turns;
}

const TripTranscriptTab = ({ trip }: TripTranscriptTabProps) => {
  const [copied, setCopied] = useState(false);

  const turns = useMemo(
    () => parseTranscript(trip.transcript ?? ""),
    [trip.transcript],
  );

  const hasTurns = turns.length > 0;

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
          <div>
            <h3 className="text-sm font-semibold text-white">
              Call Transcript
            </h3>
            {hasTurns && (
              <p className="text-xs text-zinc-500">{turns.length} messages</p>
            )}
          </div>
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
      <div className="p-4 sm:p-6">
        {hasTurns ? (
          <div className="max-h-150 space-y-4 overflow-y-auto pr-1">
            {turns.map((turn, i) => {
              const isAI = turn.speaker === "AI";
              const isUser = turn.speaker === "User";

              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-end gap-3",
                    isUser ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                      isAI
                        ? "border-blue-500/30 bg-blue-500/10"
                        : isUser
                          ? "border-violet-500/30 bg-violet-500/10"
                          : "border-zinc-700 bg-zinc-800",
                    )}
                  >
                    {isAI ? (
                      <Bot className="h-4 w-4 text-blue-400" />
                    ) : (
                      <User className="h-4 w-4 text-violet-400" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      isAI
                        ? "rounded-bl-sm border border-zinc-700 bg-zinc-800/80 text-zinc-200"
                        : isUser
                          ? "rounded-br-sm border border-violet-500/20 bg-violet-500/10 text-zinc-100"
                          : "rounded-bl-sm border border-zinc-700 bg-zinc-800 text-zinc-400",
                    )}
                  >
                    <p className="mb-1 text-xs font-semibold tracking-wide opacity-60">
                      {isAI ? "AI Assistant" : isUser ? "You" : "Unknown"}
                    </p>
                    {turn.text}
                  </div>
                </div>
              );
            })}
          </div>
        ) : trip.transcript ? (
          /* Fallback: raw text if parsing yields nothing */
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
