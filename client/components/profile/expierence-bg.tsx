import { Globe, Heart, Languages, Mountain, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/store/auth.store";

interface ExperienceBackgroundProps {
  displayUser: User | null;
  isEditing: boolean;
  editedUser: User | null;
  handleNestedInputChange: (
    section: keyof User,
    field: string,
    value: string,
  ) => void;
  accentColor?: string;
}

const ExperienceBackground = ({
  displayUser,
  isEditing,
  editedUser,
  handleNestedInputChange,
}: ExperienceBackgroundProps) => {
  if (!displayUser) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Mountain className="h-5 w-5 text-blue-500" />
          Experience & Background
        </h3>
      </div>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              <Star className="text-muted-foreground mr-2 inline h-4 w-4" />
              Travel Experience
            </label>
            {isEditing && editedUser ? (
              <Input
                value={editedUser.experience?.travelExperience || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "experience",
                    "travelExperience",
                    e.target.value,
                  )
                }
                className="bg-background text-foreground"
                placeholder="e.g., Beginner, Intermediate, Expert"
              />
            ) : (
              <Badge
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400"
              >
                {displayUser.experience?.travelExperience || "Not specified"}
              </Badge>
            )}
          </div>

          <div>
            <label className="text-muted-foreground mb-2 flex items-center text-sm font-medium">
              <Languages className="mr-2 h-4 w-4" />
              Languages Spoken
            </label>
            <div className="border-border bg-secondary/10 flex min-h-16 flex-wrap gap-2 rounded-md border p-3">
              {displayUser.experience?.languages?.length > 0 ? (
                displayUser.experience.languages.map(
                  (language: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-background text-foreground"
                    >
                      {language}
                    </Badge>
                  ),
                )
              ) : (
                <span className="text-muted-foreground text-sm font-medium">
                  None specific
                </span>
              )}
            </div>
            {isEditing && editedUser ? (
              <Input
                value={editedUser.experience?.languages?.join(", ") || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "experience",
                    "languages",
                    // @ts-ignore
                    e.target.value.split(",").map((lang) => lang.trim()),
                  )
                }
                className="bg-card border-border text-foreground"
                placeholder="English, Spanish, French..."
              />
            ) : null}
          </div>

          <div>
            <label className="text-muted-foreground mb-2 block text-sm font-medium">
              <Globe className="mr-2 inline h-4 w-4" />
              Countries Visited
            </label>
            {isEditing && editedUser ? (
              <Input
                value={editedUser.experience?.visitedCountries || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "experience",
                    "visitedCountries",
                    e.target.value,
                  )
                }
                className="bg-background text-foreground"
                placeholder="e.g., 15+ countries"
              />
            ) : (
              <span className="text-foreground font-medium">
                {displayUser.experience?.visitedCountries || "Not specified"}
              </span>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-muted-foreground mb-2 block text-sm font-medium">
              <Heart className="mr-2 inline h-4 w-4" />
              Dream Destinations
            </label>
            {isEditing && editedUser ? (
              <Textarea
                value={editedUser.experience?.dreamDestinations || ""}
                onChange={(e) =>
                  handleNestedInputChange(
                    "experience",
                    "dreamDestinations",
                    e.target.value,
                  )
                }
                className="bg-background text-foreground"
                placeholder="Where do you dream of going?"
                rows={3}
              />
            ) : (
              <p className="text-foreground text-sm leading-relaxed">
                {displayUser.experience?.dreamDestinations || "Not specified"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBackground;
