"use client";

import {
  Box,
  Headset,
  Landmark,
  Search,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import ArModal from "@/components/experience/ar-modal";
import FiltersBar from "@/components/experience/filter-bar";
import MonumentsGrid from "@/components/experience/monument-grid";
import { Spinner } from "@/components/ui/spinner";
import { type ModelItem, useModelStore } from "@/store/model.store";

export type Monument = ModelItem;

export default function MonumentsPage() {
  const { models, getModels, isLoading, trackVisit } = useModelStore();
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const [selectedModelUid, setSelectedModelUid] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedArchitecture, setSelectedArchitecture] =
    useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  useEffect(() => {
    getModels();
  }, [getModels]);

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          models.map((m) => m.location).filter((l): l is string => Boolean(l)),
        ),
      ),
    [models],
  );

  const architectures = useMemo(
    () =>
      Array.from(
        new Set(
          models
            .map((m) => m.architecture)
            .filter((a): a is string => Boolean(a)),
        ),
      ),
    [models],
  );

  const periods = useMemo(() => {
    const s = new Set<string>();
    models.forEach((m: Monument) => {
      const y = parseInt(String(m.yearBuilt || ""), 10);
      if (isNaN(y)) return s.add("Unknown");
      if (y < 1000) s.add("Ancient");
      else if (y < 1500) s.add("Medieval");
      else if (y < 1800) s.add("Early Modern");
      else if (y < 1900) s.add("19th Century");
      else s.add("Modern");
    });
    return Array.from(s);
  }, [models]);

  const filteredModels = useMemo(() => {
    return models.filter((model: Monument) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        model.name?.toLowerCase().includes(q) ||
        model.location?.toLowerCase().includes(q);
      const matchesLocation =
        selectedLocation === "all" || model.location === selectedLocation;
      const matchesArchitecture =
        selectedArchitecture === "all" ||
        model.architecture === selectedArchitecture;
      const year = parseInt(String(model.yearBuilt || ""), 10);
      let period = "Unknown";
      if (!isNaN(year)) {
        if (year < 1000) period = "Ancient";
        else if (year < 1500) period = "Medieval";
        else if (year < 1800) period = "Early Modern";
        else if (year < 1900) period = "19th Century";
        else period = "Modern";
      }
      const matchesPeriod =
        selectedPeriod === "all" || period === selectedPeriod;
      return (
        matchesSearch && matchesLocation && matchesArchitecture && matchesPeriod
      );
    });
  }, [
    models,
    searchTerm,
    selectedLocation,
    selectedArchitecture,
    selectedPeriod,
  ]);

  const vrCount = models.filter((m: Monument) => m.vrHTMLPath).length;
  const arCount = models.filter((m: Monument) => m.sketchfabUid).length;
  const hasActiveFilters =
    searchTerm ||
    selectedLocation !== "all" ||
    selectedArchitecture !== "all" ||
    selectedPeriod !== "all";

  const openArModal = (uid: string, monumentId?: string) => {
    setSelectedModelUid(uid);
    setIsArModalOpen(true);
    if (monumentId) trackVisit(monumentId);
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-[#0d0d0d]">
              <Spinner className="text-blue-400" />
            </div>
          </div>
          <p className="text-xs font-semibold tracking-widest text-zinc-600 uppercase">
            Loading Heritage Library…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full space-y-8 py-8 pb-24">
      {/* ── Page Hero ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-[#0a0a0a]">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-blue-600/10 blur-[80px]" />
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative px-8 py-10 md:px-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Heritage Explorer
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Monuments{" "}
            <span className="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Library
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
            Explore India's architectural legacy through immersive 3D models,
            augmented reality overlays, and cinematic VR walkthroughs.
          </p>

          {/* Stats pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              {
                icon: Landmark,
                label: `${models.length} Monuments`,
                color: "border-zinc-700 text-zinc-300",
              },
              {
                icon: Box,
                label: `${arCount} 3D Models`,
                color: "border-blue-500/25 text-blue-400 bg-blue-500/8",
              },
              {
                icon: Headset,
                label: `${vrCount} VR Ready`,
                color: "border-purple-500/25 text-purple-400 bg-purple-500/8",
              },
              {
                icon: Search,
                label: `${filteredModels.length} Shown`,
                color:
                  "border-emerald-500/25 text-emerald-400 bg-emerald-500/8",
              },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${color}`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters toggle ── */}
      <div className="rounded-2xl border border-white/6 bg-[#0d0d0d]">
        {/* Header bar */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3.5"
        >
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-semibold text-zinc-300">Filters</span>
            {hasActiveFilters && (
              <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                Active
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
            {showFilters ? "Hide" : "Show"}
          </span>
        </button>

        {showFilters && (
          <div className="border-t border-white/5 px-5 pt-4 pb-5">
            <FiltersBar
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              architectures={architectures}
              selectedArchitecture={selectedArchitecture}
              onSelectArchitecture={setSelectedArchitecture}
              periods={periods}
              selectedPeriod={selectedPeriod}
              onSelectPeriod={setSelectedPeriod}
              onClear={() => {
                setSearchTerm("");
                setSelectedLocation("all");
                setSelectedArchitecture("all");
                setSelectedPeriod("all");
              }}
            />
          </div>
        )}
      </div>

      {/* Inline search (always visible) */}
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-600" />
        <input
          type="text"
          placeholder="Quick search monuments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          className="w-full rounded-xl border border-white/6 bg-[#0d0d0d] py-3 pr-4 pl-11 text-sm text-white transition-colors outline-none placeholder:text-zinc-600 focus:border-white/12 focus:ring-0"
        />
      </div>

      {/* ── Grid or Empty ── */}
      {filteredModels.length > 0 ? (
        <MonumentsGrid models={filteredModels} onOpenAr={openArModal} />
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-[#0d0d0d] py-24 text-center">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-500/5 blur-3xl" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
              <Search className="h-6 w-6 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                No monuments found
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                Try adjusting your search or filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("all");
                setSelectedArchitecture("all");
                setSelectedPeriod("all");
              }}
              className="rounded-xl border border-white/8 bg-white/4 px-5 py-2 text-sm font-semibold text-zinc-300 transition-all hover:border-white/12 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* ── VR Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/15 bg-[#0a0a0a]">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-600/8 via-transparent to-blue-600/5" />
        <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="relative flex flex-col items-center gap-5 px-8 py-12 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-purple-500/25 bg-purple-500/10">
            <div className="absolute inset-0 rounded-3xl bg-purple-500/10 blur-xl" />
            <Headset className="relative h-7 w-7 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Step into History
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
              Experience India's heritage in full virtual reality.{" "}
              <span className="font-semibold text-zinc-300">
                {vrCount} monuments
              </span>{" "}
              available in immersive VR walkthroughs.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { emoji: "🥽", label: "VR Headset" },
              { emoji: "📱", label: "Mobile AR" },
              { emoji: "🎮", label: "Interactive" },
              { emoji: "🏛️", label: "100% Free" },
            ].map(({ emoji, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-1.5 text-xs font-medium text-zinc-400"
              >
                {emoji} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ArModal
        open={isArModalOpen}
        onOpenChange={setIsArModalOpen}
        selectedModelUid={selectedModelUid}
      />
    </div>
  );
}
