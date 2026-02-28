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

      const objectUrl = URL.createObjectURL(file);
      setPreviewSrc(objectUrl);

      setError(null);
      setResult(null);
      setStage("uploading");
      setStepIdx(0);

      let s = 0;
      const stepTimer = setInterval(() => {
        s = Math.min(s + 1, STEPS.length - 1);
        setStepIdx(s);
      }, 15000);

      try {
        const form = new FormData();
        form.append("image", file);

        setStage("processing");

        const resp = await apiClient.post(
          `/model3d/generate?steps=8&guidance=0&simplify=true&faces=10000&texture=${withTexture}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        clearInterval(stepTimer);

        const data: GenerationResult = resp.data.data;
        setResult(data);
        setStage("complete");

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
    <div className="mx-auto w-full space-y-8 px-8 py-10 pb-24 md:px-8">
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="lazyOnload"
      />

      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <Box className="h-5 w-5 text-zinc-400" />
              AR Studio
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Upload any photo — NimbusAI generates an interactive 3D model in
              seconds.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
            AI Pipeline Online
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        {/* ── Left: Generator ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
          {/* Options row */}
          <div className="flex flex-wrap items-center gap-3 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 px-5 py-3 sm:gap-4">
            <Wand2 className="h-4 w-4 shrink-0 text-zinc-500" />
            <span className="text-xs text-zinc-400 sm:text-sm">
              Generate with textures
            </span>
            <button
              onClick={() => setWithTexture((v) => !v)}
              className={`relative ml-auto h-6 w-11 rounded-full border transition-colors ${
                withTexture
                  ? "border-zinc-500 bg-zinc-600"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  withTexture ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="hidden text-xs text-zinc-600 sm:inline">
              {withTexture ? "Slower but photorealistic" : "Fast geometry only"}
            </span>
          </div>

          {/* Main stage card */}
          <div className="min-h-80 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 sm:min-h-105 lg:min-h-125">
            {/* ── IDLE: Drop zone ── */}
            {stage === "idle" && (
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="flex h-full min-h-80 cursor-pointer flex-col items-center justify-center gap-4 p-6 transition-colors hover:bg-zinc-900/50 sm:min-h-105 sm:p-8 lg:min-h-125"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 sm:h-20 sm:w-20">
                  <Upload className="h-6 w-6 text-zinc-400 sm:h-8 sm:w-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white sm:text-base">
                    Drop your image here
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    or tap to browse — JPG / PNG, up to 20 MB
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {["Monuments", "Landmarks", "Buildings", "Landscapes"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-700/60 bg-zinc-800/60 px-2.5 py-1 text-[10px] text-zinc-400 sm:px-3 sm:text-xs"
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
              <div className="flex h-full min-h-80 flex-col items-center justify-center gap-5 p-6 sm:min-h-105 sm:gap-6 sm:p-8 lg:min-h-125">
                {previewSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewSrc}
                    alt="Input"
                    className="h-24 w-24 rounded-xl border border-zinc-800 object-cover sm:h-32 sm:w-32"
                  />
                )}

                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-400 sm:h-6 sm:w-6" />
                  <p className="text-sm font-semibold text-white sm:text-base">
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
                            ? "bg-zinc-300"
                            : i === stepIdx
                              ? "animate-pulse bg-zinc-400"
                              : "bg-zinc-700"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          i < stepIdx
                            ? "text-zinc-300"
                            : i === stepIdx
                              ? "text-zinc-400"
                              : "text-zinc-600"
                        }`}
                      >
                        {step}
                      </span>
                      {i < stepIdx && (
                        <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-zinc-600 sm:text-xs">
                  This usually takes 20–60 seconds depending on complexity
                </p>
              </div>
            )}

            {/* ── ERROR ── */}
            {stage === "error" && (
              <div className="flex h-full min-h-80 flex-col items-center justify-center gap-4 p-6 text-center sm:min-h-105 sm:p-8 lg:min-h-125">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 sm:h-16 sm:w-16">
                  <AlertCircle className="h-7 w-7 text-red-400 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white sm:text-base">
                    Generation failed
                  </p>
                  <p className="mt-1 max-w-sm text-xs text-zinc-500 sm:text-sm">
                    {error}
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="rounded-lg border border-zinc-800 bg-transparent px-5 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* ── COMPLETE ── */}
            {stage === "complete" && result && (
              <div className="flex h-full min-h-80 flex-col gap-4 p-4 sm:min-h-105 sm:p-6 lg:min-h-125">
                {/* Preview / quota warning */}
                {result.isPreview && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 sm:px-4 sm:py-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-xs font-semibold text-amber-400 sm:text-sm">
                        Preview Model
                      </p>
                      <p className="mt-0.5 text-[10px] text-amber-400/70 sm:text-xs">
                        {result.previewMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Success banner + actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={`flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm ${result.isPreview ? "border-amber-500/20 bg-amber-500/5 text-amber-400" : "border-zinc-700/60 bg-zinc-800/60 text-zinc-300"}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="xs:inline hidden">Download</span> GLB
                    </a>
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      New Model
                    </button>
                  </div>
                </div>

                {/* 3D viewer */}
                <div className="relative min-h-60 flex-1 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 sm:min-h-80">
                  {/* @ts-expect-error – model-viewer is a custom element */}
                  <model-viewer
                    src={result.glbUrl}
                    alt="Generated 3D model"
                    auto-rotate
                    camera-controls
                    ar
                    shadow-intensity="1"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "inherit",
                    }}
                  />

                  {/* Overlay pill */}
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/90 px-3 py-1.5 text-[10px] font-medium text-zinc-300 backdrop-blur-sm sm:gap-3 sm:px-5 sm:py-2.5 sm:text-sm">
                    <Box className="h-3.5 w-3.5 text-zinc-400 sm:h-4 sm:w-4" />
                    Drag to rotate · Scroll to zoom
                  </div>
                </div>

                {/* Input image + segmented preview row */}
                {(result.segmentedImageUrl || previewSrc) && (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950 p-3 sm:gap-4 sm:p-4">
                    <div className="flex gap-3">
                      {previewSrc && (
                        <div className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewSrc}
                            alt="Original"
                            className="h-12 w-12 rounded-lg border border-zinc-800 object-cover sm:h-16 sm:w-16"
                          />
                          <p className="mt-1 text-[10px] text-zinc-600 sm:text-xs">
                            Input
                          </p>
                        </div>
                      )}
                      {result.segmentedImageUrl && (
                        <div className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={result.segmentedImageUrl}
                            alt="Segmented"
                            className="h-12 w-12 rounded-lg border border-zinc-800 object-cover sm:h-16 sm:w-16"
                          />
                          <p className="mt-1 text-[10px] text-zinc-600 sm:text-xs">
                            Segmented
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-[10px] text-zinc-500 sm:text-xs">
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
        <div className="flex w-full flex-col gap-4 sm:gap-6 xl:w-80 xl:shrink-0">
          <h2 className="text-sm font-semibold text-white">
            Recent Generations
          </h2>

          <div className="flex flex-col gap-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-950 py-10 text-center sm:py-14">
                <ImageIcon className="h-7 w-7 text-zinc-600 sm:h-8 sm:w-8" />
                <p className="text-xs text-zinc-500 sm:text-sm">
                  Your generated models will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {history.map((item, i) => (
                  <a
                    key={i}
                    href={item.glbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950 p-3 transition-colors hover:border-zinc-700 sm:gap-4 sm:p-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="h-10 w-10 shrink-0 rounded-lg border border-zinc-800 object-cover sm:h-12 sm:w-12"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white sm:text-sm">
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] text-zinc-500 sm:text-xs">
                          <Clock className="h-3 w-3" />
                          {timeAgo(item.time)}
                        </span>
                        <span className="rounded-full border border-zinc-700/60 bg-zinc-800/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300 sm:px-2 sm:text-xs">
                          Ready
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Stats card */}
          <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 p-4 sm:p-6">
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase sm:mb-4 sm:text-xs">
              Pipeline Stats
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {history.length > 0 &&
                [
                  { label: "Models Generated", value: history.length },
                  { label: "Inference Steps", value: "50 (Quality)" },
                  { label: "Provider", value: "NimbusAI" },
                  { label: "Format", value: ".GLB / AR" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-lg font-bold text-white sm:text-xl">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-500 sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
