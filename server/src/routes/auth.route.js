import { Router } from "express";
import {
  signUp,
  logout,
  checkAuth,
  onBoardUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/logout", logout);
router.post("/onboard", authenticate, onBoardUser);
router.get("/check-auth", authenticate, checkAuth);
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);

export default router;
