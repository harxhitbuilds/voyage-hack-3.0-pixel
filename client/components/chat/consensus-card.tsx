"use client";

import { CheckCircle, Sparkles, ThumbsUp, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Plan, Vote } from "@/store/chat.store";

interface ConsensusCardProps {
  plan: Plan;
  votes: Vote[];
  totalMembers: number;
  currentUserId?: string;
  onVote: () => void;
}

/**
 * ConsensusCard — A beautifully styled card that renders the AI-generated
 * consensus plan inside the chat feed. Features vote/accept interaction.
 */
export default function ConsensusCard({
  plan,
  votes,
  totalMembers,
  currentUserId,
  onVote,
}: ConsensusCardProps) {
  // Normalize IDs to strings for reliable comparison across users
  const normalizedUserId = currentUserId?.toString();
  const hasVoted = votes.some((v) => v.userId?.toString() === normalizedUserId);
  const voteCount = votes.length;
  const allVoted = voteCount === totalMembers;

  return (
    <div className="mx-auto w-full max-w-lg">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-black/40 backdrop-blur-xl",
          "border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]",
          "transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]",
        )}
      >
        {/* ── Gradient top accent ─────────────────────────────────────── */}
        <div className="h-0.5 w-full bg-linear-to-r from-transparent via-white/40 to-transparent" />

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-mono text-[11px] tracking-widest text-white/40 uppercase">
            Nimbus Consensus
          </span>
        </div>

        {/* ── Title ───────────────────────────────────────────────────── */}
        <div className="px-5 pb-3">
          <h3 className="text-xl leading-tight font-semibold tracking-tight text-white">
            {plan.title}
          </h3>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="mx-5 h-px bg-white/5" />

        {/* ── Summary ─────────────────────────────────────────────────── */}
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-white/60">
            {plan.summary}
          </p>
        </div>

        {/* ── Action Items ────────────────────────────────────────────── */}
        <div className="px-5 pb-4">
          <p className="mb-3 font-mono text-[10px] tracking-widest text-white/30 uppercase">
            Action Items
          </p>
          <ul className="space-y-2">
            {plan.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-[10px] text-white/40">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-white/70">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="mx-5 h-px bg-white/5" />

        {/* ── Footer: Vote bar ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Users className="h-3.5 w-3.5" />
            <span>
              {voteCount}/{totalMembers} accepted
            </span>
            {allVoted && (
              <span className="ml-1 flex items-center gap-1 text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Consensus!
              </span>
            )}
          </div>

          <button
            onClick={onVote}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300",
              hasVoted
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white",
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {hasVoted ? "Accepted" : "Accept"}
          </button>
        </div>

        {/* ── Vote avatars ────────────────────────────────────────────── */}
        {voteCount > 0 && (
          <div className="border-t border-white/5 px-5 py-3">
            <div className="flex items-center gap-1.5">
              {votes.map((v) => (
                <span
                  key={v.userId}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white/60"
                  title={v.userName}
                >
                  {v.userName.charAt(0).toUpperCase()}
                </span>
              ))}
              <span className="ml-2 text-[11px] text-white/30">
                {votes.map((v) => v.userName).join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
