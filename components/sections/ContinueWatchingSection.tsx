"use client";

import { ContinueWatchingCarousel } from "@/components/carousels/ContinueWatchingCarousel";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { RecommendedSection } from "@/components/sections/RecommendedSection";
import { Skeleton } from "@/components/ui/skeleton";

interface ContinueWatchingSectionProps {
  mediaTypeFilter?: "movie" | "tv" | "all";
}

export function ContinueWatchingSection({ mediaTypeFilter = "all" }: ContinueWatchingSectionProps = {}) {
  const { continueWatching, loading, history } = useWatchHistory();

  // Don't render anything if not loading and no items
  if (!loading && continueWatching.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="px-4 md:px-8">
        <Skeleton className="h-8 w-48 mb-4 bg-gray-800" />
        <div className="flex space-x-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-64 h-36 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Filter out items without proper data and by media type
  const validItems = continueWatching.filter(item => {
    const hasValidData = item.title &&
      item.title !== "movie" &&
      item.title !== "tv" &&
      item.posterPath;

    // Filter by media type if specified
    if (mediaTypeFilter === "movie") return hasValidData && item.contentType === "movie";
    if (mediaTypeFilter === "tv") return hasValidData && item.contentType === "tv";
    return hasValidData; // "all" shows everything
  });

  // Get completed items for recommendations (progress >= 95%)
  const completedItems = history.filter(item => {
    const isCompleted = item.progress >= 95 &&
      item.title &&
      item.title !== "movie" &&
      item.title !== "tv";

    // Filter by media type if specified
    if (mediaTypeFilter === "movie") return isCompleted && item.contentType === "movie";
    if (mediaTypeFilter === "tv") return isCompleted && item.contentType === "tv";
    return isCompleted; // "all" shows everything
  }).slice(0, 3); // Limit to 3 most recent completed items

  return (
    <div className="space-y-8">
      {/* Continue Watching */}
      {validItems.length > 0 && <ContinueWatchingCarousel items={validItems} />}

      {/* Individual "Since You Watched" sections */}
      {completedItems.map((item, index) => (
        <RecommendedSection
          key={`${item.contentId}-${item.contentType}`}
          watchedItem={item}
          title={`Since You Watched ${item.title}`}
        />
      ))}
    </div>
  );
}
