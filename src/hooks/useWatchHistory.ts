import { useState, useEffect } from "react";
import { Movie } from "@/types/api.types";
import api from "@/utils/api.util";

interface WatchHistoryItem {
  id: string;
  movie: Movie;
  progress: number;
  created_at: string;
  updated_at: string;
}

interface UseWatchHistoryReturn {
  watchHistory: Movie[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWatchHistory(): UseWatchHistoryReturn {
  const [watchHistory, setWatchHistory] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/watch-history`, {
        withCredentials: true,
        params: { limit: 50 },
      });

      const historyData = response.data.data;
      const movies =
        historyData.watchHistory?.map((item: WatchHistoryItem) => item.movie) ||
        [];
      setWatchHistory(movies);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải lịch sử xem");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  return {
    watchHistory,
    loading,
    error,
    refetch: fetchWatchHistory,
  };
}
