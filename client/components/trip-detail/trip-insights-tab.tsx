import { format } from "date-fns";
import { Brain, CheckCircle, Star } from "lucide-react";

import type { Trip } from "@/store/trip.store";

interface TripInsightsTabProps {
  trip: Trip;
}

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
  } catch {
    return "N/A";
  }
};

const TripInsightsTab = ({ trip }: TripInsightsTabProps) => {
  const insights = trip.aiInsights;

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-24 text-center">
        <Brain className="mb-4 h-14 w-14 text-zinc-700" />
        <h3 className="mb-1 text-base font-semibold text-white">
          No AI insights yet
        </h3>
        <p className="max-w-xs text-sm text-zinc-500">
          AI analysis will appear here once the call is completed and processed
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {insights.tripSummary && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
              <Brain className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              AI Trip Summary
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm leading-relaxed text-zinc-400">
              {insights.tripSummary}
            </p>
            {insights.processedAt && (
              <p className="mt-4 text-xs text-zinc-600">
                Generated on {formatDateTime(insights.processedAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key insights grid */}
      {(insights.keyPoints?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
              <Star className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Key Insights</h3>
            <span className="ml-auto rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {insights.keyPoints!.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-2">
            {insights.keyPoints!.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-sm text-zinc-400">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripInsightsTab;
