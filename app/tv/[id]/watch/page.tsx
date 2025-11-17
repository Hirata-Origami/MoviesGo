"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { VidkingPlayer } from "@/components/player/VidkingPlayer";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { VidkingPlayerEvent } from "@/types";

export default function TVWatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { saveProgress, getProgress } = useWatchHistory();
  
  const tvId = parseInt(params.id as string);
  const season = parseInt(searchParams.get("season") || "1");
  const episode = parseInt(searchParams.get("episode") || "1");

  const [initialProgress, setInitialProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      if (user) {
        const progress = await getProgress(tvId, "tv", season, episode);
        if (progress) {
          setInitialProgress(progress.currentTime);
        }
      }
      setLoading(false);
    }

    loadProgress();
  }, [tvId, season, episode, user]);

  const handleProgress = async (data: VidkingPlayerEvent["data"]) => {
    if (!user) return;

    // Save progress periodically (every 10 seconds of playback)
    if (data.event === "timeupdate" && data.currentTime % 10 < 1) {
      try {
        await saveProgress(
          tvId,
          "tv",
          "TV Show", // This would ideally come from TMDB data
          null,
          data.progress,
          data.currentTime,
          data.duration,
          season,
          episode
        );
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-lg animate-pulse"></div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="fixed inset-0 bg-black">
        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Video Player - Fullscreen */}
        <div className="w-full h-full flex items-center justify-center">
          <VidkingPlayer
            config={{
              tmdbId: tvId,
              mediaType: "tv",
              season,
              episode,
              color: "e50914",
              autoPlay: true,
              nextEpisode: true,
              episodeSelector: true,
              progress: initialProgress,
            }}
            onProgress={handleProgress}
            className="w-full h-full"
          />
        </div>
      </div>
    </AuthGuard>
  );
}

