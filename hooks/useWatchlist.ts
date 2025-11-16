"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  isInWatchlist,
} from "@/lib/firebase/firestore";
import { WatchlistItem } from "@/types";

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setWatchlist([]);
      setLoading(false);
    }
  }, [user]);

  const loadWatchlist = async () => {
    if (!user) return;
    
    try {
      const items = await getWatchlist(user.uid);
      setWatchlist(items);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    contentId: number,
    contentType: "movie" | "tv",
    title: string,
    posterPath: string | null,
    backdropPath: string | null,
    overview?: string,
    rating?: number
  ) => {
    if (!user) throw new Error("User not authenticated");

    await addToWatchlist({
      userId: user.uid,
      contentId,
      contentType,
      title,
      posterPath,
      backdropPath,
      overview,
      rating,
    });

    await loadWatchlist();
  };

  const removeItem = async (contentId: number, contentType: "movie" | "tv") => {
    if (!user) throw new Error("User not authenticated");

    await removeFromWatchlist(user.uid, contentId, contentType);
    await loadWatchlist();
  };

  const checkInWatchlist = async (contentId: number, contentType: "movie" | "tv"): Promise<boolean> => {
    if (!user) return false;
    return await isInWatchlist(user.uid, contentId, contentType);
  };

  return {
    watchlist,
    loading,
    addItem,
    removeItem,
    checkInWatchlist,
    refresh: loadWatchlist,
  };
}

