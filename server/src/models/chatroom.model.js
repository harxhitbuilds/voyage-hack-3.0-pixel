import mongoose from "mongoose";

// ─── Message Sub-Schema ────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        senderName: { type: String, required: true },
        senderAvatar: { type: String, default: "" },
        content: { type: String, required: true },
        type: {
            type: String,
            enum: ["user", "ai", "system"],
            default: "user",
        },
        // If type === "ai", this holds the structured plan JSON
        plan: {
            title: { type: String },
            summary: { type: String },
            actionItems: [{ type: String }],
        },
        votes: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                userName: { type: String },
            },
        ],
    },
    { timestamps: true }
);

// ─── ChatRoom Schema ───────────────────────────────────────────────────────────
const chatRoomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                name: { type: String },
                avatar: { type: String, default: "" },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
        messages: [messageSchema],
        inviteCode: { type: String, unique: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
