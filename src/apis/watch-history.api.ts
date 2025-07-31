import api, { apiEndpoint, handleApiError } from '@/utils/api.util';
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
  try {
    const response = await api.post<ApiResponse<WatchHistoryEntry>>(
      apiEndpoint.WATCH_HISTORY,
      { movieId, progress }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to add watch history');
    }

    return response.data;
  } catch (error: any) {
    throw handleApiError(error, 'addWatchHistory');
  }
}

// Get user's watch history
export async function getWatchHistory(
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse<WatchHistoryResponse>> {
  try {
    const response = await api.get<ApiResponse<WatchHistoryResponse>>(
      `${apiEndpoint.WATCH_HISTORY}?limit=${limit}&page=${page}`
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch watch history');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching watch history:', error);
    throw error;
  }
}

// Get recently watched movies
export async function getRecentlyWatched(
  limit: number = 10
): Promise<ApiResponse<Movie[]>> {
  try {
    const response = await api.get<ApiResponse<Movie[]>>(
      `${apiEndpoint.WATCH_HISTORY}/recent?limit=${limit}`
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch recently watched movies');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching recently watched movies:', error);
    throw error;
  }
}

// Get watch progress for a specific movie
export async function getWatchProgress(
  movieId: string
): Promise<ApiResponse<{ progress: number }>> {
  try {
    const response = await api.get<ApiResponse<{ progress: number }>>(
      `${apiEndpoint.WATCH_HISTORY}/progress/${movieId}`
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch watch progress');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching watch progress:', error);
    throw error;
  }
}

// Get user's watch statistics
export async function getWatchStats(): Promise<ApiResponse<WatchStats>> {
  try {
    const response = await api.get<ApiResponse<WatchStats>>(
      `${apiEndpoint.WATCH_HISTORY}/stats`
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch watch statistics');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching watch statistics:', error);
    throw error;
  }
}

// Delete specific watch history entry
export async function deleteWatchHistory(
  movieId: string
): Promise<ApiResponse<null>> {
  try {
    const response = await api.delete<ApiResponse<null>>(
      `${apiEndpoint.WATCH_HISTORY}/${movieId}`
    );

    if (response.status !== 200) {
      throw new Error('Failed to delete watch history');
    }

    return response.data;
  } catch (error) {
    console.error('Error deleting watch history:', error);
    throw error;
  }
}

// Clear all watch history
export async function clearWatchHistory(): Promise<ApiResponse<null>> {
  try {
    const response = await api.delete<ApiResponse<null>>(
      apiEndpoint.WATCH_HISTORY
    );

    if (response.status !== 200) {
      throw new Error('Failed to clear watch history');
    }

    return response.data;
  } catch (error) {
    console.error('Error clearing watch history:', error);
    throw error;
  }
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
