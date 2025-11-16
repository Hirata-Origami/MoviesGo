import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { WatchHistory, WatchlistItem, UserRating } from "@/types";

// Watch History Functions
export const saveWatchHistory = async (watchHistory: Omit<WatchHistory, "lastWatched">) => {
  try {
    const historyRef = doc(
      db,
      "watchHistory",
      `${watchHistory.userId}_${watchHistory.contentType}_${watchHistory.contentId}_${watchHistory.season || 0}_${watchHistory.episode || 0}`
    );
    
    // Filter out undefined values
    const cleanedData: any = {
      userId: watchHistory.userId,
      contentId: watchHistory.contentId,
      contentType: watchHistory.contentType,
      title: watchHistory.title,
      posterPath: watchHistory.posterPath,
      currentTime: watchHistory.currentTime,
      duration: watchHistory.duration,
      progress: watchHistory.progress,
      lastWatched: serverTimestamp(),
    };
    
    // Only add season/episode if they exist (for TV shows)
    if (watchHistory.season !== undefined && watchHistory.season !== null) {
      cleanedData.season = watchHistory.season;
    }
    if (watchHistory.episode !== undefined && watchHistory.episode !== null) {
      cleanedData.episode = watchHistory.episode;
    }
    
    await setDoc(historyRef, cleanedData);
  } catch (error: any) {
    throw new Error(`Failed to save watch history: ${error.message}`);
  }
};

export const getWatchHistory = async (userId: string): Promise<WatchHistory[]> => {
  try {
    const historyQuery = query(
      collection(db, "watchHistory"),
      where("userId", "==", userId),
      orderBy("lastWatched", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(historyQuery);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        lastWatched: (data.lastWatched as Timestamp).toDate(),
      } as WatchHistory;
    });
  } catch (error: any) {
    throw new Error(`Failed to get watch history: ${error.message}`);
  }
};

export const getContinueWatching = async (userId: string): Promise<WatchHistory[]> => {
  try {
    const historyQuery = query(
      collection(db, "watchHistory"),
      where("userId", "==", userId),
      where("progress", ">", 5),
      where("progress", "<", 95),
      orderBy("progress"),
      orderBy("lastWatched", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(historyQuery);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        lastWatched: (data.lastWatched as Timestamp).toDate(),
      } as WatchHistory;
    });
  } catch (error: any) {
    throw new Error(`Failed to get continue watching: ${error.message}`);
  }
};

export const getWatchProgress = async (
  userId: string,
  contentId: number,
  contentType: "movie" | "tv",
  season?: number,
  episode?: number
): Promise<WatchHistory | null> => {
  try {
    const historyRef = doc(
      db,
      "watchHistory",
      `${userId}_${contentType}_${contentId}_${season || 0}_${episode || 0}`
    );
    
    const snapshot = await getDoc(historyRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        ...data,
        lastWatched: (data.lastWatched as Timestamp).toDate(),
      } as WatchHistory;
    }
    return null;
  } catch (error: any) {
    // Silently return null for permission errors to avoid breaking the UI
    if (error.code === 'permission-denied') {
      console.warn('Permission denied accessing watch progress, user may not be authenticated');
      return null;
    }
    console.error('Failed to get watch progress:', error);
    return null;
  }
};

// Watchlist Functions
export const addToWatchlist = async (item: Omit<WatchlistItem, "addedAt">) => {
  try {
    const watchlistRef = doc(
      db,
      "watchlist",
      `${item.userId}_${item.contentType}_${item.contentId}`
    );
    
    await setDoc(watchlistRef, {
      ...item,
      addedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(`Failed to add to watchlist: ${error.message}`);
  }
};

export const removeFromWatchlist = async (
  userId: string,
  contentId: number,
  contentType: "movie" | "tv"
) => {
  try {
    const watchlistRef = doc(
      db,
      "watchlist",
      `${userId}_${contentType}_${contentId}`
    );
    
    await deleteDoc(watchlistRef);
  } catch (error: any) {
    throw new Error(`Failed to remove from watchlist: ${error.message}`);
  }
};

export const getWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  try {
    const watchlistQuery = query(
      collection(db, "watchlist"),
      where("userId", "==", userId),
      orderBy("addedAt", "desc")
    );

    const snapshot = await getDocs(watchlistQuery);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        addedAt: (data.addedAt as Timestamp).toDate(),
      } as WatchlistItem;
    });
  } catch (error: any) {
    throw new Error(`Failed to get watchlist: ${error.message}`);
  }
};

export const isInWatchlist = async (
  userId: string,
  contentId: number,
  contentType: "movie" | "tv"
): Promise<boolean> => {
  try {
    const watchlistRef = doc(
      db,
      "watchlist",
      `${userId}_${contentType}_${contentId}`
    );
    
    const snapshot = await getDoc(watchlistRef);
    return snapshot.exists();
  } catch (error: any) {
    return false;
  }
};

// User Rating Functions
export const saveUserRating = async (rating: Omit<UserRating, "createdAt" | "updatedAt">) => {
  try {
    const ratingRef = doc(
      db,
      "ratings",
      `${rating.userId}_${rating.contentType}_${rating.contentId}`
    );
    
    const existingRating = await getDoc(ratingRef);
    
    if (existingRating.exists()) {
      await updateDoc(ratingRef, {
        rating: rating.rating,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ratingRef, {
        ...rating,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error: any) {
    throw new Error(`Failed to save rating: ${error.message}`);
  }
};

export const getUserRating = async (
  userId: string,
  contentId: number,
  contentType: "movie" | "tv"
): Promise<UserRating | null> => {
  try {
    const ratingRef = doc(
      db,
      "ratings",
      `${userId}_${contentType}_${contentId}`
    );
    
    const snapshot = await getDoc(ratingRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
      } as UserRating;
    }
    return null;
  } catch (error: any) {
    return null;
  }
};

