import api, { apiEndpoint } from "@/utils/api.util";
import { ApiResponse } from "@/types/api.response";

export interface PurchaseMovieDto {
  movie_id: string;
}

export interface MoviePurchaseResponse {
  id: string;
  movie_id: string;
  movie_title: string;
  purchase_price: string;
  purchased_at: string;
  created_at: string;
  movie_poster?: string;
  movie_backdrop?: string;
}

export interface MovieOwnershipResponse {
  owns_movie: boolean;
}

export interface CanWatchMovieResponse {
  canWatch: boolean;
  reason?: "NOT_LOGIN" | "NOT_PURCHASED" | "NO_TICKET";
}

// Purchase a movie
// Purchase a movie
export async function purchaseMovie(
  movieId: string
): Promise<ApiResponse<MoviePurchaseResponse>> {
  const response = await api.post<ApiResponse<MoviePurchaseResponse>>(
    `${apiEndpoint.MOVIE_PURCHASE}`,
    { movie_id: movieId }
  );
  return response.data;
}

// Get user's purchased movies
export async function getUserPurchases(): Promise<
  ApiResponse<MoviePurchaseResponse[]>
> {
  const response = await api.get<ApiResponse<MoviePurchaseResponse[]>>(
    `${apiEndpoint.MOVIE_PURCHASE}`
  );
  return response.data;
}

// Check if user owns a specific movie
export async function checkMovieOwnership(
  movieId: string
): Promise<ApiResponse<MovieOwnershipResponse>> {
  const response = await api.get<ApiResponse<MovieOwnershipResponse>>(
    `${apiEndpoint.MOVIE_PURCHASE}/check/${movieId}`
  );
  return response.data;
}

// Get specific purchase details
export async function getPurchaseDetails(
  purchaseId: string
): Promise<ApiResponse<MoviePurchaseResponse>> {
  const response = await api.get<ApiResponse<MoviePurchaseResponse>>(
    `${apiEndpoint.MOVIE_PURCHASE}/${purchaseId}`
  );
  return response.data;
}

/**
 * ISSUE-02: Unified permission logic
 * Check if user can watch a specific movie
 * Returns canWatch status and reason for denial if applicable
 */
export async function canWatchMovie(
  movieId: string
): Promise<ApiResponse<CanWatchMovieResponse>> {
  const response = await api.get<ApiResponse<CanWatchMovieResponse>>(
    `${apiEndpoint.MOVIE_PURCHASE}/can-watch/${movieId}`
  );
  return response.data;
}
