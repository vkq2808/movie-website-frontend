import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse, PaginatedApiResponse } from '@/types/api.response';
import { Movie } from '@/types/api.types';

export interface RecommendationFilters {
  type?: 'content_based' | 'collaborative' | 'hybrid' | 'trending';
  limit?: number;
  page?: number;
  genres?: string[];
  languages?: string[];
  exclude_watched?: boolean;
  exclude_purchased?: boolean;
  min_score?: number;
}

export interface RecommendationMetadata {
  matching_genres?: string[];
  matching_actors?: string[];
  matching_directors?: string[];
  matching_languages?: string[];
  user_similarity_score?: number;
  content_similarity_score?: number;
  trending_score?: number;
  reasoning?: string;
}

export interface RecommendationResponse {
  id: string;
  movie: Movie;
  recommendation_type: 'content_based' | 'collaborative' | 'hybrid' | 'trending';
  sources: string[];
  score: number;
  metadata: RecommendationMetadata;
  created_at: string;
}

export interface RecommendationsListResponse {
  recommendations: RecommendationResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface RecommendationStats {
  total_recommendations: number;
  by_type: Record<string, number>;
  by_source: Record<string, number>;
  average_score: number;
  last_updated: string;
}

export interface GenerateRecommendationsRequest {
  type?: 'content_based' | 'collaborative' | 'hybrid' | 'trending';
  limit?: number;
  force_refresh?: boolean;
}

export interface GenerateRecommendationsResponse {
  generated: number;
  updated: number;
}

export interface TrendingRecommendationsResponse {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
}

// Get personalized recommendations
export async function getRecommendations(
  filters: RecommendationFilters = {}
): Promise<ApiResponse<RecommendationsListResponse>> {
  const params = new URLSearchParams();

  if (filters.type) {
    params.append('type', filters.type);
  }

  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }

  if (filters.page) {
    params.append('page', filters.page.toString());
  }

  if (filters.genres && filters.genres.length > 0) {
    filters.genres.forEach(genre => params.append('genres[]', genre));
  }

  if (filters.languages && filters.languages.length > 0) {
    filters.languages.forEach(lang => params.append('languages[]', lang));
  }

  if (filters.exclude_watched !== undefined) {
    params.append('exclude_watched', filters.exclude_watched.toString());
  }

  if (filters.exclude_purchased !== undefined) {
    params.append('exclude_purchased', filters.exclude_purchased.toString());
  }

  if (filters.min_score !== undefined) {
    params.append('min_score', filters.min_score.toString());
  }

  const url = `${apiEndpoint.RECOMMENDATION}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await api.get<ApiResponse<RecommendationsListResponse>>(url);
  return response.data;
}

// Generate new recommendations
export async function generateRecommendations(
  options: GenerateRecommendationsRequest = {}
): Promise<ApiResponse<GenerateRecommendationsResponse>> {
  const response = await api.post<ApiResponse<GenerateRecommendationsResponse>>(
    `${apiEndpoint.RECOMMENDATION}/generate`,
    options
  );
  return response.data;
}

// Get recommendation statistics
export async function getRecommendationStats(): Promise<ApiResponse<RecommendationStats>> {
  const response = await api.get<ApiResponse<RecommendationStats>>(
    `${apiEndpoint.RECOMMENDATION}/stats`
  );
  return response.data;
}

// Get trending recommendations (public)
export async function getTrendingRecommendations(
  filters: RecommendationFilters = {}
): Promise<ApiResponse<RecommendationsListResponse>> {
  const params = new URLSearchParams();

  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }

  if (filters.page) {
    params.append('page', filters.page.toString());
  }

  if (filters.exclude_watched !== undefined) {
    params.append('exclude_watched', filters.exclude_watched.toString());
  }

  if (filters.exclude_purchased !== undefined) {
    params.append('exclude_purchased', filters.exclude_purchased.toString());
  }

  if (filters.min_score !== undefined) {
    params.append('min_score', filters.min_score.toString());
  }

  const url = `${apiEndpoint.RECOMMENDATION}/trending${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await api.get<ApiResponse<RecommendationsListResponse>>(url);
  return response.data;
}

// Get content-based recommendations
export async function getContentBasedRecommendations(
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse<RecommendationsListResponse>> {
  return getRecommendations({
    type: 'content_based',
    limit,
    page,
  });
}

// Get collaborative filtering recommendations
export async function getCollaborativeRecommendations(
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse<RecommendationsListResponse>> {
  return getRecommendations({
    type: 'collaborative',
    limit,
    page,
  });
}

// Get hybrid recommendations
export async function getHybridRecommendations(
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse<RecommendationsListResponse>> {
  return getRecommendations({
    type: 'hybrid',
    limit,
    page,
  });
}

// Get recommendations by genre
export async function getRecommendationsByGenre(
  genreIds: string[],
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse<RecommendationsListResponse>> {
  return getRecommendations({
    genres: genreIds,
    limit,
    page,
  });
}

// Get recommendations excluding watched content
export async function getUnwatchedRecommendations(
  limit: number = 20,
  page: number = 1
): Promise<ApiResponse<RecommendationsListResponse>> {
  return getRecommendations({
    exclude_watched: true,
    limit,
    page,
  });
}
