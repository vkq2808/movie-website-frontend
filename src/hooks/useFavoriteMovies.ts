import { useState, useEffect } from "react";
import { Movie } from "@/types/api.types";
import api from "@/utils/api.util";

interface UseFavoriteMoviesReturn {
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  addFavorite: (movieId: string) => Promise<void>;
  removeFavorite: (movieId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useFavoriteMovies(): UseFavoriteMoviesReturn {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/user/me/favorites`);
      setFavorites(response.data.data || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách yêu thích"
      );
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (movieId: string) => {
    try {
      await api.post<{ isFavorite: boolean }>(`/user/me/favorites`, {
        movieId,
      });
      await fetchFavorites();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể thêm vào danh sách yêu thích";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeFavorite = async (movieId: string) => {
    try {
      await api.delete(`/user/me/favorites/${movieId}`);
      await fetchFavorites();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể xóa khỏi danh sách yêu thích";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    refetch: fetchFavorites,
  };
}
