import { create } from "zustand";

import { apiClient } from "@/utils/axios";

export interface ModelItem {
  _id: string;
  name: string;
  imageUrl?: string;
  location?: string;
  description?: string;
  vrHTMLPath?: string | null;
  sketchfabUid?: string | null;
  [key: string]: any;
}

interface ModelState {
  models: ModelItem[];
  isLoading: boolean;
  error: string | null;
  getModels: () => Promise<void>;
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  isLoading: false,
  error: null,

  getModels: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{ data: { models: ModelItem[] } }>(
        "/3dmodel",
      );
      const models = response.data?.data?.models ?? [];
      set({ models });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Error fetching 3Dmodels:", message);
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
