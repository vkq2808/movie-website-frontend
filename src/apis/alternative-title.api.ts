import apiConfig from '@/utils/api.util';

export const getMovieAlternativeTitles = async (movieId: string) => {
  try {
    const response = await apiConfig.get(`/movie/${movieId}/alternative-titles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alternative titles:', error);
    throw error;
  }
};

export const updateMovieAlternativeTitles = async (movieId: string) => {
  try {
    const response = await apiConfig.post(`/movie/${movieId}/update-alternative-titles`);
    return response.data;
  } catch (error) {
    console.error('Error updating alternative titles:', error);
    throw error;
  }
};

export const importMovieAlternativeTitles = async (movieId: string, tmdbId: number) => {
  try {
    const response = await apiConfig.post(`/movie/${movieId}/import-alternative-titles`, { tmdbId });
    return response.data;
  } catch (error) {
    console.error('Error importing alternative titles:', error);
    throw error;
  }
};
