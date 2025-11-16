"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Play, Plus, Check, Star } from "lucide-react";
import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb/api";
import { getImageUrl } from "@/lib/tmdb/config";
import { Navigation } from "@/components/ui/navigation";
import { ContentCarousel } from "@/components/carousels/ContentCarousel";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRuntime, getYearFromDate } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useState, useEffect } from "react";

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { addItem, removeItem, checkInWatchlist } = useWatchlist();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [movie, setMovie] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovieData() {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(parseInt(id));
        const [similarData] = await Promise.all([
          getSimilarMovies(parseInt(id)),
        ]);

        setMovie(movieData);
        setSimilar(similarData.results);

        // Find trailer video
        if (movieData.videos?.results) {
          const trailer = movieData.videos.results.find(
            (video: any) => video.type === "Trailer" && video.site === "YouTube"
          );
          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&loop=1&playlist=${trailer.key}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`);
          }
        }

        // Check watchlist status
        const isInWatchlist = await checkInWatchlist(parseInt(id), "movie");
        setInWatchlist(isInWatchlist);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadMovieData();
    }
  }, [id]);


  const handleWatchlistToggle = async () => {
    if (!movie) return;
    
    try {
      if (inWatchlist) {
        await removeItem(movie.id, "movie");
        setInWatchlist(false);
      } else {
        await addItem(
          movie.id,
          "movie",
          movie.title,
          movie.poster_path,
          movie.backdrop_path,
          movie.overview,
          movie.vote_average
        );
        setInWatchlist(true);
      }
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black">
          <Navigation />
          <div className="pt-24 px-4 md:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              {/* Hero Skeleton */}
              <div className="relative h-[60vh] md:h-[70vh] bg-gray-900 rounded-lg animate-pulse mb-8"></div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Poster Skeleton */}
                <div className="w-48 md:w-64 aspect-[2/3] bg-gray-800 rounded-lg animate-pulse flex-shrink-0"></div>
                
                {/* Info Skeleton */}
                <div className="flex-1 space-y-6">
                  <div className="h-12 bg-gray-800 rounded animate-pulse w-3/4"></div>
                  <div className="h-6 bg-gray-800 rounded animate-pulse w-1/2"></div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 w-20 bg-gray-800 rounded animate-pulse"></div>
                    ))}
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

  if (!movie) {
    notFound();
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, "backdrop", "original");
  const posterUrl = getImageUrl(movie.poster_path, "poster", "large");

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <Navigation />

        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh]">
          {trailerUrl ? (
            <>
              <iframe
                src={trailerUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={`${movie.title} Trailer`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </>
          ) : (
            <>
              <Image
                src={backdropUrl}
                alt={movie.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative -mt-96 z-10 px-4 md:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="384px"
                    className="object-cover"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl text-gray-400 italic">"{movie.tagline}"</p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400">({movie.vote_count.toLocaleString()} votes)</span>
                  </div>
                  <span className="text-gray-300">{getYearFromDate(movie.release_date)}</span>
                  <span className="text-gray-300">{formatRuntime(movie.runtime)}</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: any) => (
                    <Badge key={genre.id} variant="outline" className="bg-gray-800 border-gray-700">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <Link href={`/movie/${movie.id}/watch`}>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                      <Play className="h-5 w-5 mr-2 fill-current" />
                      Watch Now
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-700"
                    onClick={handleWatchlistToggle}
                  >
                    {inWatchlist ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Remove from List
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Add to List
                      </>
                    )}
                  </Button>
                </div>

                {/* Overview */}
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3">Overview</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
                </div>

                {/* Cast */}
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-3">Cast</h2>
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                      {movie.credits.cast.slice(0, 10).map((person: any) => (
                        <Link key={person.id} href={`/person/${person.id}`}>
                          <div className="flex-shrink-0 text-center cursor-pointer hover:scale-105 transition-transform">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-2">
                              {person.profile_path && (
                                <Image
                                  src={getImageUrl(person.profile_path, "profile", "medium")}
                                  alt={person.name}
                                  fill
                                  sizes="96px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <p className="text-sm text-white font-medium w-24 truncate">{person.name}</p>
                            <p className="text-xs text-gray-400 w-24 truncate">{person.character}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className="text-white font-medium">{movie.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Release Date</p>
                    <p className="text-white font-medium">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Original Language</p>
                    <p className="text-white font-medium uppercase">{movie.original_language}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="mt-16">
              <ContentCarousel title="Similar Movies" items={similar} mediaType="movie" />
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
