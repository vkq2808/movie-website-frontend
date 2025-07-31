import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface AlternativeTitle {
  id: string;
  title: string;
  language_iso_code: string;
  type: string;
}

export const getMovieAlternativeTitles = async (movieId: string): Promise<ApiResponse<AlternativeTitle[]>> => {
  const response = await api.get<ApiResponse<AlternativeTitle[]>>(`${apiEndpoint.MOVIE}/${movieId}/alternative-titles`);
  return response.data;
};

export const updateMovieAlternativeTitles = async (movieId: string): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(`${apiEndpoint.MOVIE}/${movieId}/update-alternative-titles`);
  return response.data;
};

export const importMovieAlternativeTitles = async (movieId: string, tmdbId: number): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(`${apiEndpoint.MOVIE}/${movieId}/import-alternative-titles`, { tmdbId });
  return response.data;
};
