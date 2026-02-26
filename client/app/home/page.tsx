"use client";

import { useEffect } from "react";

import HomeHeader from "@/components/home/header";
import RecommendationSection from "@/components/home/recommendation-section";
import { useRecommendationStore } from "@/store/recommendation.store";

export default function Home() {
  const { getPersonalized, getTrending } = useRecommendationStore();

  useEffect(() => {
    getPersonalized();
    getTrending();
  }, [getPersonalized, getTrending]);

  return (
    <main className="min-h-screen space-y-16 py-8 pb-24">
      <HomeHeader />

      <div className="space-y-16 px-1">
        <RecommendationSection
          heading="Recommended for You"
          type="personalized"
        />
        <RecommendationSection
          heading="Trending Destinations"
          type="trending"
        />
      </div>
    </main>
  );
}
