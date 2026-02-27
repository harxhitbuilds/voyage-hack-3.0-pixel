import { Client } from "@gradio/client";
import asyncHandler from "../utils/async-handle.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/error.js";
import fs from "fs";

const SPACE = "VAST-AI/TripoSG";

const DEMO_FALLBACKS = [
    "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
];


export const generateModel = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ApiError(400, "Image file is required"));
    }

    const {
        steps = 8,
        guidance = 0,
        simplify = "true",
        faces = 10000,
        texture = "false",
    } = req.query;

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBlob = new Blob([imageBuffer], {
        type: req.file.mimetype || "image/png",
    });

    let client;
    try {
        client = await Client.connect(SPACE, {
            hf_token: process.env.HF_TOKEN || undefined,
        });
    } catch {
        return next(
            new ApiError(503, "TripoSG service is unavailable. Try again shortly.")
        );
    }

    // 1. Start session (warm up)
    try {
        await client.predict("/start_session", {});
    } catch {
        // non-fatal – space may already be warm
    }

    // 2. Background removal / segmentation
    let segmentedImage;
    try {
        const segResult = await client.predict("/run_segmentation", {
            image: imageBlob,
        });
        segmentedImage = segResult.data[0]; // url string or blob
    } catch (err) {

        segmentedImage = imageBlob;
    }

    let seed = 0;
    try {
        const seedResult = await client.predict("/get_random_seed", {
            randomize_seed: true,
            seed: 0,
        });
        seed = seedResult.data[0];
    } catch {
        seed = Math.floor(Math.random() * 65536);
    }

    // 4. Image → 3D
    let glbUrl;
    let isDemo = false;
    try {
        // If segmented image is a URL string, re-fetch as Blob
        let inputForModel = segmentedImage;
        if (typeof segmentedImage === "string") {
            const resp = await fetch(segmentedImage);
            inputForModel = await resp.blob();
        }

        const modelResult = await client.predict("/image_to_3d", {
            image: inputForModel,
            seed: Number(seed),
            num_inference_steps: Number(steps),
            guidance_scale: Number(guidance),
            simplify: simplify === "true",
            target_face_num: Number(faces),
        });

        // modelResult.data[0] is a FileData object: { url, path, orig_name, ... }
        glbUrl = modelResult.data[0]?.url || modelResult.data[0];
    } catch (err) {
        console.error("TripoSG image_to_3d error:", err);

        // Quota exceeded → return a demo model instead of crashing
        const isQuotaError =
            (err?.message || "").toLowerCase().includes("quota") ||
            (err?.title || "").toLowerCase().includes("quota");

        if (isQuotaError) {
            const fallback =
                DEMO_FALLBACKS[Math.floor(Math.random() * DEMO_FALLBACKS.length)];
            // Clean up temp upload
            try { fs.unlinkSync(req.file.path); } catch { }
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        glbUrl: fallback,
                        rawGlbUrl: fallback,
                        texturedGlbUrl: null,
                        seed,
                        segmentedImageUrl:
                            typeof segmentedImage === "string" ? segmentedImage : null,
                        isDemo: true,
                        demoMessage:
                            "GPU quota exceeded — showing a demo model. Your quota resets in ~24h.",
                    },
                    "Demo model returned (GPU quota exceeded)"
                )
            );
        }

        return next(new ApiError(500, "3D model generation failed: " + err.message));
    }

    // 5. Optional texture pass
    let texturedGlbUrl = null;
    if (texture === "true" && glbUrl) {
        try {
            let inputForTexture = segmentedImage;
            if (typeof segmentedImage === "string") {
                const resp = await fetch(segmentedImage);
                inputForTexture = await resp.blob();
            }
            const textureResult = await client.predict("/run_texture", {
                image: inputForTexture,
                mesh_path: {
                    path: glbUrl,
                    meta: { _type: "gradio.FileData" },
                    orig_name: "model.glb",
                    url: glbUrl,
                },
                seed: Number(seed),
            });
            texturedGlbUrl = textureResult.data[0]?.url || textureResult.data[0];
        } catch (err) {
            console.warn("Texture pass failed, returning untextured GLB:", err.message);
        }
    }

    // Clean up temp upload
    try {
        fs.unlinkSync(req.file.path);
    } catch { }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                glbUrl: texturedGlbUrl || glbUrl,
                rawGlbUrl: glbUrl,
                texturedGlbUrl,
                seed,
                segmentedImageUrl:
                    typeof segmentedImage === "string" ? segmentedImage : null,
            },
            "3D model generated successfully"
        )
    );
});
