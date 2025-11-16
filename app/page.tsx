"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { getTrendingMovies, getTrendingTVShows } from "@/lib/tmdb/api";
import { getImageUrl } from "@/lib/tmdb/config";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trendingContent, setTrendingContent] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/browse");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const [movies, shows] = await Promise.all([
          getTrendingMovies("week"),
          getTrendingTVShows("week"),
        ]);
        const combined = [...movies.results.slice(0, 40), ...shows.results.slice(0, 40)];
        setTrendingContent(combined);
      } catch (error) {
        console.error("Error fetching trending:", error);
      }
    }
    fetchTrending();
  }, []);

  const handleGetStarted = () => {
    if (email) {
      router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/auth/signup");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="relative z-20 flex items-center justify-center px-8 py-5">
          <div className="h-10 w-48 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4 py-32 md:py-48">
          <div className="max-w-4xl w-full space-y-6">
            <div className="h-16 bg-gray-800 rounded animate-pulse mx-auto w-3/4"></div>
            <div className="h-8 bg-gray-800 rounded animate-pulse mx-auto w-1/2"></div>
            <div className="h-16 w-48 bg-gray-800 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const column1 = trendingContent.filter((_, i) => i % 4 === 0);
  const column2 = trendingContent.filter((_, i) => i % 4 === 1);
  const column3 = trendingContent.filter((_, i) => i % 4 === 2);
  const column4 = trendingContent.filter((_, i) => i % 4 === 3);

  // Calculate proper animation distance for infinite scroll
  // Each card is 450px + 8px gap = 458px per item
  const itemsPerColumn = column1.length * 6; // Repeat 6 times for smooth infinite scroll
  const itemHeight = 458;
  const scrollDistance = itemsPerColumn * itemHeight;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background with scrolling posters - Full screen coverage */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute flex gap-2"
          style={{
            transform: 'rotate(-12deg) translateY(-10%)',
            width: '150%',
            left: '-10%',
            top: '0',
            bottom: '0'
          }}
        >
          {[column1, column2, column3, column4, column1, column2, column3, column4, column1, column2].map((col, colIndex) => (
            <motion.div
              key={colIndex}
              animate={{ y: colIndex % 2 === 0 ? [0, -scrollDistance / 2] : [-scrollDistance / 2, 0] }}
              transition={{ duration: 180, repeat: Infinity, ease: "linear", repeatType: "loop" }}
              className="flex flex-col gap-2 flex-shrink-0"
              style={{ width: '220px' }}
            >
              {[...col, ...col, ...col, ...col, ...col, ...col].map((item, i) => (
                <div 
                  key={`col${colIndex}-${i}`} 
                  className="relative rounded-lg overflow-hidden shadow-2xl flex-shrink-0"
                  style={{ width: '220px', height: '450px' }}
                >
                  {item?.poster_path && (
                    <Image 
                      src={getImageUrl(item.poster_path, "poster", "large")} 
                      alt="" 
                      fill 
                      className="object-cover" 
                      sizes="220px" 
                      priority={colIndex < 3 && i < 4}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-center px-8 py-5">
        <h1 className="text-red-600 text-4xl font-black tracking-tight">MOVIESGO</h1>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-32 md:py-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Unlimited movies, TV shows and more
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white">
            Watch anywhere.
          </p>

          {/* CTA Button - Centered */}
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className="h-16 px-12 bg-red-600 hover:bg-red-700 text-white font-bold text-2xl rounded-md flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-2xl"
            >
              Get Started
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
