import { format } from "date-fns";
import {
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";

import type { Trip } from "@/store/trip.store";

import TripStatusBadge from "./trip-status-badge";

interface TripOverviewTabProps {
  trip: Trip;
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not specified";
  try {
    return format(new Date(dateString), "MMMM dd, yyyy");
  } catch {
    return "Not specified";
  }
};

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
  } catch {
    return "N/A";
  }
};

/* ── Reusable card shell ── */
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <div className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
      <Icon className="h-4 w-4 text-blue-400" />
    </div>
    <h3 className="text-sm font-semibold text-white">{title}</h3>
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1 text-xs font-medium tracking-wider text-zinc-500 uppercase">
    {children}
  </p>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm font-medium text-white">{children}</p>
);

/* ── Component ── */
const TripOverviewTab = ({ trip }: TripOverviewTabProps) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    {/* ── Left column ── */}
    <div className="space-y-6 lg:col-span-2">
      {/* Call information */}
      <Card>
        <CardHeader icon={Phone} title="Call Information" />
        <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
          <div>
            <Label>Duration</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <Value>{formatDuration(trip.callDuration)}</Value>
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <TripStatusBadge status={trip.callStatus} />
          </div>
          <div>
            <Label>Call ID</Label>
            <p className="font-mono text-xs text-zinc-500">
              {trip.callId ?? "—"}
            </p>
          </div>
          <div>
            <Label>Phone</Label>
            <Value>{trip.phoneNumber ?? "—"}</Value>
          </div>
        </div>
      </Card>

      {/* Trip summary */}
      {trip.tripDetails && (
        <Card>
          <CardHeader icon={MapPin} title="Trip Summary" />
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div>
              <Label>
                <MapPin className="mr-1 inline h-3 w-3" />
                Destination
              </Label>
              <Value>{trip.tripDetails.destination ?? "Not specified"}</Value>
            </div>
            <div>
              <Label>
                <Users className="mr-1 inline h-3 w-3" />
                Travelers
              </Label>
              <Value>
                {trip.tripDetails.travelers
                  ? `${trip.tripDetails.travelers} people`
                  : "Not specified"}
              </Value>
            </div>
            <div>
              <Label>
                <Calendar className="mr-1 inline h-3 w-3" />
                Travel Dates
              </Label>
              <Value>
                {trip.tripDetails.startDate
                  ? formatDate(trip.tripDetails.startDate)
                  : "Not specified"}
                {trip.tripDetails.endDate &&
                  ` → ${formatDate(trip.tripDetails.endDate)}`}
              </Value>
            </div>
            <div>
              <Label>
                <DollarSign className="mr-1 inline h-3 w-3" />
                Budget
              </Label>
              <Value>{trip.tripDetails.budget ?? "Not specified"}</Value>
            </div>
          </div>
        </Card>
      )}
    </div>

    {/* ── Right sidebar ── */}
    <div className="space-y-6">
      {/* AI summary */}
      {trip.aiInsights?.tripSummary && (
        <div className="rounded-xl border border-zinc-700 bg-linear-to-br from-blue-500/5 via-zinc-900/60 to-zinc-900/60 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Brain className="h-4 w-4 text-blue-400" />
            AI Summary
          </h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            {trip.aiInsights.tripSummary}
          </p>
          {trip.aiInsights.processedAt && (
            <p className="mt-3 text-xs text-zinc-600">
              Generated {formatDateTime(trip.aiInsights.processedAt)}
            </p>
          )}
        </div>
      )}

      {/* Key points */}
      {(trip.aiInsights?.keyPoints?.length ?? 0) > 0 && (
        <Card>
          <CardHeader icon={Star} title="Key Points" />
          <ul className="space-y-2 p-6">
            {trip.aiInsights!.keyPoints!.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-sm text-zinc-400">{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  </div>
);

export default TripOverviewTab;
