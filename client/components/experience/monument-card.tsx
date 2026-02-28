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
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 transition-all duration-300 hover:border-zinc-700">
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

        {/* Image overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-black/30 to-transparent" />

        {/* Top: capability chips */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {has3D(monument) && (
            <span className="rounded-md border border-zinc-600 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-bold text-zinc-300 backdrop-blur-sm">
              3D
            </span>
          )}
          {hasAR(monument) && (
            <span className="rounded-md border border-zinc-600 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-bold text-zinc-300 backdrop-blur-sm">
              AR
            </span>
          )}
          {hasVR(monument) && (
            <span className="rounded-md border border-zinc-600 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-bold text-zinc-300 backdrop-blur-sm">
              VR
            </span>
          )}
        </div>

        {/* Experience count */}
        {count > 0 && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full border border-zinc-600 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-sm">
              {count} {count === 1 ? "experience" : "experiences"}
            </span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute right-0 bottom-0 left-0 px-4 pb-4">
          <h3
            className="text-base leading-tight font-bold text-white"
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
        <p className="line-clamp-2 text-[12px] leading-relaxed text-zinc-500">
          {monument.description ||
            "A remarkable piece of India's architectural heritage."}
        </p>

        {monument.architecture && (
          <span className="self-start rounded-full border border-zinc-700/60 bg-zinc-800/60 px-2.5 py-1 text-[10px] font-medium text-zinc-300">
            {monument.architecture}
          </span>
        )}

        {/* Action buttons */}
        <div className="mt-auto grid grid-cols-3 gap-2">
          <ActionBtn
            label="3D"
            icon={<Box className="h-3.5 w-3.5" />}
            enabled={has3D(monument)}
            onClick={() =>
              monument.sketchfabUid && onOpenAr(String(monument.sketchfabUid))
            }
          />
          <ActionBtn
            label="AR"
            icon={<Eye className="h-3.5 w-3.5" />}
            enabled={hasAR(monument)}
            onClick={() => onOpenArlink(monument.arlink)}
          />
          <ActionBtn
            label="VR"
            icon={<Headset className="h-3.5 w-3.5" />}
            enabled={hasVR(monument)}
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
const ActionBtn = ({
  label,
  icon,
  enabled,
  onClick,
  suffix,
}: {
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  onClick: () => void;
  suffix?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={!enabled}
    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all duration-200 ${
      enabled
        ? "border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
        : "cursor-not-allowed border-zinc-800/40 bg-zinc-900/30 text-zinc-700"
    }`}
  >
    {icon}
    {label}
    {suffix}
  </button>
);

export default MonumentCard;
