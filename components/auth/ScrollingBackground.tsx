"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getTrendingMovies, getTrendingTVShows } from "@/lib/tmdb/api";
import { getImageUrl } from "@/lib/tmdb/config";

export function ScrollingBackground() {
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [movies, shows] = await Promise.all([
          getTrendingMovies("week"),
          getTrendingTVShows("week"),
        ]);
        setContent([...movies.results.slice(0, 30), ...shows.results.slice(0, 30)]);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    }
    fetchContent();
  }, []);

  const column1 = content.filter((_, i) => i % 8 === 0);
  const column2 = content.filter((_, i) => i % 8 === 1);
  const column3 = content.filter((_, i) => i % 8 === 2);
  const column4 = content.filter((_, i) => i % 8 === 3);
  const column5 = content.filter((_, i) => i % 8 === 4);
  const column6 = content.filter((_, i) => i % 8 === 5);
  const column7 = content.filter((_, i) => i % 8 === 6);
  const column8 = content.filter((_, i) => i % 8 === 7);

  // Calculate proper animation distance based on content height
  // Each card is 450px + 8px gap = 458px per item
  const itemsPerColumn = column1.length * 6; // Repeat 6 times for smooth infinite scroll
  const itemHeight = 458; // 450px card + 8px gap
  const scrollDistance = itemsPerColumn * itemHeight;

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40">
      <div className="absolute flex gap-2" style={{ top: 0, bottom: 0 }}>
        {/* Column 1 - Scroll Down */}
        <motion.div
          animate={{ y: [0, -scrollDistance / 2] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column1, ...column1, ...column1, ...column1, ...column1, ...column1].map((item, i) => (
            <div key={`c1-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Column 2 - Scroll Up */}
        <motion.div
          animate={{ y: [-scrollDistance / 2, 0] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column2, ...column2, ...column2, ...column2, ...column2, ...column2].map((item, i) => (
            <div key={`c2-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Column 3 - Scroll Down */}
        <motion.div
          animate={{ y: [0, -scrollDistance / 2] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column3, ...column3, ...column3, ...column3, ...column3, ...column3].map((item, i) => (
            <div key={`c3-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Column 4 - Scroll Up */}
        <motion.div
          animate={{ y: [-scrollDistance / 2, 0] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column4, ...column4, ...column4, ...column4, ...column4, ...column4].map((item, i) => (
            <div key={`c4-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Column 5 - Scroll Down */}
        <motion.div
          animate={{ y: [0, -scrollDistance / 2] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column5, ...column5, ...column5, ...column5, ...column5, ...column5].map((item, i) => (
            <div key={`c5-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Column 6 - Scroll Up */}
        <motion.div
          animate={{ y: [-scrollDistance / 2, 0] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column6, ...column6, ...column6, ...column6, ...column6, ...column6].map((item, i) => (
            <div key={`c6-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Column 7 - Scroll Down */}
        <motion.div
          animate={{ y: [0, -scrollDistance / 2] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column7, ...column7, ...column7, ...column7, ...column7, ...column7].map((item, i) => (
            <div key={`c7-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Column 8 - Scroll Up */}
        <motion.div
          animate={{ y: [-scrollDistance / 2, 0] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex flex-col gap-2 w-[240px]"
        >
          {[...column8, ...column8, ...column8, ...column8, ...column8, ...column8].map((item, i) => (
            <div key={`c8-${i}`} className="relative w-full h-[450px] rounded-md overflow-hidden shadow-2xl flex-shrink-0">
              {item?.poster_path && (
                <Image
                  src={getImageUrl(item.poster_path, "poster", "large")}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

