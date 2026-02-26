import { create } from "zustand";

import { apiClient } from "@/utils/axios";

export type CallStatus =
  | "queued"
  | "ringing"
  | "in-progress"
  | "ended"
  | "failed";

export interface TripDetails {
  destination?: string;
  startDate?: string;
  endDate?: string;
  travelers?: number | string;
  budget?: string;
  preferences?: string[];
  activities?: string[];
}

export interface AiInsights {
  tripSummary?: string;
  keyPoints?: string[];
  processedAt?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  estimatedCost?: string;
  tips?: string;
}

export interface Trip {
  _id: string;
  name?: string;
  callId?: string;
  callStatus?: CallStatus;
  callDuration?: number;
  phoneNumber?: string;
  transcript?: string;
  tripDetails?: TripDetails;
  aiInsights?: AiInsights;
  itinerary?: ItineraryDay[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TripInsights {
  [key: string]: unknown;
}

interface TripState {
  trips: Trip[];
  trip: Trip | null;
  loading: boolean;
  error: string | null;
}

interface TripActions {
  fetchTrips: () => Promise<void>;
  getTripInsights: (tripId: string) => Promise<TripInsights>;
  createCall: () => Promise<any>;
  getTripById: (tripId: string) => Promise<void>;
}

export type TripStore = TripState & TripActions;

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  trip: null,
  loading: false,
  error: null,

  fetchTrips: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/vapi/trips");
      set({ trips: response.data.data.trips || [], loading: false });
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      set({
        error: error.response?.data?.error || "Failed to fetch trips",
        loading: false,
      });
    }
  },

  getTripInsights: async (tripId: string) => {
    try {
      const response = await apiClient.get(`/vapi/insights/${tripId}`);
      return response.data.data.insights;
    } catch (error: any) {
      console.error("Error fetching trip insights:", error);
      throw error;
    }
  },

  createCall: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/vapi/call");
      // Refresh trips after creating a call
      await get().fetchTrips();
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating call:", error);
      set({
        error: error.response?.data?.error || "Failed to create call",
        loading: false,
      });
      throw error;
    }
  },

  getTripById: async (tripId: string) => {
    try {
      const response = await apiClient.get(`/vapi/trip/${tripId}`);
      set({ trip: response.data.data.trip });
    } catch (error: any) {
      console.error("Error fetching trip details:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
