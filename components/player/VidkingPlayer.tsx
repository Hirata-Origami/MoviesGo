"use client";

import { useEffect, useRef, useState } from "react";
import { generateVidkingUrl } from "@/lib/player/vidking";
import { VidkingPlayerConfig, VidkingPlayerEvent } from "@/types";

interface VidkingPlayerProps {
  config: VidkingPlayerConfig;
  onProgress?: (data: VidkingPlayerEvent["data"]) => void;
  className?: string;
}

export function VidkingPlayer({ config, onProgress, className = "" }: VidkingPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          const data = JSON.parse(event.data);
          
          if (data.type === "PLAYER_EVENT" && onProgress) {
            onProgress(data.data);
          }
        }
      } catch (error) {
        console.error("Error parsing player message:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onProgress]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const playerUrl = generateVidkingUrl(config);

  if (hasError) {
    return (
      <div className={`relative w-full aspect-video bg-black ${className} flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">Video Unavailable</h3>
          <p className="text-gray-400 text-sm">
            This content is currently not available for streaming.
            <br />
            Please try again later or choose another title.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-video bg-black ${className}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="w-full h-full bg-gray-900 animate-pulse flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              </div>
            )}
      <iframe
        ref={iframeRef}
        src={playerUrl}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ display: hasError ? 'none' : 'block' }}
      />
    </div>
  );
}

