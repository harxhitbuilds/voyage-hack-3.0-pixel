import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    createRoom,
    joinRoom,
    getUserRooms,
    getRoomById,
    sendMessage,
    generatePlan,
    votePlan,
} from "../controllers/chatroom.controller.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Room CRUD
router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/my-rooms", getUserRooms);
router.get("/:roomId", getRoomById);

// Messages
router.post("/:roomId/message", sendMessage);

// AI Plan
router.post("/:roomId/generate-plan", generatePlan);

// Vote on a plan
router.post("/:roomId/message/:messageId/vote", votePlan);

export default router;
