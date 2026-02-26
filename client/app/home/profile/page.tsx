"use client";

import { RefreshCw, User as UserIcon } from "lucide-react";

import { useEffect, useState } from "react";

import ProfileCompletion from "@/components/profile/completion";
import ExperienceBackground from "@/components/profile/expierence-bg";
import ProfileHeader from "@/components/profile/header";
import HeritageScore from "@/components/profile/heritage-score";
import InterestsPreferences from "@/components/profile/interest-pre";
import ProfileCard from "@/components/profile/profile-card";
import SpecialRequirements from "@/components/profile/special-req";
import TravelStats from "@/components/profile/stats";
import TravelPreferences from "@/components/profile/travel-pre";
import { useAuthStore, User } from "@/store/auth.store";

const Profile = () => {
  const { user, getUserProfile, updateUserProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    const initProfile = async () => {
      if (!user) {
        await getUserProfile();
      }
    };
    initProfile();
  }, [user, getUserProfile]);

  useEffect(() => {
    if (user) {
      setEditedUser(JSON.parse(JSON.stringify(user)));
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    if (user) {
      setEditedUser(JSON.parse(JSON.stringify(user)));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditedUser(JSON.parse(JSON.stringify(user)));
    }
  };

  const handleSave = async () => {
    if (editedUser) {
      try {
        await updateUserProfile(editedUser);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (editedUser) {
      setEditedUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [field]: value,
        };
      });
    }
  };

  const handleNestedInputChange = (
    section: keyof User,
    field: string,
    value: string,
  ) => {
    if (editedUser) {
      setEditedUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [section]: {
            ...(prev[section] || {}),
            [field]: value,
          },
        };
      });
    }
  };

  if (!user && isLoading) {
    return (
      <div className="bg-background flex min-h-screen w-full items-center justify-center">
        <div className="flex animate-pulse items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-foreground font-medium">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  if (!user && !isLoading) {
    return (
      <div className="bg-background flex min-h-screen w-full items-center justify-center">
        <div className="bg-card border-border mx-auto max-w-md rounded-xl border p-8 text-center shadow-sm">
          <UserIcon className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
          <p className="text-foreground mb-2 text-lg font-medium">
            Unable to load profile
          </p>
          <p className="text-muted-foreground text-sm">
            Please try refreshing the page or logging in again.
          </p>
        </div>
      </div>
    );
  }

  const displayUser = isEditing ? editedUser : user;

  return (
    <div className="bg-background mx-auto min-h-screen w-full max-w-7xl px-4 pt-10 pb-20 md:px-8">
      <ProfileHeader
        isEditing={isEditing}
        handleEdit={handleEdit}
        handleCancel={handleCancel}
        handleSave={handleSave}
        isLoading={isLoading}
        accentColor="blue-500"
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <ProfileCard
              displayUser={displayUser}
              isEditing={isEditing}
              editedUser={editedUser}
              handleInputChange={handleInputChange}
              accentColor="blue-500"
            />
            <TravelStats displayUser={displayUser} accentColor="blue-500" />
            <HeritageScore user={displayUser} />
            <ProfileCompletion
              displayUser={displayUser}
              accentColor="blue-500"
            />
          </div>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <TravelPreferences displayUser={displayUser} accentColor="blue-500" />
          <InterestsPreferences
            displayUser={displayUser}
            accentColor="blue-500"
          />
          <ExperienceBackground
            displayUser={displayUser}
            isEditing={isEditing}
            editedUser={editedUser}
            handleNestedInputChange={handleNestedInputChange}
            accentColor="blue-500"
          />
          <SpecialRequirements
            displayUser={displayUser}
            isEditing={isEditing}
            editedUser={editedUser}
            handleNestedInputChange={handleNestedInputChange}
            accentColor="blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
