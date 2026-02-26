import { Edit3, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  isEditing: boolean;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  isLoading: boolean;
  accentColor?: string;
}

const ProfileHeader = ({
  isEditing,
  handleEdit,
  handleCancel,
  handleSave,
  isLoading,
}: ProfileHeaderProps) => (
  <div className="border-border/50 mb-8 flex flex-col items-start justify-between border-b pb-4 sm:flex-row sm:items-center">
    <div className="mb-4 flex items-center gap-3 sm:mb-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and travel preferences
        </p>
      </div>
    </div>
    {!isEditing ? (
      <Button
        onClick={handleEdit}
        variant="outline"
        size="sm"
        className="gap-2 transition-all hover:border-blue-500 hover:text-blue-500"
      >
        <Edit3 className="h-4 w-4" />
        Edit Profile
      </Button>
    ) : (
      <div className="flex w-full gap-2 sm:w-auto">
        <Button
          onClick={handleCancel}
          variant="ghost"
          size="sm"
          className="hover:bg-destructive/10 hover:text-destructive gap-2 transition-colors"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          size="sm"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    )}
  </div>
);

export default ProfileHeader;
