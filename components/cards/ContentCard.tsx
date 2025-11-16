"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Plus, Check, Info } from "lucide-react";
import { TMDBMovie, TMDBTVShow } from "@/types";
import { getImageUrl } from "@/lib/tmdb/config";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Button } from "@/components/ui/button";

interface ContentCardProps {
  content: TMDBMovie | TMDBTVShow;
  mediaType: "movie" | "tv";
  priority?: boolean;
}

export function ContentCard({ content, mediaType, priority = false }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const { addItem, removeItem, checkInWatchlist } = useWatchlist();

  const title = "title" in content ? content.title : content.name;
  const releaseDate = "release_date" in content ? content.release_date : content.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";

  const posterUrl = getImageUrl(content.poster_path, "poster", "medium");
  const backdropUrl = getImageUrl(content.backdrop_path, "backdrop", "medium");

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (inWatchlist) {
        await removeItem(content.id, mediaType);
        setInWatchlist(false);
      } else {
        await addItem(
          content.id,
          mediaType,
          title,
          content.poster_path,
          content.backdrop_path,
          content.overview,
          content.vote_average
        );
        setInWatchlist(true);
      }
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
    }
  };

  // Check if content is in watchlist on mount
  useState(() => {
    checkInWatchlist(content.id, mediaType).then(setInWatchlist);
  });

  return (
    <Link href={`/${mediaType}/${content.id}`} prefetch={false}>
      <motion.div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover"
            priority={priority}
          />

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              <h3 className="font-semibold text-white text-sm line-clamp-2">{title}</h3>
              
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <span>{year}</span>
                <span>•</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {content.vote_average.toFixed(1)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  className="bg-white hover:bg-gray-200 text-black flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/${mediaType}/${content.id}/watch`;
                  }}
                >
                  <Play className="h-4 w-4 mr-1 fill-current" />
                  Play
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gray-800/80 hover:bg-gray-700 border-gray-600"
                  onClick={handleWatchlistToggle}
                >
                  {inWatchlist ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gray-800/80 hover:bg-gray-700 border-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Let the Link handle navigation
                  }}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

