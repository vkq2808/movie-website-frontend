import api from "@/utils/api.util";
import { create } from "zustand";

export interface UserStore {
  user: User | undefined;
  setUser: (user: User) => void;
  fetchUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user: User) => set({ user }),
  fetchUser: async () => {
    try {
      const res = await api.get<User>('/users/me');
      set({ user: res.data });
    } catch (error) {
      console.error(error);
    }
  }
}));


export interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
  birthdate: string;
  photoUrl: string;

  favoriteMovies: Movie[];

  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  generes: Genre[];
  title: string;
  description: string;
  releasedDate: string;
  duration: number;
  posterUrl: string;
  trailerUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface Genre {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}