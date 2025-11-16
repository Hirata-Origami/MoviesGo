"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VidkingPlayer } from "@/components/player/VidkingPlayer";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { VidkingPlayerEvent } from "@/types";

export default function MovieWatchPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { saveProgress, getProgress } = useWatchHistory();
  const movieId = parseInt(params.id as string);

  const [initialProgress, setInitialProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      if (user) {
        const progress = await getProgress(movieId, "movie");
        if (progress) {
          setInitialProgress(progress.currentTime);
        }
      }
      setLoading(false);
    }

    loadProgress();
  }, [movieId, user]);

  const handleProgress = async (data: VidkingPlayerEvent["data"]) => {
    if (!user) return;

    // Save progress periodically (every 10 seconds of playback)
    if (data.event === "timeupdate" && data.currentTime % 10 < 1) {
      try {
        await saveProgress(
          movieId,
          "movie",
          "Movie", // This would ideally come from TMDB data
          null,
          data.progress,
          data.currentTime,
          data.duration
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
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-50">
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
              tmdbId: movieId,
              mediaType: "movie",
              color: "e50914",
              autoPlay: true,
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

