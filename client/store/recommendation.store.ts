import { create } from "zustand";

import { apiClient } from "@/utils/axios";

export interface Recommendation {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  location?: string;
  rating?: number;
  [key: string]: any;
}

interface RecommendationState {
  personalized: Recommendation[];
  trending: Recommendation[];
  loading: boolean;
  error: string | null;
  getPersonalized: () => Promise<void>;
  getTrending: () => Promise<void>;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  personalized: [],
  trending: [],
  loading: false,
  error: null,

  getPersonalized: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/recommendations/personalized");
      set({ personalized: response.data.data.recommendations, error: null });
    } catch (error: any) {
      console.error("Failed to fetch personalized recommendations:", error);
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch personalized recommendations",
      });
    } finally {
      set({ loading: false });
    }
  },

  getTrending: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/recommendations/trending");
      set({ trending: response.data.data.recommendations, error: null });
    } catch (error: any) {
      console.error("Failed to fetch trending recommendations:", error);
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch trending recommendations",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
