import { Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { User } from "@/store/auth.store";

interface ProfileCompletionProps {
  displayUser: User | null;
  accentColor?: string;
}

const ProfileCompletion = ({ displayUser }: ProfileCompletionProps) => {
  if (!displayUser) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Settings className="h-5 w-5 text-blue-500" />
          Profile Completion
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Basic Info</span>
            <Badge className="border-green-500/30 bg-green-500/20 text-green-600 hover:bg-green-500/25 dark:text-green-400">
              Complete
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Travel Preferences
            </span>
            <Badge variant="outline" className="border-blue-200 text-blue-500">
              80%
            </Badge>
          </div>
          <div className="bg-secondary/50 h-2 w-full rounded-full">
            <div
              className="h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: "80%" }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Interests</span>
            <Badge
              variant="outline"
              className="border-amber-200 text-amber-500"
            >
              60%
            </Badge>
          </div>
          <div className="bg-secondary/50 h-2 w-full rounded-full">
            <div
              className="h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              Overall Progress
            </span>
            <span className="text-sm font-medium">75%</span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
