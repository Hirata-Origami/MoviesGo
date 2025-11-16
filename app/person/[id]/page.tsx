"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Calendar, MapPin, Star } from "lucide-react";
import { getPersonDetails } from "@/lib/tmdb/api";
import { getImageUrl } from "@/lib/tmdb/config";
import { Navigation } from "@/components/ui/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getYearFromDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

async function getPersonData(id: string) {
  try {
    const person = await getPersonDetails(parseInt(id));
    return person;
  } catch (error) {
    console.error('Error fetching person data:', error);
    return null;
  }
}

export default function PersonDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showAllTV, setShowAllTV] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    async function loadPerson() {
      const data = await getPersonData(id);
      if (!data) {
        notFound();
      }
      setPerson(data);
      setLoading(false);
    }
    loadPerson();
  }, [id]);

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black">
          <Navigation />
          <div className="pt-24 px-4 md:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image Skeleton */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-96 rounded-lg bg-gray-800 animate-pulse"></div>
                </div>
                
                {/* Info Skeleton */}
                <div className="flex-1 space-y-6">
                  <div className="h-12 w-64 bg-gray-800 rounded animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-gray-800 rounded-xl animate-pulse"></div>
                    <div className="h-24 bg-gray-800 rounded-xl animate-pulse"></div>
                    <div className="h-24 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!person) {
    notFound();
  }

  const profileUrl = person.profile_path ? getImageUrl(person.profile_path, "profile", "large") : null;

  // Get movie and TV credits
  const allMovieCredits = person.movie_credits?.cast || [];
  const allTVCredits = person.tv_credits?.cast || [];
  
  const movieCredits = showAllMovies ? allMovieCredits : allMovieCredits.slice(0, 8);
  const tvCredits = showAllTV ? allTVCredits : allTVCredits.slice(0, 8);
  
  // Truncate biography
  const truncatedBio = person.biography && person.biography.length > 400
    ? person.biography.slice(0, 400) + "..."
    : person.biography;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <Navigation />

        <div className="pt-24 px-4 md:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-96 rounded-lg overflow-hidden bg-gray-800 shadow-2xl">
                  {profileUrl ? (
                    <Image
                      src={profileUrl}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl text-gray-600">👤</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {person.name}
                  </h1>
                </div>

                {/* Biography */}
                {person.biography && (
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-3">Biography</h2>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {showFullBio ? person.biography : truncatedBio}
                    </p>
                    {person.biography.length > 400 && (
                      <Button
                        variant="link"
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="text-red-600 hover:text-red-700 mt-2 p-0"
                      >
                        {showFullBio ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </div>
                )}

                {/* Known For */}
                {person.known_for && person.known_for.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-3">Known For</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {person.known_for.map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                        >
                          <div className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors cursor-pointer">
                            <div className="relative aspect-[2/3]">
                              {item.poster_path && (
                                <Image
                                  src={getImageUrl(item.poster_path, "poster", "medium")}
                                  alt={item.title || item.name}
                                  fill
                                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-white text-sm line-clamp-2">
                                {item.title || item.name}
                              </h3>
                              <p className="text-gray-400 text-xs mt-1">
                                {getYearFromDate(item.release_date || item.first_air_date)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Movie Credits */}
                {allMovieCredits.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-semibold text-white">Movies ({allMovieCredits.length})</h2>
                      {allMovieCredits.length > 8 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAllMovies(!showAllMovies)}
                          className="border-gray-700"
                        >
                          {showAllMovies ? 'Show Less' : 'View All'}
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {movieCredits.map((movie: any, index: number) => (
                        <motion.div
                          key={movie.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Link href={`/movie/${movie.id}`}>
                            <div className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 hover:scale-105 transition-all cursor-pointer">
                              <div className="relative aspect-[2/3]">
                                {movie.poster_path && (
                                  <Image
                                    src={getImageUrl(movie.poster_path, "poster", "medium")}
                                    alt={movie.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="p-3">
                                <h3 className="font-semibold text-white text-sm line-clamp-2">
                                  {movie.title}
                                </h3>
                                {movie.character && (
                                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                                    as {movie.character}
                                  </p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">
                                  {movie.release_date && getYearFromDate(movie.release_date)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TV Credits */}
                {allTVCredits.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-semibold text-white">TV Shows ({allTVCredits.length})</h2>
                      {allTVCredits.length > 8 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAllTV(!showAllTV)}
                          className="border-gray-700"
                        >
                          {showAllTV ? 'Show Less' : 'View All'}
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {tvCredits.map((show: any, index: number) => (
                        <motion.div
                          key={show.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Link href={`/tv/${show.id}`}>
                            <div className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 hover:scale-105 transition-all cursor-pointer">
                              <div className="relative aspect-[2/3]">
                                {show.poster_path && (
                                  <Image
                                    src={getImageUrl(show.poster_path, "poster", "medium")}
                                    alt={show.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="p-3">
                                <h3 className="font-semibold text-white text-sm line-clamp-2">
                                  {show.name}
                                </h3>
                                {show.character && (
                                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                                    as {show.character}
                                  </p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">
                                  {show.first_air_date && getYearFromDate(show.first_air_date)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
