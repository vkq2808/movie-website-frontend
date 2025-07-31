import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';
import { Movie } from '@/zustand';

export interface WatchHistoryEntry {
  id: string;
  movie: Movie;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface WatchHistoryResponse {
  watchHistory: WatchHistoryEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface WatchStats {
  totalMoviesWatched: number;
  totalWatchTime: number;
  averageProgress: number;
  favoriteGenres: Array<{ genreId: string; count: number }>;
}

export interface AddWatchHistoryRequest {
  movieId: string;
  progress: number;
}

// Add or update watch history
export async function addWatchHistory(
  movieId: string,
  progress: number
): Promise<ApiResponse<WatchHistoryEntry>> {
  const response = await api.post<ApiResponse<WatchHistoryEntry>>(
    apiEndpoint.WATCH_HISTORY,
    { movieId, progress }
  );
  return response.data;
}

// Get user's watch history
export async function getWatchHistory(
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse<WatchHistoryResponse>> {
  const response = await api.get<ApiResponse<WatchHistoryResponse>>(
    `${apiEndpoint.WATCH_HISTORY}?limit=${limit}&page=${page}`
  );
  return response.data;
}

// Get recently watched movies
export async function getRecentlyWatched(
  limit: number = 10
): Promise<ApiResponse<Movie[]>> {
  const response = await api.get<ApiResponse<Movie[]>>(
    `${apiEndpoint.WATCH_HISTORY}/recent?limit=${limit}`
  );
  return response.data;
}

// Get watch progress for a specific movie
export async function getWatchProgress(
  movieId: string
): Promise<ApiResponse<{ progress: number }>> {
  const response = await api.get<ApiResponse<{ progress: number }>>(
    `${apiEndpoint.WATCH_HISTORY}/progress/${movieId}`
  );
  return response.data;
}

// Get user's watch statistics
export async function getWatchStats(): Promise<ApiResponse<WatchStats>> {
  const response = await api.get<ApiResponse<WatchStats>>(
    `${apiEndpoint.WATCH_HISTORY}/stats`
  );
  return response.data;
}

// Delete specific watch history entry
export async function deleteWatchHistory(
  movieId: string
): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>(
    `${apiEndpoint.WATCH_HISTORY}/${movieId}`
  );
  return response.data;
}

// Clear all watch history
export async function clearWatchHistory(): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>(
    apiEndpoint.WATCH_HISTORY
  );
  return response.data;
}

// Update movie progress (alias for addWatchHistory)
export async function updateMovieProgress(
  movieId: string,
  progress: number
): Promise<ApiResponse<WatchHistoryEntry>> {
  return addWatchHistory(movieId, progress);
}

// Mark movie as completed (progress = 100)
export async function markMovieAsCompleted(
  movieId: string
): Promise<ApiResponse<WatchHistoryEntry>> {
  return addWatchHistory(movieId, 100);
}

// Check if movie was watched
export async function isMovieWatched(movieId: string): Promise<boolean> {
  try {
    const response = await getWatchProgress(movieId);
    return response.data.progress > 0;
  } catch (error) {
    return false;
  }
}

// Get completion percentage for a movie
export async function getMovieCompletionPercentage(movieId: string): Promise<number> {
  try {
    const response = await getWatchProgress(movieId);
    return response.data.progress;
  } catch (error) {
    return 0;
  }
}
