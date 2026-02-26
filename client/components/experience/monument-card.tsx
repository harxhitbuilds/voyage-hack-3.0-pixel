"use client";

import {
  Box,
  Calendar,
  ExternalLink,
  Eye,
  Headset,
  MapPin,
} from "lucide-react";

import React from "react";

import type { Monument } from "@/app/home/experience/page";
import { Badge } from "@/components/ui/badge";

interface Props {
  monument: Monument;
  onOpenAr: (uid: string) => void;
  onOpenVr: (monument: Monument) => void;
  onOpenArlink: (arlink?: string | null) => void;
}

const MonumentCard: React.FC<Props> = ({
  monument,
  onOpenAr,
  onOpenVr,
  onOpenArlink,
}) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-800">
        {monument.imageUrl ? (
          <img
            src={monument.imageUrl}
            alt={monument.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-8 w-8 text-zinc-600" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Capability badges top-right */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {monument.sketchfabUid && (
            <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400 backdrop-blur-sm">
              3D
            </span>
          )}
          {monument.arlink && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400 backdrop-blur-sm">
              AR
            </span>
          )}
          {monument.vrHTMLPath && (
            <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-400 backdrop-blur-sm">
              VR
            </span>
          )}
        </div>

        {/* Name + location over image bottom */}
        <div className="absolute bottom-0 left-0 p-4">
          <h3
            className="text-base leading-tight font-bold text-white"
            title={monument.name}
          >
            {monument.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="h-3 w-3" />
            <span className="truncate" title={monument.location}>
              {monument.location || "India"}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {monument.description ||
            "A remarkable piece of India's architectural heritage."}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          {monument.yearBuilt && (
            <Badge className="gap-1 rounded-full border-0 bg-zinc-800 px-2.5 py-0.5 text-xs font-normal text-zinc-400">
              <Calendar className="h-3 w-3" />
              {monument.yearBuilt}
            </Badge>
          )}
          {monument.architecture && (
            <Badge className="max-w-30 truncate rounded-full border-0 bg-zinc-800 px-2.5 py-0.5 text-xs font-normal text-zinc-400">
              {monument.architecture}
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-auto grid grid-cols-3 gap-2 pt-1">
          {/* 3D */}
          <button
            onClick={() =>
              monument.sketchfabUid && onOpenAr(String(monument.sketchfabUid))
            }
            disabled={!monument.sketchfabUid}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-200 ${
              monument.sketchfabUid
                ? "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:border-blue-400/50 hover:bg-blue-500/20"
                : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            3D
          </button>

          {/* AR */}
          <button
            onClick={() => onOpenArlink(monument.arlink)}
            disabled={!monument.arlink}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-200 ${
              monument.arlink
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/20"
                : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            AR
          </button>

          {/* VR */}
          <button
            onClick={() => onOpenVr(monument)}
            disabled={!monument.vrHTMLPath}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-200 ${
              monument.vrHTMLPath
                ? "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:border-purple-400/50 hover:bg-purple-500/20"
                : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
            }`}
          >
            <Headset className="h-3.5 w-3.5" />
            {monument.vrHTMLPath ? (
              <span className="flex items-center gap-0.5">
                VR <ExternalLink className="h-2.5 w-2.5" />
              </span>
            ) : (
              "VR"
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default MonumentCard;
