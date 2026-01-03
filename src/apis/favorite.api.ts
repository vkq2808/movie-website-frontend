import api, { apiEndpoint } from "@/utils/api.util";
import { ApiResponse } from "@/types/api.response";

/**
 * Response from favorite endpoints
 */
export interface ToggleFavoriteResponse {
  isFavorite: boolean;
}

export interface FavoriteStatusResponse {
  isFavorite: boolean;
}

/**
 * Get favorite status for a movie
 *
 * GET /api/v1/favorites/status?movieId=:id
 * Requires: JwtAuthGuard (user must be logged in)
 *
 * @param movieId - UUID of the movie
 * @returns Promise with { isFavorite: boolean }
 * @throws 401 if user not authenticated
 * @throws 404 if movie not found
 */
const getFavoriteStatus = async (
  movieId: string
): Promise<ApiResponse<FavoriteStatusResponse>> => {
  try {
    const response = await api.get<ApiResponse<FavoriteStatusResponse>>(
      `${apiEndpoint.FAVORITE}/status?movieId=${movieId}`
    );
    return response.data;
  } catch (error) {
    // Let caller handle the error
    throw error;
  }
};

/**
 * Toggle favorite status for a movie
 *
 * POST /api/v1/favorites/toggle
 * Requires: JwtAuthGuard (user must be logged in)
 *
 * @param movieId - UUID of the movie
 * @returns Promise with { isFavorite: boolean }
 * @throws 401 if user not authenticated
 * @throws 404 if movie not found
 */
const toggleFavorite = async (
  movieId: string
): Promise<ApiResponse<ToggleFavoriteResponse>> => {
  try {
    const response = await api.post<ApiResponse<ToggleFavoriteResponse>>(
      `${apiEndpoint.FAVORITE}/toggle`,
      { movieId }
    );
    return response.data;
  } catch (error) {
    // Let caller handle the error
    throw error;
  }
};

export { getFavoriteStatus, toggleFavorite };
