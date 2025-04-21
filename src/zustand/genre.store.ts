import { create } from 'zustand';
import { Genre } from './types';
import api, { apiEnpoint } from '@/utils/api.util';


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
      const res = await api.get<Genre[]>(apiEnpoint.GENRE);
      set({ genres: res.data });
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  }
}));
