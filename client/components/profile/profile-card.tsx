import { Camera, Mail, MapPin, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as UserType } from "@/store/auth.store";

interface ProfileCardProps {
  displayUser: UserType | null;
  isEditing: boolean;
  editedUser: UserType | null;
  handleInputChange: (field: string, value: string) => void;
  accentColor?: string;
}

const ProfileCard = ({
  displayUser,
  isEditing,
  editedUser,
  handleInputChange,
}: ProfileCardProps) => {
  if (!displayUser) return null;

  return (
    <div className="bg-card border-border rounded-xl border">
      <div className="p-6">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-24 w-24">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-blue-500 to-indigo-500">
              {displayUser.profile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayUser.profile as string}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
            </div>
            {isEditing && (
              <Button
                size="icon"
                className="border-background absolute -right-2 -bottom-2 h-8 w-8 rounded-full border-2 bg-blue-600 p-0 text-white shadow-lg hover:bg-blue-700"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEditing && editedUser ? (
            <div className="mb-4 space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <Input
                  value={editedUser.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-background text-center text-lg font-semibold"
                  placeholder="Full Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={editedUser.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="bg-background text-center text-sm"
                  placeholder="First Name"
                />
                <Input
                  value={editedUser.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="bg-background text-center text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h2 className="text-foreground text-xl font-bold">
                {displayUser.name}
              </h2>
              {(displayUser.firstName || displayUser.lastName) && (
                <p className="text-muted-foreground text-sm font-medium">
                  {displayUser.firstName} {displayUser.lastName}
                </p>
              )}
            </div>
          )}

          {isEditing && editedUser ? (
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <Input
                value={editedUser.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="bg-background text-center text-sm"
                placeholder="@username"
              />
            </div>
          ) : (
            <p className="text-muted-foreground bg-secondary/50 mb-4 inline-block rounded-full px-3 py-1 text-sm">
              @{displayUser.username || "Not set"}
            </p>
          )}

          <div className="space-y-3">
            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{displayUser.email}</span>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              {isEditing && editedUser ? (
                <Input
                  value={editedUser.hometown || ""}
                  onChange={(e) =>
                    handleInputChange("hometown", e.target.value)
                  }
                  className="bg-background h-8 text-sm"
                  placeholder="Hometown"
                />
              ) : (
                <span className="text-sm">
                  {displayUser.hometown || "No hometown set"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
