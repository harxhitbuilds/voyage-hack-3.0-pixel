import { create } from "zustand";

import { apiClient } from "@/utils/axios";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Vote {
  userId: string;
  userName: string;
}

export interface Plan {
  title: string;
  summary: string;
  actionItems: string[];
}

export interface Message {
  _id: string;
  senderId?: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "user" | "ai" | "system";
  plan?: Plan;
  votes?: Vote[];
  createdAt: string;
}

export interface Member {
  userId: string;
  name: string;
  avatar?: string;
  joinedAt: string;
}

export interface ChatRoom {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: Member[];
  messages: Message[];
  inviteCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  isLoading: boolean;
  isGeneratingPlan: boolean;
  error: string | null;
}

export interface ChatActions {
  // Room management
  fetchUserRooms: () => Promise<void>;
  fetchRoomById: (roomId: string) => Promise<void>;
  createRoom: (name: string, description?: string) => Promise<ChatRoom | null>;
  joinRoom: (inviteCode: string) => Promise<ChatRoom | null>;

  // Messages (REST fallback — real-time handled via socket)
  sendMessage: (roomId: string, content: string) => Promise<void>;
  addMessage: (message: Message) => void;

  // AI plan
  generatePlan: (roomId: string) => Promise<void>;

  // Voting
  votePlan: (roomId: string, messageId: string) => Promise<void>;
  updateVotes: (messageId: string, votes: Vote[]) => void;

  // Util
  setActiveRoom: (room: ChatRoom | null) => void;
  clearError: () => void;
}

export type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  rooms: [],
  activeRoom: null,
  isLoading: false,
  isGeneratingPlan: false,
  error: null,

  // ── Fetch all rooms the user belongs to ───────────────────────────────
  fetchUserRooms: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.get("/chatroom/my-rooms");
      set({ rooms: res.data.data.rooms });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to fetch rooms" });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Fetch a single room with messages ─────────────────────────────────
  fetchRoomById: async (roomId: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.get(`/chatroom/${roomId}`);
      set({ activeRoom: res.data.data.room });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to fetch room" });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Create a new room ─────────────────────────────────────────────────
  createRoom: async (name: string, description?: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.post("/chatroom/create", {
        name,
        description,
      });
      const room = res.data.data.room;
      set((state) => ({ rooms: [room, ...state.rooms] }));
      return room;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to create room" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Join a room with invite code ──────────────────────────────────────
  joinRoom: async (inviteCode: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await apiClient.post("/chatroom/join", { inviteCode });
      const room = res.data.data.room;
      set((state) => {
        const exists = state.rooms.some((r) => r._id === room._id);
        return { rooms: exists ? state.rooms : [room, ...state.rooms] };
      });
      return room;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to join room" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Send a message (REST fallback) ────────────────────────────────────
  sendMessage: async (roomId: string, content: string) => {
    try {
      await apiClient.post(`/chatroom/${roomId}/message`, { content });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to send message" });
    }
  },

  // ── Add a real-time message to the active room ────────────────────────
  addMessage: (message: Message) => {
    set((state) => {
      if (!state.activeRoom) return state;
      // Prevent duplicates
      const exists = state.activeRoom.messages.some(
        (m) => m._id === message._id,
      );
      if (exists) return state;
      return {
        activeRoom: {
          ...state.activeRoom,
          messages: [...state.activeRoom.messages, message],
        },
      };
    });
  },

  // ── Generate AI consensus plan ────────────────────────────────────────
  generatePlan: async (roomId: string) => {
    try {
      set({ isGeneratingPlan: true, error: null });
      const res = await apiClient.post(`/chatroom/${roomId}/generate-plan`);
      const aiMessage = res.data.data.message;
      // Add the AI message to the active room
      get().addMessage(aiMessage);
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to generate plan",
      });
    } finally {
      set({ isGeneratingPlan: false });
    }
  },

  // ── Vote on a plan ────────────────────────────────────────────────────
  votePlan: async (roomId: string, messageId: string) => {
    try {
      await apiClient.post(`/chatroom/${roomId}/message/${messageId}/vote`);
    } catch (err: any) {
      set({ error: err?.response?.data?.message || "Failed to vote" });
    }
  },

  // ── Update votes from socket ──────────────────────────────────────────
  updateVotes: (messageId: string, votes: Vote[]) => {
    set((state) => {
      if (!state.activeRoom) return state;
      return {
        activeRoom: {
          ...state.activeRoom,
          messages: state.activeRoom.messages.map((m) =>
            m._id === messageId
              ? {
                  ...m,
                  // Ensure all vote userIds are plain strings
                  votes: votes.map((v) => ({
                    userId: v.userId?.toString(),
                    userName: v.userName,
                  })),
                }
              : m,
          ),
        },
      };
    });
  },

  setActiveRoom: (room) => set({ activeRoom: room }),
  clearError: () => set({ error: null }),
}));
