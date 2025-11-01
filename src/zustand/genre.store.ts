import { create } from 'zustand';
import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';
import { Genre } from '@/types/api.types';

type GenreStore = {
  genres: Genre[];
  setGenres: (genres: Genre[]) => void;
  fetchGenres: () => Promise<void>;
}

export const useGenreStore = create<GenreStore>((set) => ({
  genres: [],
  setGenres: (genres) => set({ genres }),
  fetchGenres: async () => {
    try {
      const res = await api.get<ApiResponse<Genre[]>>(apiEndpoint.GENRE);
      set({ genres: res.data.data });
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  }
}));
