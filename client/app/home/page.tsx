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
    <main className="mx-auto w-full space-y-8 px-8 py-10 pb-24 md:px-8">
      <HomeHeader />
      <div className="space-y-8">
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
