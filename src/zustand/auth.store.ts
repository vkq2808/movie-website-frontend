import { create } from 'zustand';
import { persistNSync } from 'persist-and-sync';

interface AuthStore {
  auth: {
    token: string | undefined;
    user: User | undefined;
  },
  setAuth: (auth: { token: string | undefined, user: User | undefined }) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  persistNSync((set) => ({
    auth: {
      token: undefined,
      user: undefined
    },
    setAuth: (auth) => set({ auth }),
    setUser: (user) => set((state) => ({ auth: { ...state.auth, user } })),
    setToken: (token) => set((state) => ({ auth: { ...state.auth, token } })),
    logout: () => set({ auth: { token: undefined, user: undefined } }),
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