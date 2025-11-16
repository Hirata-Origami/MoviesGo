"use client";

import { useState, useEffect } from "react";
import { ContentCarousel } from "@/components/carousels/ContentCarousel";
import { getMovieRecommendations, getTVShowRecommendations } from "@/lib/tmdb/api";
import { WatchHistory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendedSectionProps {
  watchedItem: WatchHistory;
  title: string;
}

export function RecommendedSection({ watchedItem, title }: RecommendedSectionProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [watchedItem]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      let response;
      if (watchedItem.contentType === "movie") {
        response = await getMovieRecommendations(watchedItem.contentId);
      } else if (watchedItem.contentType === "tv") {
        response = await getTVShowRecommendations(watchedItem.contentId);
      } else {
        setRecommendations([]);
        return;
      }

      // Get first 10 recommendations and remove duplicates
      const uniqueRecommendations = response.results
        .slice(0, 10)
        .filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );

      setRecommendations(uniqueRecommendations);
    } catch (error) {
      console.error(`Failed to get recommendations for ${watchedItem.title}:`, error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 md:px-8">
        <Skeleton className="h-8 w-64 mb-4 bg-gray-800" />
        <div className="flex space-x-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-64 h-36 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <ContentCarousel
      title={title}
      items={recommendations}
      mediaType={watchedItem.contentType}
    />
  );
}
