export const TMDB_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
  ACCESS_TOKEN: process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN || "",
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
};

export const IMAGE_SIZES = {
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    xlarge: "w780",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
    original: "original",
  },
  logo: {
    small: "w45",
    medium: "w92",
    large: "w185",
    xlarge: "w300",
    original: "original",
  },
};

export const getImageUrl = (
  path: string | null,
  type: keyof typeof IMAGE_SIZES,
  size: string = "medium"
): string => {
  if (!path) return "/placeholder-image.jpg";
  
  const sizeKey = IMAGE_SIZES[type][size as keyof typeof IMAGE_SIZES[typeof type]] || IMAGE_SIZES[type].medium;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${sizeKey}${path}`;
};

