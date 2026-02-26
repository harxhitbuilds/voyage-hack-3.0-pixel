import { format } from "date-fns";
import { Activity, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Trip } from "@/store/trip.store";

interface TripDetailsTabProps {
  trip: Trip;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not specified";
  try {
    return format(new Date(dateString), "MMMM dd, yyyy");
  } catch {
    return "Not specified";
  }
};

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
    <div className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
        <Icon className="h-4 w-4 text-blue-400" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <p className="mb-1 text-xs font-medium tracking-wider text-zinc-500 uppercase">
      {label}
    </p>
    <p className="text-sm text-white">{value ?? "Not specified"}</p>
  </div>
);

const TripDetailsTab = ({ trip }: TripDetailsTabProps) => {
  const details = trip.tripDetails;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left: core travel info */}
      <SectionCard icon={MapPin} title="Travel Information">
        <div className="space-y-5">
          <Field label="Destination" value={details?.destination} />
          <Field
            label="Start Date"
            value={details?.startDate ? formatDate(details.startDate) : null}
          />
          <Field
            label="End Date"
            value={details?.endDate ? formatDate(details.endDate) : null}
          />
          <Field
            label="Number of Travelers"
            value={details?.travelers ? `${details.travelers} people` : null}
          />
          <Field label="Budget" value={details?.budget} />
        </div>
      </SectionCard>

      {/* Right: preferences + activities */}
      <div className="space-y-6">
        {(details?.preferences?.length ?? 0) > 0 && (
          <SectionCard icon={Star} title="Preferences">
            <div className="flex flex-wrap gap-2">
              {details!.preferences!.map((p, i) => (
                <Badge
                  key={i}
                  className="border border-blue-500/30 bg-blue-500/10 text-blue-400"
                >
                  {p}
                </Badge>
              ))}
            </div>
          </SectionCard>
        )}

        {(details?.activities?.length ?? 0) > 0 && (
          <SectionCard icon={Activity} title="Activities">
            <div className="flex flex-wrap gap-2">
              {details!.activities!.map((a, i) => (
                <Badge
                  key={i}
                  className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                >
                  {a}
                </Badge>
              ))}
            </div>
          </SectionCard>
        )}

        {/* empty fallback */}
        {!details?.preferences?.length && !details?.activities?.length && (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-800 py-12 text-sm text-zinc-600">
            No preferences or activities recorded
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailsTab;
