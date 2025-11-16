"use client";

import { useState, useEffect } from "react";
import { getPopular, getTopRated, getAiringToday, getOnTheAir, getTVGenres, getTrending } from "@/lib/tmdb/api";
import { Navigation } from "@/components/ui/navigation";
import { ContentCarousel } from "@/components/carousels/ContentCarousel";
import { ContinueWatchingSection } from "@/components/sections/ContinueWatchingSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface SeriesData {
  trending: any[];
  popular: any[];
  topRated: any[];
  airingToday: any[];
  onTheAir: any[];
  genres: any[];
}

export default function SeriesPage() {
  const [data, setData] = useState<SeriesData>({
    trending: [],
    popular: [],
    topRated: [],
    airingToday: [],
    onTheAir: [],
    genres: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeriesData() {
      try {
        setLoading(true);
        const [trending, popular, topRated, airingToday, onTheAir, genres] = await Promise.all([
          getTrending("tv", "week"),
          getPopular("tv"),
          getTopRated("tv"),
          getAiringToday(),
          getOnTheAir(),
          getTVGenres(),
        ]);

        setData({
          trending: trending.results,
          popular: popular.results,
          topRated: topRated.results,
          airingToday: airingToday.results,
          onTheAir: onTheAir.results,
          genres: genres.genres,
        });
      } catch (error) {
        console.error("Error fetching series data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSeriesData();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black">
          <Navigation />
          <div className="pt-24 px-4 md:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-800 rounded w-48 mb-8"></div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-8 bg-gray-800 rounded w-64"></div>
                  <div className="flex space-x-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-64 h-36 bg-gray-800 rounded-lg flex-shrink-0"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <Navigation />

        {/* Hero Section */}
        {data.trending.length > 0 && (
          <HeroSection items={data.trending.slice(0, 5)} mediaType="tv" />
        )}

        <div className="relative z-10 -mt-32 pt-24 px-4 md:px-8 space-y-8 pb-16">
          <h1 className="text-4xl font-bold text-white mb-8">TV Shows</h1>

          {/* Continue Watching & Recommendations */}
          <ContinueWatchingSection mediaTypeFilter="tv" />

          {/* Airing Today */}
          {data.airingToday.length > 0 && (
            <ContentCarousel
              title="Airing Today"
              items={data.airingToday}
              mediaType="tv"
            />
          )}

          {/* Popular */}
          {data.popular.length > 0 && (
            <ContentCarousel
              title="Popular TV Shows"
              items={data.popular}
              mediaType="tv"
            />
          )}

          {/* Top Rated */}
          {data.topRated.length > 0 && (
            <ContentCarousel
              title="Top Rated"
              items={data.topRated}
              mediaType="tv"
            />
          )}

          {/* On The Air */}
          {data.onTheAir.length > 0 && (
            <ContentCarousel
              title="Currently On Air"
              items={data.onTheAir}
              mediaType="tv"
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

