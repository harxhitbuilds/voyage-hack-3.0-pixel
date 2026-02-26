"use client";

import { Check, ChevronRight, Sparkles, Map, Compass, Plane } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

type Option = {
  id: string;
  label: string;
  icon?: string;
  description?: string;
};

const STEPS = [
  {
    id: "personal",
    title: "Personal Info",
    description: "Tell us about yourself",
    icon: Sparkles,
  },
  {
    id: "preferences",
    title: "Travel Style",
    description: "How do you like to travel?",
    icon: Compass,
  },
  {
    id: "details",
    title: "Trip Details",
    description: "Your typical trip details",
    icon: Map,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, onBoardUser, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
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

  const formData = watch();

  useEffect(() => {
    if (user?.onBoarded) {
      router.push("/home");
    }
  }, [user, router]);

  const onSubmit = async (data: any) => {
    try {
      await onBoardUser(data);
      router.push("/home");
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleSelection = (field: string, value: string) => {
    const currentValues = (formData as any)[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setValue(field as any, newValues);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-500">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="firstName" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={cn(
                    "bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 h-12 px-4 rounded-xl transition-all",
                    errors.firstName ? "border-red-500/50 focus-visible:ring-red-500/20" : ""
                  )}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="lastName" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={cn(
                    "bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 h-12 px-4 rounded-xl transition-all",
                    errors.lastName ? "border-red-500/50 focus-visible:ring-red-500/20" : ""
                  )}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="username" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Username</Label>
              <Input
                id="username"
                placeholder="@johndoe"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Only letters, numbers and underscores allowed",
                  },
                })}
                className={cn(
                  "bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 h-12 px-4 rounded-xl transition-all",
                  errors.username ? "border-red-500/50 focus-visible:ring-red-500/20" : ""
                )}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.username.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="hometown" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Hometown</Label>
              <Input
                id="hometown"
                placeholder="e.g. New York, USA"
                {...register("hometown", { required: "Hometown is required" })}
                className={cn(
                  "bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 h-12 px-4 rounded-xl transition-all",
                  errors.hometown ? "border-red-500/50 focus-visible:ring-red-500/20" : ""
                )}
              />
              {errors.hometown && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.hometown.message as string}
                </p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">How do you prefer to travel?</Label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Solo",
                  "Couple",
                  "Family",
                  "Group",
                  "Business",
                  "Luxury",
                  "Budget",
                  "Backpacking",
                ].map((option) => {
                  const isSelected = formData.travelStyle?.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => toggleSelection("travelStyle", option)}
                      className={cn(
                        "cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        isSelected
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50",
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">What's your typical budget range?</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {["Budget", "Moderate", "Luxury", "Ultra Luxury"].map(
                  (option) => {
                    const isSelected = formData.budgetRange?.includes(option);
                    return (
                      <div
                        key={option}
                        onClick={() => toggleSelection("budgetRange", option)}
                        className={cn(
                          "cursor-pointer rounded-xl border p-4 text-center text-sm font-medium transition-all duration-200",
                          isSelected
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50",
                        )}
                      >
                        {option}
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Who do you usually travel with?</Label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Solo",
                  "Partner",
                  "Family",
                  "Friends",
                  "Colleagues",
                  "Tour Group",
                ].map((option) => {
                  const isSelected = formData.groupSize?.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => toggleSelection("groupSize", option)}
                      className={cn(
                        "cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        isSelected
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50",
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">How long are your trips usually?</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Weekend (2-3 days)",
                  "Short (4-7 days)",
                  "Medium (1-2 weeks)",
                  "Long (2+ weeks)",
                ].map((option) => {
                  const isSelected = formData.tripDuration?.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => toggleSelection("tripDuration", option)}
                      className={cn(
                        "cursor-pointer rounded-xl border p-4 text-sm font-medium transition-all duration-200 flex items-center justify-between",
                        isSelected
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50",
                      )}
                    >
                      {option}
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">How often do you travel?</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  "Monthly",
                  "Quarterly",
                  "Bi-annually",
                  "Yearly",
                  "Rarely",
                ].map((option) => {
                  const isSelected = formData.travelFrequency?.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => toggleSelection("travelFrequency", option)}
                      className={cn(
                        "cursor-pointer rounded-xl border p-4 text-center text-sm font-medium transition-all duration-200",
                        isSelected
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50",
                      )}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Preferred Accommodation?</Label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Hotel",
                  "Hostel",
                  "Resort",
                  "Airbnb/Rental",
                  "Camping",
                  "Homestay",
                ].map((option) => {
                  const isSelected = formData.accommodationType?.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => toggleSelection("accommodationType", option)}
                      className={cn(
                        "cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        isSelected
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50",
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Preferred Transportation?</Label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Flight",
                  "Train",
                  "Bus",
                  "Car Rental",
                  "Public Transit",
                  "Walking",
                ].map((option) => {
                  const isSelected = formData.transportationPreference?.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() =>
                        toggleSelection("transportationPreference", option)
                      }
                      className={cn(
                        "cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        isSelected
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50",
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-white/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />
      
      <Card className="w-full max-w-3xl bg-zinc-950/50 border-zinc-800/50 shadow-2xl backdrop-blur-xl relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <CardHeader className="text-center pb-8 pt-10 px-8">
          <div className="mx-auto w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome to Nimbus
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base">
            Let's personalize your experience. Step {currentStep + 1} of {STEPS.length}
          </CardDescription>
        </CardHeader>

        <div className="px-8 pb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-800 -z-10 -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-white -z-10 -translate-y-1/2 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
            
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-3 bg-zinc-950 px-2">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                      isActive 
                        ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-110" 
                        : isCompleted
                          ? "bg-zinc-800 border-zinc-700 text-white"
                          : "bg-zinc-950 border-zinc-800 text-zinc-500"
                    )}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                    isActive ? "text-white" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <CardContent className="px-8 min-h-[400px]">
          {renderStepContent()}
        </CardContent>

        <CardFooter className="flex justify-between p-8 border-t border-zinc-800/50 bg-zinc-950/30">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0 || isLoading}
            className="w-28 h-12 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
          >
            Back
          </Button>

          <Button
            onClick={nextStep}
            disabled={isLoading}
            className="w-32 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] font-semibold gap-2"
          >
            {currentStep === STEPS.length - 1 ? (
              isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Saving
                </div>
              ) : (
                "Complete"
              )
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}