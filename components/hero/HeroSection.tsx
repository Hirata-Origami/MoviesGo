"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { TMDBMovie, TMDBTVShow } from "@/types";
import { getImageUrl } from "@/lib/tmdb/config";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
  items: (TMDBMovie | TMDBTVShow)[];
  mediaType: "movie" | "tv";
}

export function HeroSection({ items, mediaType }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 8000); // Change every 8 seconds

      return () => clearInterval(interval);
    }
  }, [items.length]);

  if (!currentItem) return null;

  const title = "title" in currentItem ? currentItem.title : currentItem.name;
  const backdropUrl = getImageUrl(currentItem.backdrop_path, "backdrop", "original");

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-2xl space-y-4 md:space-y-6"
              >
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl"
                >
                  {title}
                </motion.h1>

                {/* Meta Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="flex items-center space-x-4 text-sm md:text-base"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-semibold">{currentItem.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-300">
                    {"release_date" in currentItem
                      ? new Date(currentItem.release_date).getFullYear()
                      : new Date(currentItem.first_air_date).getFullYear()}
                  </span>
                  <span className="px-2 py-1 bg-gray-800/80 rounded text-xs text-gray-200 backdrop-blur-sm">
                    {mediaType === "movie" ? "Movie" : "TV Series"}
                  </span>
                </motion.div>

                {/* Overview */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-sm md:text-lg text-gray-200 line-clamp-3 drop-shadow-lg max-w-xl"
                >
                  {currentItem.overview}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <Link href={`/${mediaType}/${currentItem.id}/watch`}>
                    <Button size="lg" className="bg-white hover:bg-gray-200 text-black font-semibold">
                      <Play className="h-5 w-5 mr-2 fill-current" />
                      Play Now
                    </Button>
                  </Link>

                  <Link href={`/${mediaType}/${currentItem.id}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-gray-800/80 hover:bg-gray-700/80 border-gray-600 text-white backdrop-blur-sm"
                    >
                      <Info className="h-5 w-5 mr-2" />
                      More Info
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>


          {/* Pagination Dots */}
          {items.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2"
            >
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-red-600" : "w-1 bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

