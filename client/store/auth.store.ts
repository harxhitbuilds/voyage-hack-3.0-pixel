import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "sonner";
import { create } from "zustand";

import {
  auth,
  provider,
  signInWithPopup,
} from "@/configurations/firebase.config";
import { apiClient } from "@/utils/axios";

export interface User {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkingAuth: boolean;
}

export interface AuthActions {
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuthListener: () => () => void;
  onBoardUser: (onBoardData: Record<string, any>) => Promise<void>;
  getUserProfile: () => Promise<User | undefined>;
  updateUserProfile: (
    profileData: Record<string, any>,
  ) => Promise<User | undefined>;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  checkingAuth: true,

  loginWithGoogle: async () => {
    try {
      set({ isLoading: true });
      await signInWithPopup(auth, provider);
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed");
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await signOut(auth);
      toast.success("Logout successful!");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  initializeAuthListener: () => {
    set({ checkingAuth: true });
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await apiClient.post("/auth/signup", {
            idToken: token,
          });
          set({
            user: response.data.data.user,
            isAuthenticated: true,
            checkingAuth: false,
          });
        } catch (error) {
          console.error("Sync failed:", error);
          set({ user: null, isAuthenticated: false, checkingAuth: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, checkingAuth: false });
      }
    });
  },

  onBoardUser: async (onBoardData: Record<string, any>) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post("/auth/onboard", onBoardData);

      set({
        user: response.data.data.user,
        isAuthenticated: true,
      });
      toast.success("Onboarding successful!");
    } catch (error: any) {
      console.error("Onboarding failed:", error);
      const message = error.response?.data?.message || "Onboarding failed";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getUserProfile: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get("/auth/profile");
      set({
        user: response.data.data.user,
      });
      return response.data.data.user;
    } catch (error: any) {
      console.error("Failed to get user profile:", error);
      const message = error.response?.data?.message || "Failed to get profile";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (profileData: Record<string, any>) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.put("/auth/profile", profileData);
      set({
        user: response.data.data.user,
      });
      toast.success("Profile updated successfully!");
      return response.data.data.user;
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
