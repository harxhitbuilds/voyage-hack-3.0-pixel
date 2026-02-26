import { Award, Calendar, Globe, Map } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { User } from "@/store/auth.store";

interface TravelStatsProps {
  displayUser: User | null;
  accentColor?: string;
}

const TravelStats = ({ displayUser }: TravelStatsProps) => {
  if (!displayUser) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Award className="h-5 w-5 text-blue-500" />
          Travel Stats
        </h3>
      </div>
      <div className="space-y-5 p-6">
        <div className="group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Member since
            </span>
          </div>
          <span className="text-foreground font-bold">
            {displayUser.createdAt
              ? new Date(displayUser.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        </div>

        <div className="border-border/50 border-t"></div>

        <div className="group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <Globe className="h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Countries visited
            </span>
          </div>
          <span className="text-foreground font-bold">
            {displayUser.experience?.visitedCountries || "0"}
          </span>
        </div>

        <div className="border-border/50 border-t"></div>

        <div className="group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <Map className="h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Travel experience
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
          >
            {displayUser.experience?.travelExperience || "Novice"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TravelStats;
