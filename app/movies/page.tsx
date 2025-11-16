"use client";

import { useState, useEffect } from "react";
import { getPopular, getTopRated, getUpcoming, getNowPlaying, getMovieGenres, getTrending } from "@/lib/tmdb/api";
import { Navigation } from "@/components/ui/navigation";
import { ContentCarousel } from "@/components/carousels/ContentCarousel";
import { ContinueWatchingSection } from "@/components/sections/ContinueWatchingSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface MoviesData {
  trending: any[];
  popular: any[];
  topRated: any[];
  upcoming: any[];
  nowPlaying: any[];
  genres: any[];
}

export default function MoviesPage() {
  const [data, setData] = useState<MoviesData>({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    nowPlaying: [],
    genres: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMoviesData() {
      try {
        setLoading(true);
        const [trending, popular, topRated, upcoming, nowPlaying, genres] = await Promise.all([
          getTrending("movie", "week"),
          getPopular("movie"),
          getTopRated("movie"),
          getUpcoming(),
          getNowPlaying(),
          getMovieGenres(),
        ]);

        setData({
          trending: trending.results,
          popular: popular.results,
          topRated: topRated.results,
          upcoming: upcoming.results,
          nowPlaying: nowPlaying.results,
          genres: genres.genres,
        });
      } catch (error) {
        console.error("Error fetching movies data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMoviesData();
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
          <HeroSection items={data.trending.slice(0, 5)} mediaType="movie" />
        )}

        <div className="relative z-10 -mt-32 pt-24 px-4 md:px-8 space-y-8 pb-16">
          <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>

          {/* Continue Watching & Recommendations */}
          <ContinueWatchingSection mediaTypeFilter="movie" />

          {/* Now Playing */}
          {data.nowPlaying.length > 0 && (
            <ContentCarousel
              title="Now Playing in Theaters"
              items={data.nowPlaying}
              mediaType="movie"
            />
          )}

          {/* Popular */}
          {data.popular.length > 0 && (
            <ContentCarousel
              title="Popular Movies"
              items={data.popular}
              mediaType="movie"
            />
          )}

          {/* Top Rated */}
          {data.topRated.length > 0 && (
            <ContentCarousel
              title="Top Rated"
              items={data.topRated}
              mediaType="movie"
            />
          )}

          {/* Upcoming */}
          {data.upcoming.length > 0 && (
            <ContentCarousel
              title="Coming Soon"
              items={data.upcoming}
              mediaType="movie"
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

