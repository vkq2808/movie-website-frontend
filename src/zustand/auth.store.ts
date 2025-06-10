import { create } from 'zustand';
import { persistNSync } from 'persist-and-sync';
import { User } from './types';
import api, { apiEndpoint } from '@/utils/api.util';

export interface AuthStore {
  access_token: string | undefined,
  refresh_token: string | undefined,
  user: User | undefined
  ,
  setAuth: ({ access_token, refresh_token }: { access_token: string | undefined, refresh_token: string | undefined }) => void;
  setAccessToken: (access_token: string) => void;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  persistNSync((set) => ({
    access_token: undefined,
    refresh_token: undefined,
    user: undefined
    , setAuth: ({ access_token, refresh_token }) => {
      set({
        access_token: access_token || undefined,
        refresh_token: refresh_token || undefined,
        user: undefined
      });
    },
    setAccessToken: (access_token) => set((state) => ({ ...state, access_token })),
    logout: () => {
      set({ access_token: undefined, refresh_token: undefined, user: undefined });
    },
    setUser: (user: User) => set((state) => ({ ...state, user })),
    fetchUser: async () => {
      try {
        const res = await api.get<User>(`${apiEndpoint.AUTH}/me`);
        set((state) => ({ ...state, user: res.data }));
      } catch (error) {
        console.error(error);
      }
    }
  }), { name: 'auth' }));