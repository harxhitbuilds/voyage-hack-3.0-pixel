"use client";

import { format } from "date-fns";
import { Loader2, MessageCircle, Plus, UserPlus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";

/**
 * Chat landing page — lists the user's rooms, and provides
 * modals to create a new room or join via invite code.
 */
export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { rooms, isLoading, fetchUserRooms, createRoom, joinRoom } =
    useChatStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserRooms();
  }, [fetchUserRooms]);

  // ── Create room handler ────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!roomName.trim()) return toast.error("Room name is required");
    setSubmitting(true);
    const room = await createRoom(roomName.trim(), roomDesc.trim());
    setSubmitting(false);
    if (room) {
      toast.success("Room created!");
      setShowCreateModal(false);
      setRoomName("");
      setRoomDesc("");
      router.push(`/home/chat/${room._id}`);
    }
  };

  // ── Join room handler ──────────────────────────────────────────────────
  const handleJoin = async () => {
    if (!inviteCode.trim()) return toast.error("Invite code is required");
    setSubmitting(true);
    const room = await joinRoom(inviteCode.trim());
    setSubmitting(false);
    if (room) {
      toast.success("Joined room!");
      setShowJoinModal(false);
      setInviteCode("");
      router.push(`/home/chat/${room._id}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Group Planning
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Plan outings with friends using AI-powered consensus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10"
          >
            <UserPlus className="h-4 w-4" />
            Join
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            <Plus className="h-4 w-4" />
            Create Room
          </button>
        </div>
      </div>

      {/* ── Room List ────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-white/30" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <MessageCircle className="h-7 w-7 text-white/20" />
          </div>
          <div>
            <p className="text-base font-medium text-white/50">No rooms yet</p>
            <p className="mt-1 text-sm text-white/30">
              Create one or join with an invite code
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => router.push(`/home/chat/${room._id}`)}
              className="flex w-full items-center gap-4 rounded-xl border border-white/5 bg-white/2 px-5 py-4 text-left transition-all hover:border-white/10 hover:bg-white/5"
            >
              {/* Room initial */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-base font-semibold text-white/70">
                {room.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {room.name}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-white/30">
                  <Users className="h-3 w-3" />
                  {room.members.length} members
                  <span className="text-white/10">•</span>
                  {format(new Date(room.updatedAt), "MMM d")}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="h-4 w-4 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* ── Create Room Modal ────────────────────────────────────────────── */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Create a Room">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Room Name *
              </label>
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Weekend Adventure Planning"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:ring-0 focus:outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Description (optional)
              </label>
              <input
                value={roomDesc}
                onChange={(e) => setRoomDesc(e.target.value)}
                placeholder="Let's plan something fun!"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={submitting || !roomName.trim()}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all",
                roomName.trim()
                  ? "bg-white text-black hover:bg-white/90"
                  : "cursor-not-allowed bg-white/10 text-white/30",
              )}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Room
            </button>
          </div>
        </Modal>
      )}

      {/* ── Join Room Modal ──────────────────────────────────────────────── */}
      {showJoinModal && (
        <Modal onClose={() => setShowJoinModal(false)} title="Join a Room">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Invite Code *
              </label>
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. A1B2C3D4"
                maxLength={8}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center font-mono text-lg tracking-widest text-white placeholder:text-white/20 focus:border-white/20 focus:ring-0 focus:outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={handleJoin}
              disabled={submitting || !inviteCode.trim()}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all",
                inviteCode.trim()
                  ? "bg-white text-black hover:bg-white/90"
                  : "cursor-not-allowed bg-white/10 text-white/30",
              )}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Join Room
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Reusable Modal ──────────────────────────────────────────────────────────

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4 text-white/40" />
        </button>

        <h3 className="mb-5 text-lg font-semibold text-white">{title}</h3>
        {children}
      </div>
    </div>
  );
}
