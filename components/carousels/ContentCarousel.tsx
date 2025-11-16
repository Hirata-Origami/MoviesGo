"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TMDBMovie, TMDBTVShow } from "@/types";
import { ContentCard } from "@/components/cards/ContentCard";
import { Button } from "@/components/ui/button";

interface ContentCarouselProps {
  title: string;
  items: (TMDBMovie | TMDBTVShow)[];
  mediaType: "movie" | "tv";
}

export function ContentCarousel({ title, items, mediaType }: ContentCarouselProps) {
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
      <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-8">{title}</h2>

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
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex-shrink-0 w-40 sm:w-48 md:w-56"
            >
              <ContentCard content={item} mediaType={mediaType} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

