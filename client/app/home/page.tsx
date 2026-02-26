"use client";
import Link from "next/link";

import { useEffect } from "react";

import HomeHeader from "@/components/home/header";
import RecommendationSection from "@/components/home/recommendation-section";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useRecommendationStore } from "@/store/recommendation.store";

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const { getPersonalized, getTrending } = useRecommendationStore();

  useEffect(() => {
    getPersonalized();
    getTrending();
  }, [getPersonalized, getTrending]);

  return (
    <main className="container mx-auto min-h-screen space-y-12 py-8 pb-20 md:px-6 lg:px-8">
      {isAuthenticated ? (
        <div className="space-y-10">
          <HomeHeader />

          <div className="space-y-16">
            <RecommendationSection
              heading="Recommended for You"
              type="personalized"
            />

            <RecommendationSection
              heading="Trending Destinations"
              type="trending"
            />
          </div>
        </div>
      ) : (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      )}
    </main>
  );
}
