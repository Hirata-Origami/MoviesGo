// User Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

export interface UserPreferences {
  autoPlay: boolean;
  quality: "auto" | "1080p" | "720p" | "480p";
  language: string;
}

// TMDB Types
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  video: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  origin_country: string[];
  original_language: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  budget: number;
  revenue: number;
  genres: TMDBGenre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string;
  belongs_to_collection: Collection | null;
  credits?: Credits;
  videos?: { results: Video[] };
  images?: Images;
  reviews?: TMDBResponse<Review>;
  similar?: TMDBResponse<TMDBMovie>;
  recommendations?: TMDBResponse<TMDBMovie>;
}

export interface TMDBTVShowDetails extends TMDBTVShow {
  created_by: Creator[];
  episode_run_time: number[];
  genres: TMDBGenre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode | null;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
  credits?: Credits;
  videos?: { results: Video[] };
  images?: Images;
  reviews?: TMDBResponse<Review>;
  similar?: TMDBResponse<TMDBTVShow>;
  recommendations?: TMDBResponse<TMDBTVShow>;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface Images {
  backdrops: TMDBImage[];
  logos: TMDBImage[];
  posters: TMDBImage[];
}

export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

// Firestore Types
export interface WatchHistory {
  userId: string;
  contentId: number;
  contentType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  progress: number; // percentage
  currentTime: number; // seconds
  duration: number; // seconds
  lastWatched: Date;
  season?: number;
  episode?: number;
}

export interface WatchlistItem {
  userId: string;
  contentId: number;
  contentType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  addedAt: Date;
  overview?: string;
  rating?: number;
}

export interface UserRating {
  userId: string;
  contentId: number;
  contentType: "movie" | "tv";
  rating: number; // 1-10
  createdAt: Date;
  updatedAt: Date;
}

// Vidking Player Types
export interface VidkingPlayerConfig {
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  color?: string;
  autoPlay?: boolean;
  nextEpisode?: boolean;
  episodeSelector?: boolean;
  progress?: number;
}

export interface VidkingPlayerEvent {
  type: "PLAYER_EVENT";
  data: {
    event: "timeupdate" | "play" | "pause" | "ended" | "seeked";
    currentTime: number;
    duration: number;
    progress: number;
    id: string;
    mediaType: "movie" | "tv";
    season?: number;
    episode?: number;
    timestamp: number;
  };
}

// API Response Types
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenreResponse {
  genres: TMDBGenre[];
}

export interface TMDBSearchResponse {
  page: number;
  results: (TMDBMovie | TMDBTVShow)[];
  total_pages: number;
  total_results: number;
}

