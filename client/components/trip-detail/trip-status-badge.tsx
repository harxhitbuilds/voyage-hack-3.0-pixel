import { Badge } from "@/components/ui/badge";
import type { CallStatus } from "@/store/trip.store";

interface TripStatusBadgeProps {
  status?: CallStatus;
}

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

const TripStatusBadge = ({ status = "queued" }: TripStatusBadgeProps) => {
  const config = statusConfig[status] ?? statusConfig.queued;
  return (
    <Badge
      className={`rounded-full border text-xs font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
};

export default TripStatusBadge;
