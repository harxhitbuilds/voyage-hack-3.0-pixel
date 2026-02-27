import ChatRoom from "../models/chatroom.model.js";

/**
 * Sets up all Socket.io event handlers for the collaborative chat rooms.
 *
 * Events:
 *   join-room   → User joins a room channel
 *   send-message → User sends a message, broadcasted to all in the room
 *   leave-room  → User leaves a room channel
 *   vote-plan   → User votes on a plan card
 */
export function setupSocketHandlers(io) {
    io.on("connection", (socket) => {
        console.log(`⚡ Socket connected: ${socket.id}`);

        // ── Join a chat room ────────────────────────────────────────────────
        socket.on("join-room", ({ roomId, user }) => {
            socket.join(roomId);
            console.log(`👤 ${user?.name || "Unknown"} joined room ${roomId}`);

            // Notify others in the room
            socket.to(roomId).emit("user-joined", {
                userName: user?.name,
                userId: user?.id,
            });
        });

        // ── Send a message ──────────────────────────────────────────────────
        socket.on("send-message", async ({ roomId, message, user }) => {
            try {
                const room = await ChatRoom.findById(roomId);
                if (!room) return;

                const newMessage = {
                    senderId: user.id,
                    senderName: user.name,
                    senderAvatar: user.profile || "",
                    content: message,
                    type: "user",
                };

                room.messages.push(newMessage);
                await room.save();

                // Get the saved message with its _id and timestamps
                const savedMessage = room.messages[room.messages.length - 1];

                // Broadcast to everyone in the room (including sender)
                io.in(roomId).emit("new-message", savedMessage);
            } catch (error) {
                console.error("Socket send-message error:", error.message);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // ── Vote on a plan ──────────────────────────────────────────────────
        socket.on("vote-plan", async ({ roomId, messageId, user }) => {
            try {
                const room = await ChatRoom.findById(roomId);
                if (!room) return;

                const msg = room.messages.id(messageId);
                if (!msg || msg.type !== "ai") return;

                const odgovarajuciUserId = user.id?.toString();

                const existingIdx = msg.votes.findIndex(
                    (v) => v.userId?.toString() === odgovarajuciUserId
                );

                if (existingIdx >= 0) {
                    msg.votes.splice(existingIdx, 1);
                } else {
                    msg.votes.push({ userId: user.id, userName: user.name });
                }

                await room.save();

                // Serialize votes as plain objects with string userIds
                // to ensure consistent comparison on all clients
                const serializedVotes = msg.votes.map((v) => ({
                    userId: v.userId?.toString(),
                    userName: v.userName,
                }));

                // Broadcast updated vote state to all clients in the room
                io.in(roomId).emit("vote-updated", {
                    messageId,
                    votes: serializedVotes,
                });
            } catch (error) {
                console.error("Socket vote-plan error:", error.message);
            }
        });

        // ── AI plan generated (called from REST, broadcast here) ────────────
        socket.on("plan-generated", ({ roomId, message }) => {
            io.in(roomId).emit("new-message", message);
        });

        // ── Leave room ──────────────────────────────────────────────────────
        socket.on("leave-room", ({ roomId, user }) => {
            socket.leave(roomId);
            console.log(`👋 ${user?.name || "Unknown"} left room ${roomId}`);
            socket.to(roomId).emit("user-left", {
                userName: user?.name,
                userId: user?.id,
            });
        });

        // ── Disconnect ──────────────────────────────────────────────────────
        socket.on("disconnect", () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);
        });
    });
}
