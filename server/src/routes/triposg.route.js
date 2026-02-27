import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware.js";
import { generateModel } from "../controllers/triposg.controller.js";

const router = Router();

// Store uploads temporarily in /tmp
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

// POST /api/triposg/generate  — requires auth + image upload
router.post("/generate", authenticate, upload.single("image"), generateModel);

export default router;
