"use client";

import { use } from "react";

import GroupChat from "@/components/chat/group-chat";

interface ChatRoomPageProps {
  params: Promise<{ roomId: string }>;
}

/**
 * Dynamic route: /home/chat/[roomId]
 * Renders the GroupChat component for a specific room.
 */
export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = use(params);

  return <GroupChat roomId={roomId} />;
}
