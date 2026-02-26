"use client";

import {
  ArrowRight,
  MapPin,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendationStore } from "@/store/recommendation.store";

interface RecommendationSectionProps {
  heading?: string;
  type?: "personalized" | "trending";
}

const RecommendationSection = ({
  heading = "Recommended for You",
  type = "personalized",
}: RecommendationSectionProps) => {
  const {
    personalized,
    trending,
    loading,
    error,
    getPersonalized,
    getTrending,
  } = useRecommendationStore();

  const recommendations = type === "personalized" ? personalized : trending;
  const fetchRecommendations =
    type === "personalized" ? getPersonalized : getTrending;
  const isTrending = type === "trending";

  useEffect(() => {
    fetchRecommendations();
  }, [type, fetchRecommendations]);

  /* ── Loading ── */
  if (loading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-lg bg-zinc-800" />
          <Skeleton className="h-5 w-48 bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <Skeleton className="h-80 rounded-2xl bg-zinc-900" />
          <Skeleton className="h-80 rounded-2xl bg-zinc-900" />
          <Skeleton className="h-80 rounded-2xl bg-zinc-900" />
        </div>
      </section>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <section className="space-y-5">
        <SectionLabel heading={heading} isTrending={isTrending} />
        <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <p className="text-sm font-medium text-red-400">
            Failed to load recommendations
          </p>
          <Button
            onClick={() => fetchRecommendations()}
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      </section>
    );
  }

  /* ── Empty ── */
  if (!recommendations || recommendations.length === 0) {
    return (
      <section className="space-y-5">
        <SectionLabel heading={heading} isTrending={isTrending} />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/6 bg-white/2 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            {isTrending ? (
              <TrendingUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <Sparkles className="h-5 w-5 text-zinc-500" />
            )}
          </div>
          <p className="text-sm text-zinc-500">
            {type === "personalized"
              ? "Complete your profile to get personalised picks."
              : "No trending spots right now."}
          </p>
          {type === "personalized" && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-zinc-700 text-zinc-400 hover:text-white"
            >
              <Link href="/home/profile">Update Profile</Link>
            </Button>
          )}
        </div>
      </section>
    );
  }

  const [featured, ...rest] = recommendations.slice(0, 4);

  return (
    <section className="space-y-5">
      <SectionLabel heading={heading} isTrending={isTrending} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2.2fr_1fr_1fr]">
        {/* ── Featured card (large) ── */}
        <div className="group relative h-80 overflow-hidden rounded-2xl border border-white/6 lg:h-auto lg:min-h-85">
          {featured.picture || featured.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featured.picture || featured.imageUrl}
              alt={featured.placeName || featured.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-900" />
          )}
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              {isTrending ? "🔥 Trending" : "⭐ Top Pick"}
            </span>
            {featured.matchScore && (
              <span className="rounded-full border border-violet-400/30 bg-violet-500/20 px-2.5 py-1 text-[10px] font-bold text-violet-300 backdrop-blur-sm">
                {Math.round(featured.matchScore * 100)}% match
              </span>
            )}
          </div>

          {/* Content */}
          <div className="absolute right-0 bottom-0 left-0 p-6">
            <div className="mb-2 flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-zinc-400" />
              <span className="text-xs text-zinc-400">
                {featured.country || featured.location || "India"}
              </span>
            </div>
            <h3 className="text-2xl leading-tight font-black text-white">
              {featured.placeName || featured.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-300/80">
              {featured.description}
            </p>
            <button className="group/btn mt-4 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/20">
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ── Side cards ── */}
        {rest.map((rec, index) => (
          <SmallCard
            key={rec.id || index}
            rec={rec}
            index={index + 1}
            isTrending={isTrending}
          />
        ))}
      </div>
    </section>
  );
};

/* ── Sub-components ── */

const SectionLabel = ({
  heading,
  isTrending,
}: {
  heading: string;
  isTrending: boolean;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
          isTrending
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-violet-500/30 bg-violet-500/10"
        }`}
      >
        {isTrending ? (
          <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
        ) : (
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        )}
      </div>
      <h2 className="text-base font-bold tracking-tight text-white">
        {heading}
      </h2>
    </div>
    <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-all hover:bg-white/5 hover:text-white">
      View all <ArrowRight className="h-3.5 w-3.5" />
    </button>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SmallCard = ({
  rec,
  index,
  isTrending,
}: {
  rec: any;
  index: number;
  isTrending: boolean;
}) => (
  <div className="group relative h-80 overflow-hidden rounded-2xl border border-white/6 lg:h-auto">
    {rec.picture || rec.imageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={rec.picture || rec.imageUrl}
        alt={rec.placeName || rec.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    ) : (
      <div className="absolute inset-0 bg-zinc-900" />
    )}
    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/10" />

    {/* Rank / match */}
    <div className="absolute top-3 left-3">
      {isTrending ? (
        <span className="rounded-full border border-amber-500/30 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-sm">
          #{index + 1}
        </span>
      ) : rec.matchScore ? (
        <span className="rounded-full border border-violet-400/30 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-violet-300 backdrop-blur-sm">
          {Math.round(rec.matchScore * 100)}%
        </span>
      ) : null}
    </div>

    {/* Content */}
    <div className="absolute right-0 bottom-0 left-0 p-4">
      <div className="mb-1.5 flex items-center gap-1">
        <MapPin className="h-2.5 w-2.5 text-zinc-400" />
        <span className="truncate text-[10px] text-zinc-400">
          {rec.country || rec.location || "India"}
        </span>
      </div>
      <h3 className="line-clamp-2 text-sm leading-tight font-bold text-white">
        {rec.placeName || rec.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-400">
        {rec.description}
      </p>
    </div>
  </div>
);

export default RecommendationSection;
