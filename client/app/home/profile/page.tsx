"use client";

import {
  Accessibility,
  Award,
  BookOpen,
  Calendar,
  Camera,
  Car,
  ChevronRight,
  Clock,
  Edit3,
  Flame,
  Globe,
  Heart,
  Home,
  Languages,
  Lightbulb,
  Loader2,
  Lock,
  Mail,
  Map,
  MapPin,
  Mountain,
  Plane,
  Save,
  Settings,
  Shield,
  Star,
  Trophy,
  User as UserIcon,
  Users,
  Utensils,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthStore, User } from "@/store/auth.store";

/* ── Sidebar categories ────────────────────────────────────────── */
const CATEGORIES = [
  { icon: UserIcon, label: "Account", id: "account" },
  { icon: Plane, label: "Travel Prefs", id: "travel" },
  { icon: Lightbulb, label: "Interests", id: "interests" },
  { icon: Mountain, label: "Experience", id: "experience" },
  { icon: Shield, label: "Special Reqs", id: "requirements" },
  { icon: Award, label: "Heritage", id: "heritage" },
  { icon: Settings, label: "Completion", id: "completion" },
] as const;

/* ── Reusable section card (matches settings page) ─────────────── */
function SectionCard({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950">
        <div className="flex items-center gap-2.5 border-b border-zinc-800/60 px-5 py-4">
          <Icon className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

/* ── Tag badge (zinc-themed) ─────────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-700/60 bg-zinc-800/60 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
      {children}
    </span>
  );
}

/* ── Preference group row ────────────────────────────────────── */
function PrefGroup({
  icon: Icon,
  label,
  items,
}: {
  icon: React.ElementType;
  label: string;
  items: string[] | undefined;
}) {
  return (
    <div className="px-5 py-3.5">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-xs font-medium text-zinc-500">{label}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items && items.length > 0 ? (
          items.map((item, i) => <Tag key={i}>{item}</Tag>)
        ) : (
          <span className="text-xs text-zinc-600 italic">Not specified</span>
        )}
      </div>
    </div>
  );
}

/* ── Heritage score helpers ──────────────────────────────────── */
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
    color: "text-zinc-300",
    bgColor: "bg-zinc-800/80",
    borderColor: "border-zinc-600",
    icon: Zap,
    description: "Exploring India's heritage",
  },
  {
    name: "Historian",
    minScore: 300,
    color: "text-zinc-200",
    bgColor: "bg-zinc-800/60",
    borderColor: "border-zinc-500",
    icon: Shield,
    description: "Knowledgeable traveler",
  },
  {
    name: "Guardian",
    minScore: 600,
    color: "text-white",
    bgColor: "bg-zinc-800/50",
    borderColor: "border-zinc-400",
    icon: Flame,
    description: "Heritage enthusiast",
  },
  {
    name: "Legend",
    minScore: 1000,
    color: "text-white",
    bgColor: "bg-zinc-700/50",
    borderColor: "border-zinc-300",
    icon: Trophy,
    description: "Master of heritage",
  },
];

function getRank(score: number) {
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
    label: "Organized",
    icon: "📄",
    points: 25,
    description: "Exported a trip as PDF",
  },
];

/* ══════════════════════════════════════════════════════════════════
   PROFILE PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, getUserProfile, updateUserProfile, isLoading } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("account");

  /* ── Editable profile fields ── */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [hometown, setHometown] = useState("");
  const [profileDirty, setProfileDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ── Fetch profile on mount ── */
  useEffect(() => {
    if (!user) getUserProfile();
  }, []);

  /* ── Seed form from user ── */
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUsername(user.username || "");
      setHometown(user.hometown || "");
      setProfileDirty(false);
    }
  }, [user]);

  /* ── Intersection observer for sidebar highlight ── */
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveCategory(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    CATEGORIES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  /* ── Handlers ── */
  const markDirty = () => setProfileDirty(true);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ firstName, lastName, username, hometown });
      setProfileDirty(false);
    } catch {
      // toast handled by store
    } finally {
      setSaving(false);
    }
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ── Loading / error states ── */
  if (!user && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <span className="ml-2 text-sm text-zinc-400">Loading profile…</span>
      </div>
    );
  }

  if (!user && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md rounded-xl border border-zinc-800/60 bg-zinc-950 p-8 text-center">
          <UserIcon className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
          <p className="text-sm font-medium text-white">
            Unable to load profile
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Try refreshing or logging in again.
          </p>
        </div>
      </div>
    );
  }

  /* ── Heritage score values ── */
  const visitedCount =
    (user?.visitedMonuments as string[] | undefined)?.length ?? 0;
  const tripCount = user?.tripCount ?? 0;
  const heritageScore = visitedCount * 30 + tripCount * 50;
  const rankInfo = getRank(heritageScore);
  const RankIcon = rankInfo.icon;
  const progressPct = rankInfo.next
    ? Math.min(
        100,
        Math.round(
          ((heritageScore - rankInfo.minScore) /
            (rankInfo.next.minScore - rankInfo.minScore)) *
            100,
        ),
      )
    : 100;

  const unlockedIds = new Set<string>();
  if (visitedCount >= 1) {
    unlockedIds.add("first_3d");
    unlockedIds.add("first_ar");
  }
  if (visitedCount >= 5) unlockedIds.add("five_monuments");
  if (visitedCount >= 10) unlockedIds.add("ten_monuments");
  if (tripCount >= 1) unlockedIds.add("first_trip");

  /* ── Profile completion calc ── */
  const basicDone = !!(user?.firstName && user?.lastName && user?.email);
  const travelPrefPct = (() => {
    const prefs = user?.travelPreferences;
    if (!prefs) return 0;
    const fields = [
      "travelStyle",
      "budgetRange",
      "groupSize",
      "tripDuration",
      "travelFrequency",
      "accommodationType",
      "transportationPreference",
    ];
    const filled = fields.filter(
      (f) => Array.isArray((prefs as any)[f]) && (prefs as any)[f].length > 0,
    ).length;
    return Math.round((filled / fields.length) * 100);
  })();
  const overallPct = Math.round(
    (basicDone ? 40 : 0) + (travelPrefPct / 100) * 60,
  );

  const inputCls =
    "h-10 rounded-lg border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0";
  const textareaCls =
    "rounded-lg border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:px-6">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your account info, travel preferences, and achievements.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Sidebar ── */}
        <aside className="w-full shrink-0 lg:w-56">
          <nav className="sticky top-20 space-y-0.5 rounded-xl border border-zinc-800/60 bg-zinc-950 p-2">
            {CATEGORIES.map(({ icon: CatIcon, label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                  activeCategory === id
                    ? "bg-zinc-800/60 text-white"
                    : "text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300",
                )}
              >
                <CatIcon className="h-4 w-4 shrink-0" />
                {label}
                <ChevronRight
                  className={cn(
                    "ml-auto h-3.5 w-3.5 transition-opacity",
                    activeCategory === id ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* ═══ Account ═══ */}
          <SectionCard id="account" icon={UserIcon} title="Account">
            <div className="space-y-4 px-5 py-4">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
                    {user?.profile ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.profile as string}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-7 w-7 text-zinc-500" />
                    )}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {user?.name || "—"}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    @{user?.username || "not-set"} · {user?.email}
                  </p>
                </div>
              </div>

              {/* Editable fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">
                    First name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      markDirty();
                    }}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">
                    Last name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      markDirty();
                    }}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">
                    Username
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      markDirty();
                    }}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">
                    Hometown
                  </label>
                  <Input
                    value={hometown}
                    onChange={(e) => {
                      setHometown(e.target.value);
                      markDirty();
                    }}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">
                  Email
                </label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="h-10 rounded-lg border-zinc-800 bg-zinc-900/40 text-sm text-zinc-500"
                />
              </div>

              {profileDirty && (
                <div className="flex justify-end pt-1">
                  <Button
                    onClick={saveProfile}
                    disabled={saving || isLoading}
                    className="gap-1.5 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-40"
                    size="sm"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" /> Save changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 divide-x divide-zinc-800/40 border-t border-zinc-800/40">
              <div className="px-5 py-3 text-center">
                <p className="text-lg font-bold text-white">{tripCount}</p>
                <p className="text-xs text-zinc-500">Trips</p>
              </div>
              <div className="px-5 py-3 text-center">
                <p className="text-lg font-bold text-white">{visitedCount}</p>
                <p className="text-xs text-zinc-500">Monuments</p>
              </div>
              <div className="px-5 py-3 text-center">
                <p className="text-lg font-bold text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
                <p className="text-xs text-zinc-500">Joined</p>
              </div>
            </div>
          </SectionCard>

          {/* ═══ Travel Preferences ═══ */}
          <SectionCard id="travel" icon={Plane} title="Travel Preferences">
            <div className="grid grid-cols-1 divide-y divide-zinc-800/40 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="divide-y divide-zinc-800/40">
                <PrefGroup
                  icon={Users}
                  label="Travel Style"
                  items={user?.travelPreferences?.travelStyle}
                />
                <PrefGroup
                  icon={Wallet}
                  label="Budget Range"
                  items={user?.travelPreferences?.budgetRange}
                />
                <PrefGroup
                  icon={Users}
                  label="Group Size"
                  items={user?.travelPreferences?.groupSize}
                />
                <PrefGroup
                  icon={Calendar}
                  label="Trip Duration"
                  items={user?.travelPreferences?.tripDuration}
                />
              </div>
              <div className="divide-y divide-zinc-800/40">
                <PrefGroup
                  icon={Clock}
                  label="Travel Frequency"
                  items={user?.travelPreferences?.travelFrequency}
                />
                <PrefGroup
                  icon={Home}
                  label="Accommodation"
                  items={user?.travelPreferences?.accommodationType}
                />
                <PrefGroup
                  icon={Car}
                  label="Transportation"
                  items={user?.travelPreferences?.transportationPreference}
                />
              </div>
            </div>
          </SectionCard>

          {/* ═══ Interests ═══ */}
          <SectionCard
            id="interests"
            icon={Lightbulb}
            title="Interests & Activities"
          >
            <div className="grid grid-cols-1 divide-y divide-zinc-800/40 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="divide-y divide-zinc-800/40">
                <PrefGroup
                  icon={Star}
                  label="Activity Interests"
                  items={user?.interests?.activityInterests}
                />
                <PrefGroup
                  icon={Globe}
                  label="Cultural Interests"
                  items={user?.interests?.culturalInterests}
                />
              </div>
              <div className="divide-y divide-zinc-800/40">
                <PrefGroup
                  icon={Utensils}
                  label="Food Interests"
                  items={user?.interests?.foodInterests}
                />
              </div>
            </div>
          </SectionCard>

          {/* ═══ Experience & Background ═══ */}
          <SectionCard
            id="experience"
            icon={Mountain}
            title="Experience & Background"
          >
            <div className="space-y-0 divide-y divide-zinc-800/40">
              {/* Travel Experience */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Travel Experience
                  </span>
                </div>
                <Tag>
                  {user?.experience?.travelExperience || "Not specified"}
                </Tag>
              </div>
              {/* Countries Visited */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Countries Visited
                  </span>
                </div>
                <span className="text-sm font-medium text-white">
                  {user?.experience?.visitedCountries || "—"}
                </span>
              </div>
              {/* Languages */}
              <div className="px-5 py-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Languages className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Languages Spoken
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.experience?.languages?.length ?? 0) > 0 ? (
                    user!.experience.languages.map(
                      (lang: string, i: number) => <Tag key={i}>{lang}</Tag>,
                    )
                  ) : (
                    <span className="text-xs text-zinc-600 italic">
                      None specified
                    </span>
                  )}
                </div>
              </div>
              {/* Dream Destinations */}
              <div className="px-5 py-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Heart className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Dream Destinations
                  </span>
                </div>
                <p className="text-sm text-zinc-300">
                  {user?.experience?.dreamDestinations || "Not specified"}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* ═══ Special Requirements ═══ */}
          <SectionCard
            id="requirements"
            icon={Shield}
            title="Special Requirements"
          >
            <div className="space-y-0 divide-y divide-zinc-800/40">
              <div className="px-5 py-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Accessibility className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Accessibility Needs
                  </span>
                </div>
                <p className="text-sm text-zinc-300">
                  {user?.specialRequirements?.accessibility || "None specified"}
                </p>
              </div>
              <div className="px-5 py-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Utensils className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Dietary Restrictions
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.specialRequirements?.dietaryRestrictions?.length ??
                    0) > 0 ? (
                    user!.specialRequirements.dietaryRestrictions.map(
                      (r: string, i: number) => <Tag key={i}>{r}</Tag>,
                    )
                  ) : (
                    <span className="text-xs text-zinc-600 italic">
                      None specified
                    </span>
                  )}
                </div>
              </div>
              <div className="px-5 py-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Special Interests
                  </span>
                </div>
                <p className="text-sm text-zinc-300">
                  {user?.specialRequirements?.specialInterests ||
                    "None specified"}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* ═══ Heritage Score ═══ */}
          <SectionCard id="heritage" icon={Award} title="Heritage Score">
            <div className="space-y-5 px-5 py-5">
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
                      {heritageScore}
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      pts
                    </span>
                  </div>
                  <p className={cn("text-sm font-bold", rankInfo.color)}>
                    {rankInfo.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {rankInfo.description}
                  </p>
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
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-400 transition-all duration-1000"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-600">
                    {rankInfo.next.minScore - heritageScore} pts to{" "}
                    {rankInfo.next.name}
                  </p>
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
                  <p className="text-2xl font-black text-white">
                    {visitedCount}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Monuments Visited
                  </p>
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
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {ACHIEVEMENTS.map((ach) => {
                    const unlocked = unlockedIds.has(ach.id);
                    return (
                      <div
                        key={ach.id}
                        title={ach.description}
                        className={cn(
                          "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                          unlocked
                            ? "border-zinc-600 bg-zinc-800/60"
                            : "border-zinc-800 bg-zinc-900/40 opacity-40",
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
                            unlocked ? "text-zinc-300" : "text-zinc-600",
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
          </SectionCard>

          {/* ═══ Profile Completion ═══ */}
          <SectionCard
            id="completion"
            icon={Settings}
            title="Profile Completion"
          >
            <div className="space-y-4 px-5 py-5">
              {/* Basic Info */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Basic Info</span>
                {basicDone ? (
                  <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                    Complete
                  </span>
                ) : (
                  <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                    Incomplete
                  </span>
                )}
              </div>

              {/* Travel Preferences */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    Travel Preferences
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {travelPrefPct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-500 transition-all duration-500"
                    style={{ width: `${travelPrefPct}%` }}
                  />
                </div>
              </div>

              {/* Overall */}
              <div className="border-t border-zinc-800/40 pt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-300">
                    Overall Progress
                  </span>
                  <span className="text-sm font-bold text-white">
                    {overallPct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
