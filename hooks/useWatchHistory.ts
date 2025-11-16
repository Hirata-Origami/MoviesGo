"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  saveWatchHistory,
  getWatchHistory,
  getContinueWatching,
  getWatchProgress,
} from "@/lib/firebase/firestore";
import { WatchHistory } from "@/types";

export function useWatchHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<WatchHistory[]>([]);
  const [continueWatching, setContinueWatching] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setHistory([]);
      setContinueWatching([]);
      setLoading(false);
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const [historyData, continueData] = await Promise.all([
        getWatchHistory(user.uid),
        getContinueWatching(user.uid),
      ]);
      setHistory(historyData);
      setContinueWatching(continueData);
    } catch (error) {
      console.error("Failed to load watch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (
    contentId: number,
    contentType: "movie" | "tv",
    title: string,
    posterPath: string | null,
    progress: number,
    currentTime: number,
    duration: number,
    season?: number,
    episode?: number
  ) => {
    if (!user) throw new Error("User not authenticated");

    await saveWatchHistory({
      userId: user.uid,
      contentId,
      contentType,
      title,
      posterPath,
      progress,
      currentTime,
      duration,
      season,
      episode,
    });

    await loadHistory();
  };

  const getProgress = async (
    contentId: number,
    contentType: "movie" | "tv",
    season?: number,
    episode?: number
  ): Promise<WatchHistory | null> => {
    if (!user) return null;
    try {
      return await getWatchProgress(user.uid, contentId, contentType, season, episode);
    } catch (error) {
      console.error('Error getting watch progress:', error);
      return null;
    }
  };

  return {
    history,
    continueWatching,
    loading,
    saveProgress,
    getProgress,
    refresh: loadHistory,
  };
}

