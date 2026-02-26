import { Accessibility, BookOpen, Shield, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/store/auth.store";

interface SpecialRequirementsProps {
  displayUser: User | null;
  isEditing: boolean;
  editedUser: User | null;
  handleNestedInputChange: (
    section: string,
    field: string,
    value: string,
  ) => void;
  accentColor?: string;
}

const SpecialRequirements = ({
  displayUser,
  isEditing,
  editedUser,
  handleNestedInputChange,
}: SpecialRequirementsProps) => {
  if (!displayUser) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Shield className="h-5 w-5 text-blue-500" />
          Special Requirements
        </h3>
      </div>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-muted-foreground mb-2 flex items-center text-sm font-medium">
              <Accessibility className="mr-2 h-4 w-4" />
              Accessibility Needs
            </label>
            {isEditing && editedUser ? (
              <Textarea
                value={editedUser.specialRequirements?.accessibility || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "specialRequirements",
                    "accessibility",
                    e.target.value,
                  )
                }
                className="bg-card border-border text-foreground min-h-25"
                placeholder="Any accessibility requirements..."
              />
            ) : (
              <p className="text-foreground border-border bg-secondary/10 min-h-16 rounded-md border p-3 text-sm font-medium">
                {displayUser.specialRequirements?.accessibility ||
                  "None specified"}
              </p>
            )}
          </div>

          <div>
            <label className="text-muted-foreground mb-2 flex items-center text-sm font-medium">
              <Utensils className="mr-2 h-4 w-4" />
              Dietary Restrictions
            </label>
            <div className="border-border bg-secondary/10 flex min-h-16 flex-wrap gap-2 rounded-md border p-3">
              {displayUser.specialRequirements?.dietaryRestrictions?.length >
              0 ? (
                displayUser.specialRequirements.dietaryRestrictions.map(
                  (restriction: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {restriction}
                    </Badge>
                  ),
                )
              ) : (
                <span className="text-muted-foreground text-sm font-medium">
                  None specified
                </span>
              )}
            </div>
            {isEditing && (
              <p className="text-muted-foreground mt-2 text-xs">
                * Dietary restrictions editing coming soon
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-muted-foreground mb-2 flex items-center text-sm font-medium">
              <BookOpen className="mr-2 h-4 w-4" />
              Special Interests
            </label>
            {isEditing && editedUser ? (
              <Textarea
                value={editedUser.specialRequirements?.specialInterests || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "specialRequirements",
                    "specialInterests",
                    e.target.value,
                  )
                }
                className="bg-card border-border text-foreground min-h-25"
                placeholder="Photography, wildlife, architecture, etc..."
              />
            ) : (
              <p className="text-foreground border-border bg-secondary/10 min-h-16 rounded-md border p-3 text-sm font-medium">
                {displayUser.specialRequirements?.specialInterests ||
                  "None specified"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequirements;
