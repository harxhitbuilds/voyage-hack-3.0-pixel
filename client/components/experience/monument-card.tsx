"use client";

import { Box, ExternalLink, Eye, Headset, MapPin } from "lucide-react";

import React from "react";

import type { Monument } from "@/app/home/experience/page";

interface Props {
  monument: Monument;
  onOpenAr: (uid: string) => void;
  onOpenVr: (monument: Monument) => void;
  onOpenArlink: (arlink?: string | null) => void;
}

const has3D = (m: Monument) => Boolean(m.sketchfabUid);
const hasAR = (m: Monument) => Boolean(m.arlink);
const hasVR = (m: Monument) => Boolean(m.vrHTMLPath);

const MonumentCard: React.FC<Props> = ({
  monument,
  onOpenAr,
  onOpenVr,
  onOpenArlink,
}) => {
  const count = [has3D(monument), hasAR(monument), hasVR(monument)].filter(
    Boolean,
  ).length;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/6 bg-[#0d0d0d] transition-all duration-300 hover:border-white/12 hover:shadow-2xl hover:shadow-black/60">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-900">
        {monument.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={monument.imageUrl}
            alt={monument.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900">
            <MapPin className="h-10 w-10 text-zinc-700" />
          </div>
        )}

        {/* Image overlay layers */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0d0d0d] via-black/30 to-transparent" />

        {/* Top: capability chips */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {has3D(monument) && (
            <span className="rounded-md border border-blue-500/30 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-blue-400 backdrop-blur-sm">
              3D
            </span>
          )}
          {hasAR(monument) && (
            <span className="rounded-md border border-emerald-500/30 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-emerald-400 backdrop-blur-sm">
              AR
            </span>
          )}
          {hasVR(monument) && (
            <span className="rounded-md border border-purple-500/30 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-purple-400 backdrop-blur-sm">
              VR
            </span>
          )}
        </div>

        {/* Experience count dot */}
        {count > 0 && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
              {count} {count === 1 ? "experience" : "experiences"}
            </span>
          </div>
        )}

        {/* Name overlay at bottom of image */}
        <div className="absolute right-0 bottom-0 left-0 px-4 pb-4">
          <h3
            className="text-base leading-tight font-black text-white"
            title={monument.name}
          >
            {monument.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{monument.location || "India"}</span>
            {monument.yearBuilt && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-zinc-500">{monument.yearBuilt}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Description */}
        <p className="line-clamp-2 text-[12px] leading-relaxed text-zinc-500">
          {monument.description ||
            "A remarkable piece of India's architectural heritage."}
        </p>

        {/* Architecture badge */}
        {monument.architecture && (
          <span className="self-start rounded-lg border border-white/6 bg-white/4 px-2.5 py-1 text-[10px] font-medium text-zinc-500">
            {monument.architecture}
          </span>
        )}

        {/* Action buttons */}
        <div className="mt-auto grid grid-cols-3 gap-2">
          <ActionBtn
            label="3D"
            icon={<Box className="h-3.5 w-3.5" />}
            enabled={has3D(monument)}
            accent="blue"
            onClick={() =>
              monument.sketchfabUid && onOpenAr(String(monument.sketchfabUid))
            }
          />
          <ActionBtn
            label="AR"
            icon={<Eye className="h-3.5 w-3.5" />}
            enabled={hasAR(monument)}
            accent="emerald"
            onClick={() => onOpenArlink(monument.arlink)}
          />
          <ActionBtn
            label={hasVR(monument) ? "VR" : "VR"}
            icon={<Headset className="h-3.5 w-3.5" />}
            enabled={hasVR(monument)}
            accent="purple"
            suffix={
              hasVR(monument) ? (
                <ExternalLink className="ml-0.5 h-2.5 w-2.5" />
              ) : undefined
            }
            onClick={() => onOpenVr(monument)}
          />
        </div>
      </div>
    </article>
  );
};

/* ── ActionBtn sub-component ── */
type Accent = "blue" | "emerald" | "purple";
const accentClasses: Record<Accent, string> = {
  blue: "border-blue-500/25 bg-blue-500/8 text-blue-400 hover:border-blue-400/40 hover:bg-blue-500/15",
  emerald:
    "border-emerald-500/25 bg-emerald-500/8 text-emerald-400 hover:border-emerald-400/40 hover:bg-emerald-500/15",
  purple:
    "border-purple-500/25 bg-purple-500/8 text-purple-400 hover:border-purple-400/40 hover:bg-purple-500/15",
};
const disabledClass =
  "cursor-not-allowed border-white/5 bg-white/2 text-zinc-700";

const ActionBtn = ({
  label,
  icon,
  enabled,
  accent,
  onClick,
  suffix,
}: {
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  accent: Accent;
  onClick: () => void;
  suffix?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={!enabled}
    className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all duration-200 ${
      enabled ? accentClasses[accent] : disabledClass
    }`}
  >
    {icon}
    {label}
    {suffix}
  </button>
);

export default MonumentCard;
