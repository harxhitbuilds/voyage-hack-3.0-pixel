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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="text-zinc-500" />
          <p className="text-xs font-semibold tracking-widest text-zinc-600 uppercase">
            Loading Heritage Library…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-8 px-8 py-10 pb-24 md:px-8">
      {/* ── Page Header ── */}
      <div className="mb-2">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/50 px-3 py-1.5">
          <Zap className="h-3 w-3 text-zinc-400" />
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            Heritage Explorer
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Monuments Library
        </h1>
        <p className="mt-1 max-w-xl text-sm text-zinc-500">
          Explore India's architectural legacy through immersive 3D models,
          augmented reality overlays, and cinematic VR walkthroughs.
        </p>

        {/* Stats pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { icon: Landmark, label: `${models.length} Monuments` },
            { icon: Box, label: `${arCount} 3D Models` },
            { icon: Headset, label: `${vrCount} VR Ready` },
            { icon: Search, label: `${filteredModels.length} Shown` },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300"
            >
              <Icon className="h-3 w-3 text-zinc-400" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Filters toggle ── */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3.5"
        >
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-semibold text-zinc-300">Filters</span>
            {hasActiveFilters && (
              <span className="rounded-full border border-zinc-600 bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                Active
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
            {showFilters ? "Hide" : "Show"}
          </span>
        </button>

        {showFilters && (
          <div className="border-t border-zinc-800/60 px-5 pt-4 pb-5">
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

      {/* Inline search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Quick search monuments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/60 py-3 pr-4 pl-11 text-sm text-white transition-colors outline-none placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-0"
        />
      </div>

      {/* ── Grid or Empty ── */}
      {filteredModels.length > 0 ? (
        <MonumentsGrid models={filteredModels} onOpenAr={openArModal} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-800/60 bg-zinc-950 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
            <Search className="h-6 w-6 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              No monuments found
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
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
            className="rounded-lg border border-zinc-800 bg-transparent px-5 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── VR Banner ── */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950">
        <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
            <Headset className="h-6 w-6 text-zinc-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">
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
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300"
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
