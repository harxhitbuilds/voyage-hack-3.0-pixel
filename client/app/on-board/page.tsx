"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

/* ── Step config ─────────────────────────────────────────────── */
const STEPS = [
  { id: "personal", title: "About you" },
  { id: "preferences", title: "Travel style" },
  { id: "details", title: "Trip details" },
] as const;

/* ── Chip component ──────────────────────────────────────────── */
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-150 select-none",
        selected
          ? "border-white bg-white text-zinc-950"
          : "border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
      )}
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
      {label}
    </button>
  );
}

/* ── Grid chip ───────────────────────────────────────────────── */
function GridChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3 text-[13px] font-medium transition-all duration-150 select-none",
        selected
          ? "border-white bg-white text-zinc-950"
          : "border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
      )}
    >
      <span>{label}</span>
      {selected && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
    </button>
  );
}

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-[13px] font-medium text-zinc-500">{title}</legend>
      {children}
    </fieldset>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, onBoardUser, isLoading } = useAuthStore();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      hometown: user?.hometown || "",
      travelStyle: [] as string[],
      budgetRange: [] as string[],
      groupSize: [] as string[],
      tripDuration: [] as string[],
      travelFrequency: [] as string[],
      accommodationType: [] as string[],
      transportationPreference: [] as string[],
    },
  });

  const fd = watch();

  // Redirect if already onboarded
  useEffect(() => {
    if (user?.onBoarded) router.push("/home");
  }, [user, router]);

  // Pre-fill form when user data arrives after redirect
  useEffect(() => {
    if (user) {
      if (user.firstName) setValue("firstName", user.firstName);
      if (user.lastName) setValue("lastName", user.lastName);
      if (user.username) setValue("username", user.username);
      if (user.hometown) setValue("hometown", user.hometown);
    }
  }, [user, setValue]);

  /* ── Navigation ── */
  const next = async () => {
    if (step === 0) {
      const ok = await trigger([
        "firstName",
        "lastName",
        "username",
        "hometown",
      ]);
      if (!ok) return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const back = () => step > 0 && setStep((s) => s - 1);

  const onSubmit = async (data: any) => {
    try {
      await onBoardUser(data);
      router.push("/home");
    } catch (err) {
      console.error("Onboarding error:", err);
    }
  };

  /* ── Toggle helper ── */
  const toggle = (field: string, value: string) => {
    const cur: string[] = (fd as any)[field] || [];
    setValue(
      field as any,
      cur.includes(value)
        ? cur.filter((v: string) => v !== value)
        : [...cur, value],
    );
  };

  /* ── Step 0 real-time validation ── */
  const step0Valid =
    fd.firstName.trim().length > 0 &&
    fd.lastName.trim().length > 0 &&
    fd.username.trim().length >= 3 &&
    /^[a-zA-Z0-9_]+$/.test(fd.username.trim()) &&
    fd.hometown.trim().length > 0;

  const canProceed = step === 0 ? step0Valid : true;

  /* ── Progress ── */
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 py-10 font-sans antialiased selection:bg-white/20 sm:px-6">
      {/* Subtle top glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(255,255,255,0.04),transparent)]" />

      <div className="relative w-full max-w-xl">
        {/* ── Progress bar ── */}
        <div className="mb-8">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-[13px] text-zinc-500">
              Step {step + 1} of {STEPS.length}
            </p>
            <p className="text-[13px] font-medium text-zinc-400">
              {STEPS[step].title}
            </p>
          </div>
          <div className="h-0.75 w-full overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── Card ── */}
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {step === 0 && "Tell us about yourself"}
              {step === 1 && "How do you like to travel?"}
              {step === 2 && "Your typical trip looks like\u2026"}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              {step === 0 &&
                "We\u2019ll use this to personalise your Nimbus experience."}
              {step === 1 &&
                "Pick everything that applies \u2014 you can always change later."}
              {step === 2 &&
                "This helps us suggest better itineraries for you."}
            </p>
          </div>

          {/* ── Step 0: Personal ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-zinc-500">
                    First name
                  </label>
                  <Input
                    placeholder="John"
                    autoFocus
                    {...register("firstName", { required: "Required" })}
                    className={cn(
                      "h-11 rounded-xl border-zinc-800 bg-zinc-900/60 px-3.5 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0",
                      errors.firstName && "border-red-500/40",
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-400">
                      {errors.firstName.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-zinc-500">
                    Last name
                  </label>
                  <Input
                    placeholder="Doe"
                    {...register("lastName", { required: "Required" })}
                    className={cn(
                      "h-11 rounded-xl border-zinc-800 bg-zinc-900/60 px-3.5 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0",
                      errors.lastName && "border-red-500/40",
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-400">
                      {errors.lastName.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-500">
                  Username
                </label>
                <Input
                  placeholder="johndoe"
                  {...register("username", {
                    required: "Required",
                    minLength: { value: 3, message: "Min 3 characters" },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Letters, numbers & underscores only",
                    },
                  })}
                  className={cn(
                    "h-11 rounded-xl border-zinc-800 bg-zinc-900/60 px-3.5 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0",
                    errors.username && "border-red-500/40",
                  )}
                />
                {errors.username && (
                  <p className="text-xs text-red-400">
                    {errors.username.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-500">
                  Hometown
                </label>
                <Input
                  placeholder="e.g. Mumbai, India"
                  {...register("hometown", { required: "Required" })}
                  className={cn(
                    "h-11 rounded-xl border-zinc-800 bg-zinc-900/60 px-3.5 text-sm text-white placeholder:text-zinc-600 focus-visible:border-zinc-600 focus-visible:ring-0",
                    errors.hometown && "border-red-500/40",
                  )}
                />
                {errors.hometown && (
                  <p className="text-xs text-red-400">
                    {errors.hometown.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 1: Travel Style ── */}
          {step === 1 && (
            <div className="space-y-7">
              <Section title="Travel style">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Solo",
                    "Couple",
                    "Family",
                    "Group",
                    "Business",
                    "Luxury",
                    "Budget",
                    "Backpacking",
                  ].map((o) => (
                    <Chip
                      key={o}
                      label={o}
                      selected={fd.travelStyle?.includes(o)}
                      onClick={() => toggle("travelStyle", o)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Budget range">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["Budget", "Moderate", "Luxury", "Ultra Luxury"].map((o) => (
                    <GridChip
                      key={o}
                      label={o}
                      selected={fd.budgetRange?.includes(o)}
                      onClick={() => toggle("budgetRange", o)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Usually travel with">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Solo",
                    "Partner",
                    "Family",
                    "Friends",
                    "Colleagues",
                    "Tour Group",
                  ].map((o) => (
                    <Chip
                      key={o}
                      label={o}
                      selected={fd.groupSize?.includes(o)}
                      onClick={() => toggle("groupSize", o)}
                    />
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* ── Step 2: Trip Details ── */}
          {step === 2 && (
            <div className="space-y-7">
              <Section title="Trip duration">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "Weekend (2-3 days)",
                    "Short (4-7 days)",
                    "Medium (1-2 weeks)",
                    "Long (2+ weeks)",
                  ].map((o) => (
                    <GridChip
                      key={o}
                      label={o}
                      selected={fd.tripDuration?.includes(o)}
                      onClick={() => toggle("tripDuration", o)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Travel frequency">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Monthly",
                    "Quarterly",
                    "Bi-annually",
                    "Yearly",
                    "Rarely",
                  ].map((o) => (
                    <Chip
                      key={o}
                      label={o}
                      selected={fd.travelFrequency?.includes(o)}
                      onClick={() => toggle("travelFrequency", o)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Accommodation">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Hotel",
                    "Hostel",
                    "Resort",
                    "Airbnb / Rental",
                    "Camping",
                    "Homestay",
                  ].map((o) => (
                    <Chip
                      key={o}
                      label={o}
                      selected={fd.accommodationType?.includes(o)}
                      onClick={() => toggle("accommodationType", o)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Transportation">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Flight",
                    "Train",
                    "Bus",
                    "Car Rental",
                    "Public Transit",
                    "Walking",
                  ].map((o) => (
                    <Chip
                      key={o}
                      label={o}
                      selected={fd.transportationPreference?.includes(o)}
                      onClick={() => toggle("transportationPreference", o)}
                    />
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 0}
              className="gap-1.5 rounded-lg px-4 text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              type="button"
              onClick={next}
              disabled={!canProceed || isLoading}
              className="gap-1.5 rounded-lg bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-40"
            >
              {step === STEPS.length - 1 ? (
                isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Complete setup"
                )
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ── Step dots ── */}
        <div className="mt-6 flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step
                  ? "w-6 bg-white"
                  : i < step
                    ? "w-1.5 bg-zinc-500"
                    : "w-1.5 bg-zinc-800",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
