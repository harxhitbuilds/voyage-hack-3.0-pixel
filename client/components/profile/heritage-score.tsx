"use client";

import { Award, Flame, Lock, Shield, Star, Trophy, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import type { User } from "@/store/auth.store";

interface HeritageScoreProps {
  user: User | null;
}

interface Rank {
  name: string;
  minScore: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  description: string;
}

const RANKS: Rank[] = [
  {
    name: "Explorer",
    minScore: 0,
    color: "text-zinc-400",
    bgColor: "bg-zinc-800",
    borderColor: "border-zinc-700",
    icon: Star,
    description: "Just getting started",
  },
  {
    name: "Wanderer",
    minScore: 100,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Zap,
    description: "Exploring India's heritage",
  },
  {
    name: "Historian",
    minScore: 300,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: Shield,
    description: "Knowledgeable traveler",
  },
  {
    name: "Guardian",
    minScore: 600,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Flame,
    description: "Heritage enthusiast",
  },
  {
    name: "Legend",
    minScore: 1000,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    icon: Trophy,
    description: "Master of heritage",
  },
];

function getRank(score: number): Rank & { next: Rank | null } {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (score >= rank.minScore) current = rank;
  }
  const idx = RANKS.indexOf(current);
  const next = idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
  return { ...current, next };
}

const ACHIEVEMENTS = [
  {
    id: "first_3d",
    label: "First 3D View",
    icon: "🏛️",
    points: 50,
    description: "Viewed your first 3D monument",
  },
  {
    id: "first_vr",
    label: "VR Pioneer",
    icon: "🥽",
    points: 100,
    description: "Entered your first VR experience",
  },
  {
    id: "first_ar",
    label: "AR Trailblazer",
    icon: "📱",
    points: 75,
    description: "Explored your first AR monument",
  },
  {
    id: "five_monuments",
    label: "Curious Traveler",
    icon: "🗺️",
    points: 150,
    description: "Visited 5 monuments",
  },
  {
    id: "ten_monuments",
    label: "Heritage Hunter",
    icon: "🔍",
    points: 300,
    description: "Visited 10 monuments",
  },
  {
    id: "first_trip",
    label: "Trip Planner",
    icon: "✈️",
    points: 50,
    description: "Created your first AI trip",
  },
  {
    id: "pdf_export",
    label: "Organized Explorer",
    icon: "📄",
    points: 25,
    description: "Exported a trip as PDF",
  },
];

const HeritageScore = ({ user }: HeritageScoreProps) => {
  if (!user) return null;

  // Calculate score from user data
  const visitedCount =
    (user.visitedMonuments as string[] | undefined)?.length ?? 0;
  const tripCount = user.tripCount ?? 0;
  const score = visitedCount * 30 + tripCount * 50;

  const rankInfo = getRank(score);
  const RankIcon = rankInfo.icon;

  // Progress to next rank
  const progressPct = rankInfo.next
    ? Math.min(
        100,
        Math.round(
          ((score - rankInfo.minScore) /
            (rankInfo.next.minScore - rankInfo.minScore)) *
            100,
        ),
      )
    : 100;

  // Unlocked achievements (simulated from data)
  const unlockedIds = new Set<string>();
  if (visitedCount >= 1) unlockedIds.add("first_3d");
  if (visitedCount >= 1) unlockedIds.add("first_ar");
  if (visitedCount >= 5) unlockedIds.add("five_monuments");
  if (visitedCount >= 10) unlockedIds.add("ten_monuments");
  if (tripCount >= 1) unlockedIds.add("first_trip");

  return (
    <div className="bg-card border-border overflow-hidden rounded-xl border">
      {/* Header */}
      <div className="border-border border-b p-6">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Award className="h-5 w-5 text-amber-500" />
          Heritage Score
        </h3>
      </div>

      <div className="space-y-6 p-6">
        {/* Score + Rank hero */}
        <div
          className={cn(
            "flex items-center gap-4 rounded-xl border p-4",
            rankInfo.bgColor,
            rankInfo.borderColor,
          )}
        >
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border",
              rankInfo.bgColor,
              rankInfo.borderColor,
            )}
          >
            <RankIcon className={cn("h-7 w-7", rankInfo.color)} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className={cn("text-3xl font-black", rankInfo.color)}>
                {score}
              </span>
              <span className="text-xs font-medium text-zinc-500">pts</span>
            </div>
            <p className={cn("text-sm font-bold", rankInfo.color)}>
              {rankInfo.name}
            </p>
            <p className="text-xs text-zinc-500">{rankInfo.description}</p>
          </div>
        </div>

        {/* Progress to next rank */}
        {rankInfo.next && (
          <div>
            <div className="mb-2 flex justify-between text-xs text-zinc-500">
              <span>
                Progress to{" "}
                <span className="font-semibold text-zinc-300">
                  {rankInfo.next.name}
                </span>
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  rankInfo.color.replace("text-", "bg-"),
                )}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-600">
              {rankInfo.next.minScore - score} pts to {rankInfo.next.name}
            </p>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <p className="text-2xl font-black text-white">{visitedCount}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Monuments Visited</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <p className="text-2xl font-black text-white">{tripCount}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Trips Planned</p>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Achievements
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = unlockedIds.has(ach.id);
              return (
                <div
                  key={ach.id}
                  title={ach.description}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                    unlocked
                      ? "border-amber-500/30 bg-amber-500/10"
                      : "border-zinc-800 bg-zinc-900/40 opacity-50",
                  )}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <p
                    className={cn(
                      "text-xs leading-tight font-semibold",
                      unlocked ? "text-zinc-200" : "text-zinc-500",
                    )}
                  >
                    {ach.label}
                  </p>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      unlocked ? "text-amber-400" : "text-zinc-600",
                    )}
                  >
                    +{ach.points}pts
                  </span>
                  {!unlocked && (
                    <Lock className="absolute top-2 right-2 h-3 w-3 text-zinc-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageScore;
