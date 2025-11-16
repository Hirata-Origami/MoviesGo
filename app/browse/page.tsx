"use client";

import { useState, useEffect } from "react";
import { getTrending, getPopular, getTopRated, getUpcoming } from "@/lib/tmdb/api";
import { HeroSection } from "@/components/hero/HeroSection";
import { ContentCarousel } from "@/components/carousels/ContentCarousel";
import { ContinueWatchingSection } from "@/components/sections/ContinueWatchingSection";
import { Navigation } from "@/components/ui/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function BrowsePage() {
  const [data, setData] = useState<{
    trendingMovies: any[];
    popularMovies: any[];
    topRatedMovies: any[];
    upcomingMovies: any[];
    popularTV: any[];
  }>({
    trendingMovies: [],
    popularMovies: [],
    topRatedMovies: [],
    upcomingMovies: [],
    popularTV: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrowseData() {
      try {
        setLoading(true);
        const [trendingMovies, popularMovies, topRatedMovies, upcomingMovies, popularTV] = await Promise.all([
          getTrending("movie", "week"),
          getPopular("movie"),
          getTopRated("movie"),
          getUpcoming(),
          getPopular("tv"),
        ]);

        setData({
          trendingMovies: trendingMovies.results.slice(0, 5),
          popularMovies: popularMovies.results,
          topRatedMovies: topRatedMovies.results,
          upcomingMovies: upcomingMovies.results,
          popularTV: popularTV.results,
        });
      } catch (error) {
        console.error("Error fetching browse data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBrowseData();
  }, []);


  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black">
          <Navigation />
          <div className="pt-24 px-4 md:px-8">
            <div className="animate-pulse space-y-8">
              {/* Hero skeleton */}
              <div className="h-[70vh] bg-gray-800 rounded-lg"></div>
              {/* Content skeletons */}
              <div className="space-y-8">
                <div className="h-8 bg-gray-800 rounded w-48"></div>
                <div className="flex space-x-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-64 h-36 bg-gray-800 rounded-lg flex-shrink-0"></div>
                  ))}
                </div>
              </div>
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
        {data.trendingMovies.length > 0 && (
          <HeroSection items={data.trendingMovies} mediaType="movie" />
        )}

        {/* Content Sections */}
        <div className="relative z-10 -mt-32 space-y-8 pb-16">
          {/* Continue Watching */}
          <ContinueWatchingSection />

          {/* Popular Movies */}
          {data.popularMovies.length > 0 && (
            <ContentCarousel
              title="Popular Movies"
              items={data.popularMovies}
              mediaType="movie"
            />
          )}

          {/* Top Rated Movies */}
          {data.topRatedMovies.length > 0 && (
            <ContentCarousel
              title="Top Rated Movies"
              items={data.topRatedMovies}
              mediaType="movie"
            />
          )}

          {/* Upcoming Movies */}
          {data.upcomingMovies.length > 0 && (
            <ContentCarousel
              title="Coming Soon"
              items={data.upcomingMovies}
              mediaType="movie"
            />
          )}

          {/* Popular TV Shows */}
          {data.popularTV.length > 0 && (
            <ContentCarousel
              title="Popular TV Shows"
              items={data.popularTV}
              mediaType="tv"
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

