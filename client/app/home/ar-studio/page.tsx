"use client";

import {
  AlertCircle,
  ArrowLeft,
  Box,
  CheckCircle2,
  Clock,
  Download,
  ImageIcon,
  Info,
  Loader2,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

import { useCallback, useRef, useState } from "react";

import { apiClient } from "@/utils/axios";

/* ── Types ─────────────────────────────────────────────────────── */
type Stage = "idle" | "uploading" | "processing" | "complete" | "error";

interface GenerationResult {
  glbUrl: string;
  rawGlbUrl: string | null;
  texturedGlbUrl: string | null;
  segmentedImageUrl: string | null;
  seed: number;
  isPreview?: boolean;
  previewMessage?: string;
}

interface HistoryItem {
  name: string;
  previewUrl: string;
  glbUrl: string;
  time: Date;
}

/* ── Step indicator ─────────────────────────────────────────────── */
const STEPS = [
  "Initialising NimbusAI pipeline",
  "Uploading image",
  "Generating 3D geometry",
  "Applying textures & materials",
  "Finalising model",
];

export default function ARStudioPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [withTexture, setWithTexture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File chosen ── */
  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a JPG or PNG image.");
        setStage("error");
        return;
      }

      // Local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewSrc(objectUrl);

      setError(null);
      setResult(null);
      setStage("uploading");
      setStepIdx(0);

      // Animate step labels while waiting
      let s = 0;
      const stepTimer = setInterval(() => {
        s = Math.min(s + 1, STEPS.length - 1);
        setStepIdx(s);
      }, 15000); // ~15s per step, generation takes ~60-90s total

      try {
        const form = new FormData();
        form.append("image", file);

        setStage("processing");

        // POST to our server — NimbusAI 2D→3D pipeline
        const resp = await apiClient.post(
          `/model3d/generate?steps=8&guidance=0&simplify=true&faces=10000&texture=${withTexture}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        clearInterval(stepTimer);

        const data: GenerationResult = resp.data.data;
        setResult(data);
        setStage("complete");

        // Add to local history
        setHistory((prev) => [
          {
            name: file.name,
            previewUrl: objectUrl,
            glbUrl: data.glbUrl,
            time: new Date(),
          },
          ...prev.slice(0, 9),
        ]);
      } catch (err: any) {
        clearInterval(stepTimer);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Generation failed. Please try again.";
        setError(msg);
        setStage("error");
      }
    },
    [withTexture],
  );

  /* ── Drop zone handlers ── */
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const reset = () => {
    setStage("idle");
    setError(null);
    setResult(null);
    setPreviewSrc(null);
    setStepIdx(0);
  };

  const timeAgo = (d: Date) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="lazyOnload"
      />

      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="h-4 w-px bg-zinc-800" />
            <span className="flex items-center gap-2 text-base font-bold tracking-tight">
              <Box className="h-5 w-5 text-blue-400" />
              AR Studio
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                Powered by NimbusAI
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            AI Pipeline Online
          </div>
        </div>
      </nav>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12">
        {/* ── Left: Generator ── */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              2D → 3D Conversion
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Upload any photo of a monument or destination — NimbusAI generates
              an interactive 3D model in seconds.
            </p>
          </div>

          {/* Options row */}
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3">
            <Wand2 className="h-4 w-4 shrink-0 text-zinc-500" />
            <span className="text-sm text-zinc-400">
              Generate with textures
            </span>
            <button
              onClick={() => setWithTexture((v) => !v)}
              className={`relative ml-auto h-6 w-11 rounded-full border transition-colors ${
                withTexture
                  ? "border-blue-500/50 bg-blue-500"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  withTexture ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-xs text-zinc-600">
              {withTexture ? "Slower but photorealistic" : "Fast geometry only"}
            </span>
          </div>

          {/* Main stage card */}
          <div className="min-h-125 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            {/* ── IDLE: Drop zone ── */}
            {stage === "idle" && (
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="flex h-full min-h-125 cursor-pointer flex-col items-center justify-center gap-4 p-8 transition-colors hover:bg-zinc-800/30"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800">
                  <Upload className="h-8 w-8 text-zinc-400" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-white">
                    Drop your image here
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    or click to browse — JPG / PNG, up to 20 MB
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {["Monuments", "Landmarks", "Buildings", "Landscapes"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-400"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onInputChange}
                />
              </label>
            )}

            {/* ── UPLOADING / PROCESSING ── */}
            {(stage === "uploading" || stage === "processing") && (
              <div className="flex h-full min-h-125 flex-col items-center justify-center gap-6 p-8">
                {previewSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewSrc}
                    alt="Input"
                    className="h-32 w-32 rounded-xl border border-zinc-700 object-cover"
                  />
                )}

                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  <p className="text-base font-semibold text-white">
                    {stage === "uploading"
                      ? "Uploading image…"
                      : STEPS[stepIdx]}
                  </p>
                </div>

                {/* Step progress */}
                <div className="w-full max-w-md space-y-2">
                  {STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                          i < stepIdx
                            ? "bg-emerald-400"
                            : i === stepIdx
                              ? "animate-pulse bg-blue-400"
                              : "bg-zinc-700"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          i < stepIdx
                            ? "text-emerald-400"
                            : i === stepIdx
                              ? "text-blue-300"
                              : "text-zinc-600"
                        }`}
                      >
                        {step}
                      </span>
                      {i < stepIdx && (
                        <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-400" />
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-zinc-600">
                  This usually takes 20–60 seconds depending on complexity
                </p>
              </div>
            )}

            {/* ── ERROR ── */}
            {stage === "error" && (
              <div className="flex h-full min-h-125 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    Generation failed
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-zinc-500">{error}</p>
                </div>
                <button
                  onClick={reset}
                  className="rounded-xl bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* ── COMPLETE ── */}
            {stage === "complete" && result && (
              <div className="flex h-full min-h-125 flex-col gap-4 p-6">
                {/* Preview / quota warning */}
                {result.isPreview && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-sm font-semibold text-amber-400">
                        Preview Model
                      </p>
                      <p className="mt-0.5 text-xs text-amber-400/70">
                        {result.previewMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Success banner */}
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${result.isPreview ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {result.isPreview
                      ? "Preview Model"
                      : `3D Model Ready — Seed ${result.seed}`}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={result.glbUrl}
                      target="_blank"
                      rel="noreferrer"
                      download="model.glb"
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                      Download GLB
                    </a>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      <Sparkles className="h-4 w-4" />
                      New Model
                    </button>
                  </div>
                </div>

                {/* 3D viewer */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
                  {/* @ts-expect-error – model-viewer is a custom element */}
                  <model-viewer
                    src={result.glbUrl}
                    alt="Generated 3D model"
                    auto-rotate
                    camera-controls
                    ar
                    shadow-intensity="1"
                    style={{ width: "100%", height: "100%", minHeight: 380 }}
                  />

                  {/* Overlay pill */}
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900/90 px-5 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm">
                    <Box className="h-4 w-4 text-blue-400" />
                    Drag to rotate · Scroll to zoom
                  </div>
                </div>

                {/* Input image + segmented preview row */}
                {(result.segmentedImageUrl || previewSrc) && (
                  <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <div className="flex gap-3">
                      {previewSrc && (
                        <div className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewSrc}
                            alt="Original"
                            className="h-16 w-16 rounded-lg border border-zinc-700 object-cover"
                          />
                          <p className="mt-1 text-xs text-zinc-600">Input</p>
                        </div>
                      )}
                      {result.segmentedImageUrl && (
                        <div className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={result.segmentedImageUrl}
                            alt="Segmented"
                            className="h-16 w-16 rounded-lg border border-zinc-700 object-cover"
                          />
                          <p className="mt-1 text-xs text-zinc-600">
                            Segmented
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex-1 text-xs text-zinc-500">
                      {result.texturedGlbUrl
                        ? "✅ Textured GLB generated (PBR materials)"
                        : "✅ Geometry GLB generated"}
                      <br />
                      {!result.isPreview && `Seed: ${result.seed}`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: History sidebar ── */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Recent Generations
          </h2>

          <div className="flex flex-col gap-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 py-14 text-center">
                <ImageIcon className="h-8 w-8 text-zinc-700" />
                <p className="text-sm text-zinc-600">
                  Your generated models will appear here
                </p>
              </div>
            ) : (
              history.map((item, i) => (
                <a
                  key={i}
                  href={item.glbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-600"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="h-12 w-12 shrink-0 rounded-lg border border-zinc-700 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {timeAgo(item.time)}
                      </span>
                      <span className="rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                        Ready
                      </span>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>

          {/* Stats card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
              Pipeline Stats
            </p>
            <div className="grid grid-cols-2 gap-4">
              {history.length > 0 &&
                [
                  { label: "Models Generated", value: history.length },
                  { label: "Inference Steps", value: "50 (Quality)" },
                  { label: "Provider", value: "NimbusAI" },
                  { label: "Format", value: ".GLB / AR" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xl font-black text-white">{value}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
