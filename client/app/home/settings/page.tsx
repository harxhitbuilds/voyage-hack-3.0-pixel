"use client";

import {
  Bell,
  ChevronRight,
  CreditCard,
  Database,
  Download,
  Eye,
  Globe,
  Languages,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Palette,
  Plane,
  Settings,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  Upload,
  User,
  Volume2,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

/* ── Types ─────────────────────────────────────────────────────── */
interface LocalSettings {
  profileVisibility: string;
  showEmail: boolean;
  showLocation: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  travelAlerts: boolean;
  weeklyDigest: boolean;
  soundEffects: boolean;
  dataCollection: boolean;
  locationTracking: boolean;
  theme: string;
  language: string;
  currency: string;
  autoSync: boolean;
}

type BooleanSettingKey = {
  [K in keyof LocalSettings]: LocalSettings[K] extends boolean ? K : never;
}[keyof LocalSettings];

/* ── Sidebar categories ────────────────────────────────────────── */
const CATEGORIES = [
  { icon: User, label: "Account", id: "account" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Shield, label: "Privacy", id: "privacy" },
  { icon: Palette, label: "Appearance", id: "appearance" },
  { icon: Database, label: "Data", id: "data" },
  { icon: Settings, label: "Actions", id: "actions" },
] as const;

/* ── Helpers ───────────────────────────────────────────────────── */
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
        <div className="divide-y divide-zinc-800/40">{children}</div>
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  title,
  description,
  danger = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-zinc-900/40">
      <div className="flex items-center gap-3 overflow-hidden">
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            danger ? "text-red-400" : "text-zinc-500",
          )}
        />
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-medium",
              danger ? "text-red-400" : "text-zinc-200",
            )}
          >
            {title}
          </p>
          <p className="truncate text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SETTINGS PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { user, logout, updateUserProfile, isLoading } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("account");

  /* ── Editable profile fields ── */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [hometown, setHometown] = useState("");
  const [profileDirty, setProfileDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ── Local-only settings (not persisted to backend) ── */
  const [settings, setSettings] = useState<LocalSettings>({
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    emailNotifications: true,
    pushNotifications: true,
    travelAlerts: true,
    weeklyDigest: true,
    soundEffects: true,
    dataCollection: true,
    locationTracking: false,
    theme: "dark",
    language: "english",
    currency: "inr",
    autoSync: true,
  });

  /* ── Seed form from user data ── */
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
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
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
  const toggle = (key: BooleanSettingKey) => {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
    toast.success("Setting updated");
  };

  const selectChange = (key: keyof LocalSettings, val: string) => {
    setSettings((p) => ({ ...p, [key]: val }));
    toast.success("Setting updated");
  };

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

  const handleLogout = async () => {
    await logout();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:px-6">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your account, preferences, and privacy.
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
          {/* ── Account ── */}
          <SectionCard id="account" icon={User} title="Account">
            <div className="space-y-4 px-5 py-4">
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
                    className="h-10 rounded-lg border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0"
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
                    className="h-10 rounded-lg border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0"
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
                    className="h-10 rounded-lg border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0"
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
                    className="h-10 rounded-lg border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0"
                  />
                </div>
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
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              )}
            </div>

            <Row
              icon={Eye}
              title="Profile visibility"
              description="Control who can see your profile"
            >
              <Select
                value={settings.profileVisibility}
                onValueChange={(v) => selectChange("profileVisibility", v)}
              >
                <SelectTrigger className="h-8 w-28 rounded-lg border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row
              icon={Mail}
              title="Show email"
              description="Display email on your profile"
            >
              <Switch
                checked={settings.showEmail}
                onCheckedChange={() => toggle("showEmail")}
              />
            </Row>
            <Row
              icon={MapPin}
              title="Show location"
              description="Display hometown on profile"
            >
              <Switch
                checked={settings.showLocation}
                onCheckedChange={() => toggle("showLocation")}
              />
            </Row>
          </SectionCard>

          {/* ── Notifications ── */}
          <SectionCard id="notifications" icon={Bell} title="Notifications">
            <Row
              icon={Mail}
              title="Email notifications"
              description="Receive notifications via email"
            >
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => toggle("emailNotifications")}
              />
            </Row>
            <Row
              icon={Smartphone}
              title="Push notifications"
              description="Receive push notifications on device"
            >
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => toggle("pushNotifications")}
              />
            </Row>
            <Row
              icon={Plane}
              title="Travel alerts"
              description="Get notified about travel updates"
            >
              <Switch
                checked={settings.travelAlerts}
                onCheckedChange={() => toggle("travelAlerts")}
              />
            </Row>
            <Row
              icon={Volume2}
              title="Weekly digest"
              description="Receive weekly summary emails"
            >
              <Switch
                checked={settings.weeklyDigest}
                onCheckedChange={() => toggle("weeklyDigest")}
              />
            </Row>
            <Row
              icon={Volume2}
              title="Sound effects"
              description="Play sounds for interactions"
            >
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={() => toggle("soundEffects")}
              />
            </Row>
          </SectionCard>

          {/* ── Privacy ── */}
          <SectionCard id="privacy" icon={Shield} title="Privacy & Security">
            <Row
              icon={Database}
              title="Data collection"
              description="Allow collection for better experience"
            >
              <Switch
                checked={settings.dataCollection}
                onCheckedChange={() => toggle("dataCollection")}
              />
            </Row>
            <Row
              icon={MapPin}
              title="Location tracking"
              description="Track for personalised recommendations"
            >
              <Switch
                checked={settings.locationTracking}
                onCheckedChange={() => toggle("locationTracking")}
              />
            </Row>
            <Row
              icon={Lock}
              title="Change password"
              description="Update your account password"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-zinc-800 bg-transparent text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Change
              </Button>
            </Row>
          </SectionCard>

          {/* ── Appearance ── */}
          <SectionCard id="appearance" icon={Palette} title="Appearance">
            <Row
              icon={settings.theme === "dark" ? Moon : Sun}
              title="Theme"
              description="Choose your preferred theme"
            >
              <Select
                value={settings.theme}
                onValueChange={(v) => selectChange("theme", v)}
              >
                <SelectTrigger className="h-8 w-24 rounded-lg border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900">
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">System</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row
              icon={Languages}
              title="Language"
              description="Select preferred language"
            >
              <Select
                value={settings.language}
                onValueChange={(v) => selectChange("language", v)}
              >
                <SelectTrigger className="h-8 w-28 rounded-lg border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row
              icon={CreditCard}
              title="Currency"
              description="Default currency for pricing"
            >
              <Select
                value={settings.currency}
                onValueChange={(v) => selectChange("currency", v)}
              >
                <SelectTrigger className="h-8 w-20 rounded-lg border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900">
                  <SelectItem value="inr">INR</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row
              icon={Wifi}
              title="Auto sync"
              description="Sync data across devices"
            >
              <Switch
                checked={settings.autoSync}
                onCheckedChange={() => toggle("autoSync")}
              />
            </Row>
          </SectionCard>

          {/* ── Data ── */}
          <SectionCard id="data" icon={Database} title="Data Management">
            <Row
              icon={Download}
              title="Export data"
              description="Download a copy of your data"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success("Export initiated. Check your email shortly.")
                }
                className="h-8 rounded-lg border-zinc-800 bg-transparent text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Export
              </Button>
            </Row>
            <Row
              icon={Upload}
              title="Import data"
              description="Import from another account"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-zinc-800 bg-transparent text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Import
              </Button>
            </Row>
          </SectionCard>

          {/* ── Account Actions ── */}
          <SectionCard id="actions" icon={Settings} title="Account Actions">
            <Row
              icon={LogOut}
              title="Logout"
              description="Sign out of your account"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8 rounded-lg border-zinc-800 bg-transparent text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Logout
              </Button>
            </Row>
            <Row
              icon={Trash2}
              title="Delete account"
              description="Permanently delete your account and data"
              danger
            >
              <Button
                variant="destructive"
                size="sm"
                onClick={() => toast.error("Account deletion coming soon")}
                className="h-8 rounded-lg text-xs"
              >
                Delete
              </Button>
            </Row>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
