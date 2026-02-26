"use client";

import { Box, Headset, Landmark, Search } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import ArModal from "@/components/experience/ar-modal";
import FiltersBar from "@/components/experience/filter-bar";
import MonumentsGrid from "@/components/experience/monument-grid";
import { Spinner } from "@/components/ui/spinner";
import { type ModelItem, useModelStore } from "@/store/model.store";

export type Monument = ModelItem;

export default function MonumentsPage() {
  const { models, getModels, isLoading } = useModelStore();
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const [selectedModelUid, setSelectedModelUid] = useState<string | null>(null);

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
    const setPeriods = new Set<string>();
    models.forEach((m: Monument) => {
      const year = parseInt(String(m.yearBuilt || ""), 10);
      if (isNaN(year)) return setPeriods.add("Unknown");
      if (year < 1000) setPeriods.add("Ancient");
      else if (year < 1500) setPeriods.add("Medieval");
      else if (year < 1800) setPeriods.add("Early Modern");
      else if (year < 1900) setPeriods.add("19th Century");
      else setPeriods.add("Modern");
    });
    return Array.from(setPeriods);
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

  const vrEnabledCount = models.filter((m: Monument) => m.vrHTMLPath).length;
  const arEnabledCount = models.filter((m: Monument) => m.sketchfabUid).length;

  const openArModal = (uid: string) => {
    setSelectedModelUid(uid);
    setIsArModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <Spinner className="text-white" />
          </div>
          <p className="text-sm text-zinc-500">Loading monuments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full space-y-8 py-8">
      {/* Page Header */}
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          Heritage Explorer
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Monuments Library
        </h1>
        <p className="text-sm text-zinc-500">
          Explore India's heritage through immersive 3D, AR, and VR experiences.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Landmark, label: "Total Monuments", value: models.length },
          { icon: Box, label: "3D Models", value: arEnabledCount },
          { icon: Headset, label: "VR Ready", value: vrEnabledCount },
          { icon: Search, label: "Showing", value: filteredModels.length },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 backdrop-blur-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Icon className="h-4 w-4 text-zinc-300" />
            </div>
            <div>
              <p className="text-base leading-none font-bold text-white">
                {value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm">
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

      {/* Grid */}
      {filteredModels.length > 0 ? (
        <MonumentsGrid models={filteredModels} onOpenAr={openArModal} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800">
            <Search className="h-6 w-6 text-zinc-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              No monuments found
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Try adjusting your search criteria or clear filters.
            </p>
          </div>
        </div>
      )}

      {/* VR Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-48 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800">
            <Headset className="h-6 w-6 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Experience Heritage in Virtual Reality
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500">
              Step into history with our immersive VR experiences.{" "}
              <span className="font-semibold text-zinc-300">
                {vrEnabledCount} monuments
              </span>{" "}
              now available in virtual reality.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { emoji: "🥽", label: "VR Compatible" },
              { emoji: "📱", label: "Mobile Friendly" },
              { emoji: "🎮", label: "Interactive Tours" },
            ].map(({ emoji, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-1.5 text-sm text-zinc-300"
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
