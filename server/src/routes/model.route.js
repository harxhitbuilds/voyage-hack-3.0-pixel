import Router from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getModels, trackVisit } from "../controllers/model.controller.js";

const router = Router();

router.get("/", authenticate, getModels);
router.post("/visit", authenticate, trackVisit);

export default router;
