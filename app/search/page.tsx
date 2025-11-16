"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search as SearchIcon, Film, Tv, TrendingUp, X } from "lucide-react";
import { searchMulti, getTrendingMovies, getTrendingTVShows } from "@/lib/tmdb/api";
import { TMDBMovie, TMDBTVShow } from "@/types";
import { Navigation } from "@/components/ui/navigation";
import { ContentCard } from "@/components/cards/ContentCard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Input } from "@/components/ui/input";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [allResults, setAllResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [trending, setTrending] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch trending content on mount
  useEffect(() => {
    async function fetchTrending() {
      try {
        const [movies, shows] = await Promise.all([
          getTrendingMovies("week"),
          getTrendingTVShows("week"),
        ]);
        setTrending([...movies.results.slice(0, 6), ...shows.results.slice(0, 6)]);
      } catch (error) {
        console.error("Error fetching trending:", error);
      }
    }
    fetchTrending();
  }, []);

  // Debounced search for all results
  useEffect(() => {
    if (!query.trim()) {
      setAllResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        setHasSearched(true);
        const response = await searchMulti(query);
        const filtered = response.results.filter(
          (item: any) => item.media_type === "movie" || item.media_type === "tv"
        );
        setAllResults(filtered);
      } catch (error) {
        console.error("Search error:", error);
        setAllResults([]);
      } finally {
        setLoading(false);
      }
    }, 2000); // Full search after 2 seconds of no typing

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <Navigation />
        
        <div className="pt-24 px-4 md:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Search Header */}
            <div className="text-center space-y-4">
              <motion.h1 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold text-white"
              >
                Search
              </motion.h1>
              <p className="text-xl text-gray-400">Discover your next favorite movie or TV show</p>
            </div>

            {/* Search Input with Quick Results */}
            <div className="relative max-w-3xl mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 z-10" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies, TV shows..."
                  className="pl-14 pr-12 py-7 text-xl font-medium tracking-wide bg-gray-900/80 border-gray-800 text-white placeholder-gray-400 focus:border-red-600 rounded-2xl backdrop-blur-sm"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setHasSearched(false);
                      setAllResults([]);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Loading State - Skeleton */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!loading && hasSearched && allResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Found {allResults.length} {allResults.length === 1 ? 'result' : 'results'} for "{query}"
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {allResults.map((item: any) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContentCard
                        content={item}
                        mediaType={item.media_type as "movie" | "tv"}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {!loading && hasSearched && allResults.length === 0 && query && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try searching with different keywords</p>
              </motion.div>
            )}

            {/* Trending Section (shown when no search) */}
            {!hasSearched && trending.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                  <h2 className="text-3xl font-bold text-white">Trending Now</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {trending.map((item: any, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <ContentCard
                        content={item}
                        mediaType={item.media_type as "movie" | "tv"}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="pt-24 px-4 md:px-8 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="h-12 w-48 bg-gray-800 rounded mx-auto animate-pulse"></div>
              <div className="h-6 w-64 bg-gray-800 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="h-14 bg-gray-800 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
