import { create } from 'zustand';
import { persistNSync } from 'persist-and-sync';

interface AuthStore {
  auth: {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    user: User | undefined;
  },
  setAuth: ({ accessToken, user, refreshToken }: { accessToken: string | undefined, user: User | undefined, refreshToken: string | undefined }) => void;
  setUser: (user: User) => void;
  setToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  persistNSync((set) => ({
    auth: {
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined
    },
    setAuth: (auth) => set({ auth }),
    setUser: (user) => set((state) => ({ auth: { ...state.auth, user } })),
    setToken: (accessToken) => set((state) => ({ auth: { ...state.auth, accessToken } })),
    logout: () => set({ auth: { accessToken: undefined, user: undefined, refreshToken: undefined } }),
  }), { name: 'auth' }
  ));

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