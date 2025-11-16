import { TMDB_CONFIG } from "./config";
import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetails,
  TMDBTVShowDetails,
  TMDBResponse,
  TMDBGenreResponse,
  Credits,
  Video,
  Images,
  Review,
  Season,
} from "@/types";

const headers = {
  Authorization: `Bearer ${TMDB_CONFIG.ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

// Helper function to make API calls
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), { headers, next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json();
}

// ==================== DISCOVER & TRENDING ====================

export async function getTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
): Promise<TMDBResponse<TMDBMovie | TMDBTVShow>> {
  return tmdbFetch(`/trending/${mediaType}/${timeWindow}`);
}

export async function getTrendingMovies(
  timeWindow: "day" | "week" = "week"
): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch(`/trending/movie/${timeWindow}`);
}

export async function getTrendingTVShows(
  timeWindow: "day" | "week" = "week"
): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch(`/trending/tv/${timeWindow}`);
}

export async function getPopular(mediaType: "movie" | "tv"): Promise<TMDBResponse<TMDBMovie | TMDBTVShow>> {
  return tmdbFetch(`/${mediaType}/popular`);
}

export async function getTopRated(mediaType: "movie" | "tv"): Promise<TMDBResponse<TMDBMovie | TMDBTVShow>> {
  return tmdbFetch(`/${mediaType}/top_rated`);
}

export async function getUpcoming(): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch("/movie/upcoming");
}

export async function getNowPlaying(): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch("/movie/now_playing");
}

export async function getAiringToday(): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch("/tv/airing_today");
}

export async function getOnTheAir(): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch("/tv/on_the_air");
}

export async function discoverMovies(params: {
  page?: number;
  with_genres?: string;
  sort_by?: string;
  year?: string;
  "vote_average.gte"?: string;
  "vote_average.lte"?: string;
}): Promise<TMDBResponse<TMDBMovie>> {
  const queryParams = {
    page: params.page?.toString() || "1",
    ...Object.fromEntries(
      Object.entries(params).filter(([key, value]) => key !== "page" && value !== undefined)
    ),
  };
  return tmdbFetch("/discover/movie", queryParams);
}

export async function discoverTVShows(params: {
  page?: number;
  with_genres?: string;
  sort_by?: string;
  first_air_date_year?: string;
  "vote_average.gte"?: string;
  "vote_average.lte"?: string;
}): Promise<TMDBResponse<TMDBTVShow>> {
  const queryParams = {
    page: params.page?.toString() || "1",
    ...Object.fromEntries(
      Object.entries(params).filter(([key, value]) => key !== "page" && value !== undefined)
    ),
  };
  return tmdbFetch("/discover/tv", queryParams);
}

// ==================== SEARCH ====================

export async function searchMulti(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie | TMDBTVShow>> {
  return tmdbFetch("/search/multi", { query, page: page.toString() });
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch("/search/movie", { query, page: page.toString() });
}

export async function searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch("/search/tv", { query, page: page.toString() });
}

// ==================== DETAILS ====================

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  return tmdbFetch(`/movie/${movieId}`, { append_to_response: "videos,credits,images,reviews,similar,recommendations" });
}

export async function getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
  return tmdbFetch(`/tv/${tvId}`, { append_to_response: "videos,credits,images,reviews,similar,recommendations" });
}

export async function getSeasonDetails(tvId: number, seasonNumber: number): Promise<Season> {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getMovieCredits(movieId: number): Promise<Credits> {
  return tmdbFetch(`/movie/${movieId}/credits`);
}

export async function getTVShowCredits(tvId: number): Promise<Credits> {
  return tmdbFetch(`/tv/${tvId}/credits`);
}

export async function getMovieVideos(movieId: number): Promise<{ results: Video[] }> {
  return tmdbFetch(`/movie/${movieId}/videos`);
}

export async function getTVShowVideos(tvId: number): Promise<{ results: Video[] }> {
  return tmdbFetch(`/tv/${tvId}/videos`);
}

export async function getMovieImages(movieId: number): Promise<Images> {
  return tmdbFetch(`/movie/${movieId}/images`);
}

export async function getTVShowImages(tvId: number): Promise<Images> {
  return tmdbFetch(`/tv/${tvId}/images`);
}

export async function getMovieReviews(movieId: number): Promise<TMDBResponse<Review>> {
  return tmdbFetch(`/movie/${movieId}/reviews`);
}

export async function getTVShowReviews(tvId: number): Promise<TMDBResponse<Review>> {
  return tmdbFetch(`/tv/${tvId}/reviews`);
}

// ==================== RECOMMENDATIONS & SIMILAR ====================

export async function getSimilarMovies(movieId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch(`/movie/${movieId}/similar`, { page: page.toString() });
}

export async function getSimilarTVShows(tvId: number, page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch(`/tv/${tvId}/similar`, { page: page.toString() });
}

export async function getMovieRecommendations(movieId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch(`/movie/${movieId}/recommendations`, { page: page.toString() });
}

export async function getTVShowRecommendations(tvId: number, page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch(`/tv/${tvId}/recommendations`, { page: page.toString() });
}

// ==================== GENRES ====================

export async function getMovieGenres(): Promise<TMDBGenreResponse> {
  return tmdbFetch("/genre/movie/list");
}

export async function getTVGenres(): Promise<TMDBGenreResponse> {
  return tmdbFetch("/genre/tv/list");
}

export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch("/discover/movie", {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
  });
}

export async function getTVShowsByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch("/discover/tv", {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
  });
}

// ==================== COLLECTIONS ====================

export async function getCollection(collectionId: number): Promise<any> {
  return tmdbFetch(`/collection/${collectionId}`);
}

// ==================== PERSON ====================

export async function getPersonDetails(personId: number): Promise<any> {
  return tmdbFetch(`/person/${personId}`, { append_to_response: "movie_credits,tv_credits,images" });
}

export async function getPersonMovieCredits(personId: number): Promise<any> {
  return tmdbFetch(`/person/${personId}/movie_credits`);
}

export async function getPersonTVCredits(personId: number): Promise<any> {
  return tmdbFetch(`/person/${personId}/tv_credits`);
}

// ==================== CONFIGURATION ====================

export async function getConfiguration(): Promise<any> {
  return tmdbFetch("/configuration");
}

export async function getCountries(): Promise<any> {
  return tmdbFetch("/configuration/countries");
}

export async function getLanguages(): Promise<any> {
  return tmdbFetch("/configuration/languages");
}

