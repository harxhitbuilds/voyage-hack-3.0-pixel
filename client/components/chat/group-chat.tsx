"use client";

import { format } from "date-fns";
import { ArrowLeft, Copy, Loader2, Send, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useEffect, useRef, useState } from "react";

import { useChatRoom } from "@/hooks/use-chat-room";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Message, useChatStore } from "@/store/chat.store";

import ConsensusCard from "./consensus-card";

interface GroupChatProps {
  roomId: string;
}

/**
 * GroupChat — The main collaborative chat room UI.
 * Renders messages, system events, and AI consensus cards.
 * Includes a text input area and a "Generate Plan" trigger button.
 */
export default function GroupChat({ roomId }: GroupChatProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    activeRoom,
    isLoading,
    isGeneratingPlan,
    error,
    fetchRoomById,
    generatePlan,
    clearError,
  } = useChatStore();

  const { sendMessage, voteOnPlan } = useChatRoom(roomId);
  const [input, setInput] = useState("");
  // Resolve user ID — Mongoose may return _id or id depending on serialization
  const currentUserId = user?.id || (user as any)?._id;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Load room data ─────────────────────────────────────────────────────
  useEffect(() => {
    if (roomId) {
      fetchRoomById(roomId);
    }
  }, [roomId, fetchRoomById]);

  // ── Auto-scroll to bottom on new messages ──────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoom?.messages]);

  // ── Toast errors ───────────────────────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // ── Handle send ────────────────────────────────────────────────────────
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Check if user mentioned @Nimbus → trigger plan generation
    if (trimmed.toLowerCase().includes("@nimbus")) {
      handleGeneratePlan();
    } else {
      sendMessage(trimmed);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Generate plan ──────────────────────────────────────────────────────
  const handleGeneratePlan = async () => {
    if (!roomId) return;
    await generatePlan(roomId);
  };

  // ── Copy invite code ──────────────────────────────────────────────────
  const handleCopyCode = () => {
    if (activeRoom?.inviteCode) {
      navigator.clipboard.writeText(activeRoom.inviteCode);
      toast.success("Invite code copied!");
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (isLoading && !activeRoom) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!activeRoom) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Room not found.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden rounded-2xl bg-zinc-950/80 backdrop-blur-xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/home/chat")}
            className="rounded-full p-1.5 transition-colors hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
          </button>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-white">
              {activeRoom.name}
            </h2>
            <p className="text-xs text-zinc-500">
              {activeRoom.members.length} members
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Invite code badge */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-[11px] text-zinc-400 transition-colors hover:bg-zinc-800"
            title="Copy invite code"
          >
            <Copy className="h-3 w-3" />
            {activeRoom.inviteCode}
          </button>

          {/* Member avatars */}
          <div className="flex -space-x-1.5">
            {activeRoom.members.slice(0, 5).map((m) => (
              <span
                key={m.userId}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-800 text-xs font-medium text-zinc-300"
                title={m.name}
              >
                {m.name.charAt(0).toUpperCase()}
              </span>
            ))}
            {activeRoom.members.length > 5 && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-800 text-[10px] text-zinc-400">
                +{activeRoom.members.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Messages Area ───────────────────────────────────────────────── */}
      <div className="flex-1 space-y-1 overflow-y-auto px-5 py-4">
        {activeRoom.messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
            currentUserId={currentUserId}
            totalMembers={activeRoom.members.length}
            onVote={() => voteOnPlan(msg._id)}
          />
        ))}

        {/* Generating plan indicator */}
        {isGeneratingPlan && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            <span className="text-xs text-zinc-500">
              Nimbus is crafting your plan…
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ──────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-800 px-4 py-3">
        <div className="flex items-end gap-2">
          {/* Generate plan button */}
          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
              isGeneratingPlan
                ? "cursor-not-allowed bg-zinc-800/60 text-zinc-600"
                : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-white",
            )}
            title="Generate AI consensus plan"
          >
            <Sparkles className="h-4 w-4" />
          </button>

          {/* Text input */}
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message… (or type @Nimbus to generate a plan)"
              rows={1}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
              input.trim()
                ? "bg-white text-black shadow-lg"
                : "cursor-not-allowed bg-zinc-800/60 text-zinc-600",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Individual Message Bubble ───────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId?: string;
  totalMembers: number;
  onVote: () => void;
}

function MessageBubble({
  message,
  isOwn,
  currentUserId,
  totalMembers,
  onVote,
}: MessageBubbleProps) {
  // ── System messages ────────────────────────────────────────────────────
  if (message.type === "system") {
    return (
      <div className="flex justify-center py-2">
        <span className="rounded-full bg-zinc-800/60 px-3 py-1 text-[11px] text-zinc-500">
          {message.content}
        </span>
      </div>
    );
  }

  // ── AI plan card ───────────────────────────────────────────────────────
  if (message.type === "ai" && message.plan) {
    return (
      <div className="py-3">
        <ConsensusCard
          plan={message.plan}
          votes={message.votes || []}
          totalMembers={totalMembers}
          currentUserId={currentUserId}
          onVote={onVote}
        />
      </div>
    );
  }

  // ── User messages ──────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex gap-2.5 py-1.5",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      {/* Avatar (other users only) */}
      {!isOwn && (
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-300">
          {message.senderName.charAt(0).toUpperCase()}
        </span>
      )}

      <div className={cn("max-w-[70%]", isOwn ? "items-end" : "items-start")}>
        {/* Sender name (other users only) */}
        {!isOwn && (
          <p className="mb-0.5 text-[11px] font-medium text-zinc-500">
            {message.senderName}
          </p>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isOwn
              ? "rounded-br-md bg-white text-black"
              : "rounded-bl-md border border-zinc-800 bg-zinc-800/80 text-zinc-200",
          )}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        {message.createdAt && (
          <p
            className={cn(
              "mt-0.5 text-[10px] text-zinc-600",
              isOwn && "text-right",
            )}
          >
            {format(new Date(message.createdAt), "h:mm a")}
          </p>
        )}
      </div>
    </div>
  );
}
