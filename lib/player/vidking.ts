import { VidkingPlayerConfig } from "@/types";

const VIDKING_BASE_URL = process.env.NEXT_PUBLIC_VIDKING_BASE_URL || "https://www.vidking.net";

export function generateVidkingUrl(config: VidkingPlayerConfig): string {
  const { tmdbId, mediaType, season, episode, color, autoPlay, nextEpisode, episodeSelector, progress } = config;

  let baseUrl = `${VIDKING_BASE_URL}/embed/${mediaType}/${tmdbId}`;

  // Add season and episode for TV shows
  if (mediaType === "tv" && season !== undefined && episode !== undefined) {
    baseUrl += `/${season}/${episode}`;
  }

  // Build query parameters
  const params = new URLSearchParams();

  if (color) {
    params.append("color", color.replace("#", ""));
  }

  if (autoPlay !== undefined) {
    params.append("autoPlay", autoPlay.toString());
  }

  if (nextEpisode !== undefined && mediaType === "tv") {
    params.append("nextEpisode", nextEpisode.toString());
  }

  if (episodeSelector !== undefined && mediaType === "tv") {
    params.append("episodeSelector", episodeSelector.toString());
  }

  if (progress !== undefined) {
    params.append("progress", progress.toString());
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function getEmbedHtml(config: VidkingPlayerConfig, width: string = "100%", height: string = "600"): string {
  const url = generateVidkingUrl(config);
  return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
}

