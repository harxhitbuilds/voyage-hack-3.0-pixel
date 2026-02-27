import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatRoom from "../models/chatroom.model.js";
import asyncHandler from "../utils/async-handle.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/error.js";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// ─── Create a new chat room ────────────────────────────────────────────────────
export const createRoom = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const user = req.user;

    if (!name) {
        throw new ApiError(400, "Room name is required");
    }

    // Generate a unique 8-char invite code
    const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const chatRoom = await ChatRoom.create({
        name,
        description: description || "",
        createdBy: user._id,
        inviteCode,
        members: [
            {
                userId: user._id,
                name: user.name,
                avatar: user.profile || "",
            },
        ],
        messages: [
            {
                senderName: "Nimbus",
                content: `Welcome to "${name}"! 🎉 Invite your friends with code: ${inviteCode}. When you're ready to plan, type @Nimbus or hit the ✨ button to generate a consensus plan.`,
                type: "system",
            },
        ],
    });

    res
        .status(201)
        .json(new ApiResponse(201, { room: chatRoom }, "Room created successfully"));
});

// ─── Join a room via invite code ───────────────────────────────────────────────
export const joinRoom = asyncHandler(async (req, res) => {
    const { inviteCode } = req.body;
    const user = req.user;

    if (!inviteCode) {
        throw new ApiError(400, "Invite code is required");
    }

    const chatRoom = await ChatRoom.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!chatRoom) {
        throw new ApiError(404, "Room not found. Check your invite code.");
    }

    // Check if user is already a member
    const alreadyMember = chatRoom.members.some(
        (m) => m.userId.toString() === user._id.toString()
    );

    if (!alreadyMember) {
        chatRoom.members.push({
            userId: user._id,
            name: user.name,
            avatar: user.profile || "",
        });

        chatRoom.messages.push({
            senderName: "Nimbus",
            content: `${user.name} has joined the room! 👋`,
            type: "system",
        });

        await chatRoom.save();
    }

    res
        .status(200)
        .json(new ApiResponse(200, { room: chatRoom }, "Joined room successfully"));
});

// ─── Get rooms the user is part of ────────────────────────────────────────────
export const getUserRooms = asyncHandler(async (req, res) => {
    const user = req.user;

    const rooms = await ChatRoom.find({
        "members.userId": user._id,
        isActive: true,
    })
        .select("name description members inviteCode createdAt updatedAt")
        .sort({ updatedAt: -1 });

    res
        .status(200)
        .json(new ApiResponse(200, { rooms }, "Rooms fetched successfully"));
});

// ─── Get a single room with full messages ──────────────────────────────────────
export const getRoomById = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const user = req.user;

    const room = await ChatRoom.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    // Ensure the user is a member
    const isMember = room.members.some(
        (m) => m.userId.toString() === user._id.toString()
    );

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this room");
    }

    res
        .status(200)
        .json(new ApiResponse(200, { room }, "Room fetched successfully"));
});

// ─── Send a message (REST fallback — real-time via Socket.io) ──────────────────
export const sendMessage = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!content) {
        throw new ApiError(400, "Message content is required");
    }

    const room = await ChatRoom.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const message = {
        senderId: user._id,
        senderName: user.name,
        senderAvatar: user.profile || "",
        content,
        type: "user",
    };

    room.messages.push(message);
    await room.save();

    // Return the newly added message (last item in array)
    const savedMessage = room.messages[room.messages.length - 1];

    res
        .status(201)
        .json(new ApiResponse(201, { message: savedMessage }, "Message sent"));
});

// ─── Generate AI Consensus Plan ────────────────────────────────────────────────
export const generatePlan = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const user = req.user;

    const room = await ChatRoom.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    // Collect all user messages as context
    const chatHistory = room.messages
        .filter((m) => m.type === "user")
        .map((m) => `${m.senderName}: ${m.content}`)
        .join("\n");

    if (!chatHistory || chatHistory.length < 10) {
        throw new ApiError(
            400,
            "Not enough conversation to generate a plan. Keep discussing!"
        );
    }

    const memberNames = room.members.map((m) => m.name).join(", ");

    const prompt = `
You are Nimbus, a friendly and expert travel/outing coordinator AI.

A group of friends (${memberNames}) are planning an outing together. Below is their chat conversation. Your job is to:

1. Read every message carefully.
2. Identify each person's preferences, constraints, and desires.
3. Find the best consensus that satisfies everyone.
4. Generate a single, optimized plan.

CONVERSATION:
${chatHistory}

RESPOND ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "title": "Name of the chosen activity or place",
  "summary": "A 2-3 sentence paragraph explaining how this plan fits everyone's preferences and why it's the best choice.",
  "actionItems": [
    "Action item 1 — what to do, bring, or prepare",
    "Action item 2",
    "Action item 3",
    "Action item 4",
    "Action item 5"
  ]
}
`;

    try {
        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Parse the JSON from the LLM response
        let plan;
        try {
            plan = JSON.parse(responseText);
        } catch {
            // Try extracting JSON from potential markdown wrapping
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                plan = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not parse AI response as JSON");
            }
        }

        // Validate the structure
        if (!plan.title || !plan.summary || !Array.isArray(plan.actionItems)) {
            throw new Error("AI response is missing required fields");
        }

        // Save the plan as an AI message in the room
        const aiMessage = {
            senderName: "Nimbus AI",
            content: `✨ Here's the consensus plan: "${plan.title}"`,
            type: "ai",
            plan: {
                title: plan.title,
                summary: plan.summary,
                actionItems: plan.actionItems,
            },
            votes: [],
        };

        room.messages.push(aiMessage);
        await room.save();

        const savedAiMessage = room.messages[room.messages.length - 1];

        res
            .status(200)
            .json(
                new ApiResponse(200, { message: savedAiMessage, plan }, "Plan generated successfully")
            );
    } catch (error) {
        console.error("AI Plan generation error:", error);
        throw new ApiError(500, "Failed to generate plan. Try again later.", [
            error.message,
        ]);
    }
});

// ─── Vote on a plan ────────────────────────────────────────────────────────────
export const votePlan = asyncHandler(async (req, res) => {
    const { roomId, messageId } = req.params;
    const user = req.user;

    const room = await ChatRoom.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const message = room.messages.id(messageId);

    if (!message || message.type !== "ai") {
        throw new ApiError(404, "Plan message not found");
    }

    // Toggle vote
    const existingVoteIndex = message.votes.findIndex(
        (v) => v.userId?.toString() === user._id.toString()
    );

    if (existingVoteIndex >= 0) {
        message.votes.splice(existingVoteIndex, 1);
    } else {
        message.votes.push({ userId: user._id, userName: user.name });
    }

    await room.save();

    // Serialize votes with string IDs for consistent client-side comparison
    const serializedMessage = message.toObject();
    serializedMessage.votes = serializedMessage.votes.map((v) => ({
        userId: v.userId?.toString(),
        userName: v.userName,
    }));

    res
        .status(200)
        .json(new ApiResponse(200, { message: serializedMessage }, "Vote updated successfully"));
});
