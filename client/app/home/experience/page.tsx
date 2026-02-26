"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/global/components/section-heading";
import ArModal from "@/components/experience/ar-modal";
import FiltersBar from "@/components/experience/filter-bar";
import MonumentsGrid from "@/components/experience/monument-grid";
import StatsBadges from "@/components/experience/stats-badge";
import { Spinner } from "@/components/ui/spinner";
import { type ModelItem, useModelStore } from "@/store/model.store";

// Re-export as Monument for use in child components
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

  const openArModal = (uid: string) => {
    setSelectedModelUid(uid);
    setIsArModalOpen(true);
  };

  const closeArModal = () => {
    setSelectedModelUid(null);
    setIsArModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-3">
          <Spinner className="text-primary" />
          <span className="text-foreground font-inter-medium">
            Loading monuments...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background mt-6 min-h-screen w-full px-4">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionHeading heading="Monuments Library" />
          <p className="text-muted-foreground font-inter-regular">
            Explore India's heritage through immersive 3D, AR, and VR
            experiences
          </p>
        </div>

        <StatsBadges total={models.length} vrCount={vrEnabledCount} />
      </div>

      <div className="bg-card mb-8 rounded-xl p-4">
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
        <div className="mt-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Showing {filteredModels.length} of {models.length} monuments
          </span>
        </div>
      </div>

      <MonumentsGrid models={filteredModels} onOpenAr={openArModal} />

      {filteredModels.length === 0 && (
        <div className="py-12 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl">
            <div className="text-muted-foreground h-8 w-8">🔍</div>
          </div>
          <h3 className="font-inter-semibold text-foreground mb-2 text-xl">
            No monuments found
          </h3>
          <p className="text-muted-foreground font-inter-regular">
            Try adjusting your search criteria or clear filters to see all
            monuments
          </p>
        </div>
      )}

      <div className="from-card/50 via-accent/10 to-card/50 border-border mt-12 rounded-xl border bg-linear-to-r p-6 text-center">
        <h3 className="font-inter-semibold text-foreground mb-2 text-xl">
          Experience Heritage in Virtual Reality
        </h3>
        <p className="text-muted-foreground font-inter-regular mb-4">
          Step into history with our immersive VR experiences. {vrEnabledCount}{" "}
          monuments now available in virtual reality!
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-success/20 text-success inline-flex items-center gap-2 rounded-xl px-3 py-1">
            🥽 VR Compatible
          </span>
          <span className="bg-accent/20 text-accent inline-flex items-center gap-2 rounded-xl px-3 py-1">
            📱 Mobile Friendly
          </span>
          <span className="bg-primary/20 text-primary inline-flex items-center gap-2 rounded-xl px-3 py-1">
            🎮 Interactive Tours
          </span>
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
