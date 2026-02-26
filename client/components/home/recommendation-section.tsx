"use client";

import {
  ArrowRight,
  MapPin,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
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

  useEffect(() => {
    fetchRecommendations();
  }, [type, fetchRecommendations]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50"
            >
              <Skeleton className="h-48 w-full rounded-none bg-zinc-800" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                <Skeleton className="h-3 w-1/2 bg-zinc-800" />
                <Skeleton className="h-3 w-full bg-zinc-800" />
                <Skeleton className="h-8 w-full rounded-lg bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <span className="text-xl">⚠️</span>
          </div>
          <p className="text-sm font-medium text-red-400">
            Unable to load {type} recommendations
          </p>
          <p className="text-xs text-zinc-500">{error}</p>
          <Button
            onClick={() => fetchRecommendations()}
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      );
    }

    if (!loading && (!recommendations || recommendations.length === 0)) {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800">
            <Sparkles className="h-5 w-5 text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-400">
            {type === "personalized"
              ? "We need more info to personalize recommendations."
              : "No trending trips available right now."}
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
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.slice(0, 4).map((rec, index) => (
          <div
            key={rec.id || index}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-black/30"
          >
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden">
              {rec.picture || rec.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rec.picture || rec.imageUrl}
                  alt={rec.placeName || rec.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                  <MapPin className="h-8 w-8 text-zinc-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {rec.matchScore && (
                <div className="absolute top-3 right-3">
                  <Badge className="border-0 bg-white/10 text-xs text-white backdrop-blur-sm">
                    {Math.round(rec.matchScore * 100)}% match
                  </Badge>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="leading-tight font-semibold text-white">
                {rec.placeName || rec.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500">
                <MapPin className="h-3 w-3" />
                {rec.country || rec.location || "India"}
              </div>
              <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-400">
                {rec.description}
              </p>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-700 hover:text-white">
                Explore
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const Icon = type === "trending" ? TrendingUp : Sparkles;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <Icon className="h-4 w-4 text-zinc-400" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            {heading}
          </h2>
        </div>
        <button className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-white">
          See all
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      {renderContent()}
    </section>
  );
};

export default RecommendationSection;
