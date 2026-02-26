"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  searchTerm: string;
  onSearch: (v: string) => void;
  locations: string[];
  selectedLocation: string;
  onSelectLocation: (v: string) => void;
  architectures: string[];
  selectedArchitecture: string;
  onSelectArchitecture: (v: string) => void;
  periods: string[];
  selectedPeriod: string;
  onSelectPeriod: (v: string) => void;
  onClear: () => void;
}

const FiltersBar: React.FC<Props> = ({
  searchTerm,
  onSearch,
  locations,
  selectedLocation,
  onSelectLocation,
  architectures,
  selectedArchitecture,
  onSelectArchitecture,
  periods,
  selectedPeriod,
  onSelectPeriod,
  onClear,
}) => {
  const hasActiveFilters =
    searchTerm ||
    selectedLocation !== "all" ||
    selectedArchitecture !== "all" ||
    selectedPeriod !== "all";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search monuments..."
            value={searchTerm}
            onChange={(e) => onSearch(e.currentTarget.value)}
            className="border-zinc-800 bg-zinc-900 pl-10 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0"
          />
        </div>

        {/* Location */}
        <Select value={selectedLocation} onValueChange={onSelectLocation}>
          <SelectTrigger className="border-zinc-800 bg-zinc-900 text-sm text-white focus:ring-0">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent className="border-zinc-800 bg-zinc-900">
            <SelectItem
              value="all"
              className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
            >
              All Locations
            </SelectItem>
            {locations.map((l) => (
              <SelectItem
                key={l}
                value={l}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                title={l}
              >
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Architecture */}
        <Select
          value={selectedArchitecture}
          onValueChange={onSelectArchitecture}
        >
          <SelectTrigger className="border-zinc-800 bg-zinc-900 text-sm text-white focus:ring-0">
            <SelectValue placeholder="All Styles" />
          </SelectTrigger>
          <SelectContent className="border-zinc-800 bg-zinc-900">
            <SelectItem
              value="all"
              className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
            >
              All Styles
            </SelectItem>
            {architectures.map((a) => (
              <SelectItem
                key={a}
                value={a}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                title={a}
              >
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period + Clear */}
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={onSelectPeriod}>
            <SelectTrigger className="flex-1 border-zinc-800 bg-zinc-900 text-sm text-white focus:ring-0">
              <SelectValue placeholder="All Periods" />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-900">
              <SelectItem
                value="all"
                className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
              >
                All Periods
              </SelectItem>
              {periods.map((p) => (
                <SelectItem
                  key={p}
                  value={p}
                  className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                >
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
