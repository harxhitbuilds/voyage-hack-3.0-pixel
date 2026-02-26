import { Calendar, Car, Clock, Home, Plane, Users, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { User } from "@/store/auth.store";

interface TravelPreferencesProps {
  displayUser: User | null;
  accentColor?: string;
}

const TravelPreferences = ({ displayUser }: TravelPreferencesProps) => {
  if (!displayUser) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Plane className="h-5 w-5 text-blue-500" />
          Travel Preferences
        </h3>
      </div>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              <Users className="text-muted-foreground mr-2 inline h-4 w-4" />
              Travel Style
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.travelPreferences?.travelStyle?.map(
                (style: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  >
                    {style}
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
              <Wallet className="text-muted-foreground mr-2 inline h-4 w-4" />
              Budget Range
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.travelPreferences?.budgetRange?.map(
                (budget: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                  >
                    {budget}
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
              <Users className="text-muted-foreground mr-2 inline h-4 w-4" />
              Group Size
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.travelPreferences?.groupSize?.map(
                (size: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="hover:bg-secondary/80"
                  >
                    {size}
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
              <Calendar className="text-muted-foreground mr-2 inline h-4 w-4" />
              Trip Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.travelPreferences?.tripDuration?.map(
                (duration: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="hover:bg-secondary/80"
                  >
                    {duration}
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
              <Clock className="text-muted-foreground mr-2 inline h-4 w-4" />
              Travel Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.travelPreferences?.travelFrequency?.map(
                (frequency: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-accent/20 text-accent border-accent/30"
                  >
                    {frequency}
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
              <Home className="text-muted-foreground mr-2 inline h-4 w-4" />
              Accommodation Type
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.travelPreferences?.accommodationType?.map(
                (type: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-accent/20 text-accent border-accent/30"
                  >
                    {type}
                  </Badge>
                ),
              ) || (
                <span className="text-muted-foreground text-sm italic">
                  Not specified
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-foreground mb-2 block text-sm font-medium">
              <Car className="text-muted-foreground mr-2 inline h-4 w-4" />
              Transportation Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {displayUser.travelPreferences?.transportationPreference?.map(
                (transport: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-accent/20 text-accent border-accent/30"
                  >
                    {transport}
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

export default TravelPreferences;
