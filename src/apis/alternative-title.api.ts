import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface AlternativeTitle {
  id: string;
  title: string;
  iso_639_1: string;
  type: string;
  created_at: Date;
  updated_at: Date;
}

export interface AlternativeOverview {
  id: string;
  overview: string;
  iso_639_1: string;
}

export interface UpdateAlternativeTitlesResponse {
  success: boolean;
  message: string;
  count: {
    titles: number;
    overviews: number;
  };
  titles: AlternativeTitle[];
  overviews: AlternativeOverview[];
}

export interface ImportAlternativeTitlesResponse {
  message: string;
  titles: AlternativeTitle[];
  overviews: AlternativeOverview[];
}

export const getMovieAlternativeTitles = async (movieId: string): Promise<ApiResponse<AlternativeTitle[]>> => {
  const response = await api.get<ApiResponse<AlternativeTitle[]>>(`${apiEndpoint.MOVIE}/${movieId}/alternative-titles`);
  return response.data;
};

export const updateMovieAlternativeTitles = async (movieId: string): Promise<ApiResponse<UpdateAlternativeTitlesResponse>> => {
  const response = await api.post<ApiResponse<UpdateAlternativeTitlesResponse>>(`${apiEndpoint.MOVIE}/${movieId}/update-alternative-titles`);
  return response.data;
};

export const importMovieAlternativeTitles = async (movieId: string, tmdbId: number): Promise<ApiResponse<ImportAlternativeTitlesResponse>> => {
  const response = await api.post<ApiResponse<ImportAlternativeTitlesResponse>>(`${apiEndpoint.MOVIE}/${movieId}/import-alternative-titles`, { tmdbId });
  return response.data;
};
