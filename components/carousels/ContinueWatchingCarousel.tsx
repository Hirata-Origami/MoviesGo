"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { WatchHistory } from "@/types";
import { getImageUrl } from "@/lib/tmdb/config";
import { Button } from "@/components/ui/button";

interface ContinueWatchingCarouselProps {
  items: WatchHistory[];
}

export function ContinueWatchingCarousel({ items }: ContinueWatchingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/carousel py-4">
      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-8">Continue Watching</h2>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 z-20 flex items-center"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("left")}
                className="h-full rounded-none bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 z-20 flex items-center"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("right")}
                className="h-full rounded-none bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 md:px-8 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <Link
              key={`${item.contentId}-${item.season}-${item.episode}`}
              href={
                item.contentType === "tv" && item.season && item.episode
                  ? `/${item.contentType}/${item.contentId}/watch?season=${item.season}&episode=${item.episode}`
                  : `/${item.contentType}/${item.contentId}/watch`
              }
            >
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex-shrink-0 w-64 sm:w-80 md:w-96 group cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={getImageUrl(item.posterPath, "backdrop", "medium")}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 40vw"
                    className="object-cover"
                  />

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Button size="lg" className="bg-white hover:bg-gray-200 text-black">
                        <Play className="h-5 w-5 mr-2 fill-current" />
                        Resume
                      </Button>
                      <p className="text-sm text-gray-300">{Math.round(item.progress)}% watched</p>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="font-semibold text-white line-clamp-1">{item.title}</h3>
                  {item.contentType === "tv" && item.season && item.episode && (
                    <p className="text-sm text-gray-400">
                      S{item.season} E{item.episode}
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

