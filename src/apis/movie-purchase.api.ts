import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface PurchaseMovieDto {
  movie_id: string;
}

export interface MoviePurchaseResponse {
  id: string;
  movie_id: string;
  movie_title: string;
  purchase_price: number;
  purchased_at: string;
  created_at: string;
}

// Purchase a movie
export async function purchaseMovie(movieId: string): Promise<ApiResponse<MoviePurchaseResponse>> {
  const response = await api.post<ApiResponse<MoviePurchaseResponse>>(
    `${apiEndpoint.MOVIE_PURCHASE}`,
    { movie_id: movieId }
  );
  return response.data;
}

// Get user's purchased movies
export async function getUserPurchases(): Promise<ApiResponse<MoviePurchaseResponse[]>> {
  const response = await api.get<ApiResponse<MoviePurchaseResponse[]>>(
    `${apiEndpoint.MOVIE_PURCHASE}`
  );
  return response.data;
}

// Check if user owns a specific movie
export async function checkMovieOwnership(movieId: string): Promise<ApiResponse<{ owns_movie: boolean }>> {
  const response = await api.get<ApiResponse<{ owns_movie: boolean }>>(
    `${apiEndpoint.MOVIE_PURCHASE}/check/${movieId}`
  );
  return response.data;
}

// Get specific purchase details
export async function getPurchaseDetails(purchaseId: string): Promise<ApiResponse<MoviePurchaseResponse>> {
  const response = await api.get<ApiResponse<MoviePurchaseResponse>>(
    `${apiEndpoint.MOVIE_PURCHASE}/${purchaseId}`
  );
  return response.data;
}
