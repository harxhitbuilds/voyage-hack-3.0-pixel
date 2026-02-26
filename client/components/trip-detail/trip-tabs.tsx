import { Activity, Brain, FileText, MapPin, Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type TabId = "overview" | "details" | "transcript" | "insights";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "overview", label: "Overview", icon: Star },
  { id: "details", label: "Trip Details", icon: MapPin },
  { id: "transcript", label: "Conversation", icon: FileText },
  { id: "insights", label: "AI Insights", icon: Brain },
];

interface TripTabsProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

const TripTabs = ({ active, onChange }: TripTabsProps) => (
  <div className="flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
    {TABS.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
          active === id
            ? "bg-zinc-800 text-white shadow"
            : "text-zinc-500 hover:text-zinc-300",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{label}</span>
      </button>
    ))}
  </div>
);

export default TripTabs;
