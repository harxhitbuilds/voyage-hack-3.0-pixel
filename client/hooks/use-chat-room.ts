"use client";

import { io, Socket } from "socket.io-client";

import { useCallback, useEffect, useRef } from "react";

import { useAuthStore } from "@/store/auth.store";
import { Message, useChatStore, Vote } from "@/store/chat.store";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_API_URL?.replace("/api", "") ||
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      ""
    : process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:5000";

/**
 * Custom hook that manages the Socket.io connection for a chat room.
 * Handles joining, leaving, sending messages, and receiving real-time events.
 */
export function useChatRoom(roomId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();
  const { addMessage, updateVotes, fetchRoomById } = useChatStore();

  // Resolve the user's MongoDB _id consistently
  const userId = user?.id || (user as any)?._id;

  // ── Connect & join room ────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !user || !userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      socket.emit("join-room", {
        roomId,
        user: { id: userId, name: user.name, profile: user.profile },
      });
    });

    // ── Listen for new messages ──────────────────────────────────────────
    socket.on("new-message", (message: Message) => {
      addMessage(message);
    });

    // ── Listen for vote updates ──────────────────────────────────────────
    socket.on(
      "vote-updated",
      ({ messageId, votes }: { messageId: string; votes: Vote[] }) => {
        updateVotes(messageId, votes);
      },
    );

    // ── User join/leave notifications (optional UI usage) ────────────────
    socket.on("user-joined", ({ userName }: { userName: string }) => {
      console.log(`👤 ${userName} joined the room`);
    });

    socket.on("user-left", ({ userName }: { userName: string }) => {
      console.log(`👋 ${userName} left the room`);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // ── Cleanup on unmount or roomId change ──────────────────────────────
    return () => {
      socket.emit("leave-room", {
        roomId,
        user: { id: userId, name: user.name },
      });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, user, userId, addMessage, updateVotes]);

  // ── Send a message via socket (preferred) ─────────────────────────────
  const sendMessage = useCallback(
    (message: string) => {
      if (!socketRef.current || !roomId || !user || !userId) return;
      socketRef.current.emit("send-message", {
        roomId,
        message,
        user: { id: userId, name: user.name, profile: user.profile },
      });
    },
    [roomId, user, userId],
  );

  // ── Broadcast a plan that was generated via REST ──────────────────────
  const broadcastPlan = useCallback(
    (message: Message) => {
      if (!socketRef.current || !roomId) return;
      socketRef.current.emit("plan-generated", { roomId, message });
    },
    [roomId],
  );

  // ── Vote via socket ───────────────────────────────────────────────────
  const voteOnPlan = useCallback(
    (messageId: string) => {
      if (!socketRef.current || !roomId || !user || !userId) return;
      socketRef.current.emit("vote-plan", {
        roomId,
        messageId,
        user: { id: userId, name: user.name },
      });
    },
    [roomId, user, userId],
  );

  return { sendMessage, broadcastPlan, voteOnPlan };
}
