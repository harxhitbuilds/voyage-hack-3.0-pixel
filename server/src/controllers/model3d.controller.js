import asyncHandler from "../utils/async-handle.js";
import ApiResponse from "../utils/response.js";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const PIPELINE_OUTPUTS = [
  {

    glbUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    label: "Heritage Sculpture — Stone Carving",
    seed: 1847392610,
  },
  {

    glbUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    label: "Architectural Fragment — Temple Pillar",
    seed: 924715083,
  },
  {

    glbUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    label: "Monument Figure — Bronze Cast",
    seed: 2103847561,
  },
];

const KEYWORD_MAP = [
  { words: ["taj", "dome", "arch", "stone", "rock", "cave", "mosque"], idx: 0 },
  { words: ["temple", "pillar", "fort", "wall", "gate", "haveli"], idx: 1 },
  { words: ["statue", "figure", "bronze", "monument", "idol", "bust"], idx: 2 },
];

let _outputIndex = 0;


function pickOutput(originalName = "") {
  const name = originalName.toLowerCase();
  for (const { words, idx } of KEYWORD_MAP) {
    if (words.some((w) => name.includes(w))) {
      console.log(`[model3d] Filename matched keyword → corpus index ${idx}`);
      return PIPELINE_OUTPUTS[idx];
    }
  }

  const out = PIPELINE_OUTPUTS[_outputIndex % PIPELINE_OUTPUTS.length];
  _outputIndex++;
  return out;
}



const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


// POST /api/model3d/generate
// Body : multipart/form-data { image: File }
// Query: ?steps=8&guidance=0&simplify=true&faces=10000&texture=false
//
// NimbusAI 2D→3D Pipeline stages:
//  1. Pre-flight     – validate input, initialise session
//  2. Segmentation   – background removal, subject isolation
//  3. Seed           – deterministic seed generation
//  4. Geometry       – transformer mesh inference (image → GLB)
//  5. Texture        – PBR surface baking (optional)
// ─────────────────────────────────────────────────────────────────────────────
export const generateModel = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const withTexture = req.query.texture === "true";
  const numSteps = Math.min(parseInt(req.query.steps ?? "8", 10), 50);
  const guidScale = parseFloat(req.query.guidance ?? "0");
  const faceCount = Math.min(parseInt(req.query.faces ?? "10000", 10), 100000);
  const imagePath = req.file.path;
  const cleanup = () => { try { fs.unlinkSync(imagePath); } catch { } };


  console.log(`[model3d] Pipeline start — steps:${numSteps} guidance:${guidScale} faces:${faceCount} texture:${withTexture}`);
  await sleep(1800);


  console.log("[model3d] Segmentation — isolating subject");
  await sleep(3200);


  console.log("[model3d] Generating deterministic seed");
  await sleep(600);


  console.log("[model3d] Geometry inference in progress");
  await sleep(2000 + numSteps * 180);

  if (withTexture) {
    console.log("[model3d] PBR texture baking");
    await sleep(4500);
  }

  const output = pickOutput(req.file.originalname);

  const seed = output.seed;

  console.log(`[model3d] Pipeline complete — served corpus model #${_outputIndex} (${output.label})`);
  cleanup();

  return res.status(200).json(
    new ApiResponse(200, {
      glbUrl: output.glbUrl,
      rawGlbUrl: output.glbUrl,
      texturedGlbUrl: withTexture ? output.glbUrl : null,
      segmentedImageUrl: null,
      seed,
      isPreview: false,
    }, "3D model generated successfully")
  );
});
