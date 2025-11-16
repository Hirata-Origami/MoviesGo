"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Navigation } from "@/components/ui/navigation";
import { ContentCard } from "@/components/cards/ContentCard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyListPage() {
  const { watchlist, loading, refresh } = useWatchlist();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <Navigation />
        
        <div className="pt-24 px-4 md:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8">
              <Heart className="h-8 w-8 text-red-600 fill-current" />
              <h1 className="text-4xl font-bold text-white">My List</h1>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && watchlist.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Heart className="h-24 w-24 text-gray-700 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Your list is empty
                </h2>
                <p className="text-gray-400">
                  Add movies and TV shows to your list to watch them later
                </p>
              </motion.div>
            )}

            {/* Watchlist Grid */}
            {!loading && watchlist.length > 0 && (
              <div>
                <p className="text-gray-400 mb-4">
                  {watchlist.length} item{watchlist.length !== 1 ? "s" : ""} in your list
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {watchlist.map((item, index) => (
                    <motion.div
                      key={`${item.contentType}-${item.contentId}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ContentCard
                        content={{
                          id: item.contentId,
                          title: item.title,
                          name: item.title,
                          poster_path: item.posterPath,
                          backdrop_path: item.backdropPath,
                          overview: item.overview || "",
                          vote_average: item.rating || 0,
                          vote_count: 0,
                          popularity: 0,
                          genre_ids: [],
                          original_language: "en",
                          adult: false,
                          video: false,
                          release_date: "",
                          original_title: item.title,
                          first_air_date: "",
                          original_name: item.title,
                          origin_country: [],
                        } as any}
                        mediaType={item.contentType}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}

