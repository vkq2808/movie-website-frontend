import apiConfig from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface AlternativeTitle {
  id: string;
  title: string;
  language_iso_code: string;
  type: string;
}

export const getMovieAlternativeTitles = async (movieId: string): Promise<ApiResponse<AlternativeTitle[]>> => {
  try {
    const response = await apiConfig.get<ApiResponse<AlternativeTitle[]>>(`/movie/${movieId}/alternative-titles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alternative titles:', error);
    throw error;
  }
};

export const updateMovieAlternativeTitles = async (movieId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await apiConfig.post<ApiResponse<any>>(`/movie/${movieId}/update-alternative-titles`);
    return response.data;
  } catch (error) {
    console.error('Error updating alternative titles:', error);
    throw error;
  }
};

export const importMovieAlternativeTitles = async (movieId: string, tmdbId: number): Promise<ApiResponse<any>> => {
  try {
    const response = await apiConfig.post<ApiResponse<any>>(`/movie/${movieId}/import-alternative-titles`, { tmdbId });
    return response.data;
  } catch (error) {
    console.error('Error importing alternative titles:', error);
    throw error;
  }
};
