"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Play, Plus, Check, Star } from "lucide-react";
import { getTVShowDetails, getSimilarTVShows } from "@/lib/tmdb/api";
import { getImageUrl } from "@/lib/tmdb/config";
import { Navigation } from "@/components/ui/navigation";
import { ContentCarousel } from "@/components/carousels/ContentCarousel";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getYearFromDate } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useState, useEffect } from "react";

export default function TVShowDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { addItem, removeItem, checkInWatchlist } = useWatchlist();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [tvShow, setTVShow] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadTVShowData() {
      try {
        setLoading(true);
        const tvShowData = await getTVShowDetails(parseInt(id));
        const [similarData] = await Promise.all([
          getSimilarTVShows(parseInt(id)),
        ]);

        setTVShow(tvShowData);
        setSimilar(similarData.results);

        // Find trailer video
        if (tvShowData.videos?.results) {
          const trailer = tvShowData.videos.results.find(
            (video: any) => video.type === "Trailer" && video.site === "YouTube"
          );
          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&loop=1&playlist=${trailer.key}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`);
          }
        }

        // Check watchlist status
        const isInWatchlist = await checkInWatchlist(parseInt(id), "tv");
        setInWatchlist(isInWatchlist);
      } catch (error) {
        console.error('Error fetching TV show data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTVShowData();
    }
  }, [id]);


  const handleWatchlistToggle = async () => {
    if (!tvShow) return;
    
    try {
      if (inWatchlist) {
        await removeItem(tvShow.id, "tv");
        setInWatchlist(false);
      } else {
        await addItem(
          tvShow.id,
          "tv",
          tvShow.name,
          tvShow.poster_path,
          tvShow.backdrop_path,
          tvShow.overview,
          tvShow.vote_average
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

  if (!tvShow) {
    notFound();
  }

  const backdropUrl = getImageUrl(tvShow.backdrop_path, "backdrop", "original");
  const posterUrl = getImageUrl(tvShow.poster_path, "poster", "large");
  const firstSeason = tvShow.seasons?.find((s: any) => s.season_number === 1) || tvShow.seasons?.[0];

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
                title={`${tvShow.name} Trailer`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </>
          ) : (
            <>
              <Image
                src={backdropUrl}
                alt={tvShow.name}
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
                    alt={tvShow.name}
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
                    {tvShow.name}
                  </h1>
                  {tvShow.tagline && (
                    <p className="text-xl text-gray-400 italic">"{tvShow.tagline}"</p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400">({tvShow.vote_count.toLocaleString()} votes)</span>
                  </div>
                  <span className="text-gray-300">{getYearFromDate(tvShow.first_air_date)}</span>
                  <span className="text-gray-300">{tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? "s" : ""}</span>
                  <span className="text-gray-300">{tvShow.number_of_episodes} Episodes</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map((genre: any) => (
                    <Badge key={genre.id} variant="outline" className="bg-gray-800 border-gray-700">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <Link href={`/tv/${tvShow.id}/watch?season=${firstSeason?.season_number || 1}&episode=1`}>
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
                  <p className="text-gray-300 text-lg leading-relaxed">{tvShow.overview}</p>
                </div>

                {/* Cast */}
                {tvShow.credits?.cast && tvShow.credits.cast.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-3">Cast</h2>
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                      {tvShow.credits.cast.slice(0, 10).map((person: any) => (
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

                {/* Seasons */}
                {tvShow.seasons && tvShow.seasons.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-3">Seasons</h2>
                    <div className="space-y-4">
                      {tvShow.seasons.map((season: any) => (
                        <div key={season.id} className="flex gap-4 bg-gray-900/50 rounded-lg p-4">
                          {season.poster_path && (
                            <div className="relative w-20 aspect-[2/3] rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={getImageUrl(season.poster_path, "poster", "small")}
                                alt={season.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">{season.name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{season.episode_count} Episodes</p>
                            {season.overview && (
                              <p className="text-sm text-gray-300 line-clamp-2">{season.overview}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className="text-white font-medium">{tvShow.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">First Air Date</p>
                    <p className="text-white font-medium">
                      {new Date(tvShow.first_air_date).toLocaleDateString()}
                    </p>
                  </div>
                  {tvShow.last_air_date && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Last Air Date</p>
                      <p className="text-white font-medium">
                        {new Date(tvShow.last_air_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Similar TV Shows */}
          {similar.length > 0 && (
            <div className="mt-16">
              <ContentCarousel title="Similar TV Shows" items={similar} mediaType="tv" />
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
