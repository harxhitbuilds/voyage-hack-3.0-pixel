import {
  Calendar,
  Car,
  Clock,
  Home,
  Lightbulb,
  Plane,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { User } from "@/store/auth.store";

interface InterestsPreferencesProps {
  displayUser: User | null;
  accentColor?: string;
}

const InterestsPreferences = ({ displayUser }: InterestsPreferencesProps) => {
  if (!displayUser) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          Interests & Activities
        </h3>
      </div>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Activity Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.interests?.activityInterests?.map(
                (interest: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  >
                    {interest}
                  </Badge>
                ),
              ) || (
                <span className="text-muted-foreground text-sm italic">
                  Not specified
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Cultural Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.interests?.culturalInterests?.map(
                (interest: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                  >
                    {interest}
                  </Badge>
                ),
              ) || (
                <span className="text-muted-foreground text-sm italic">
                  Not specified
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Food Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.interests?.foodInterests?.map(
                (interest: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="hover:bg-secondary/80"
                  >
                    {interest}
                  </Badge>
                ),
              ) || (
                <span className="text-muted-foreground text-sm italic">
                  Not specified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsPreferences;
