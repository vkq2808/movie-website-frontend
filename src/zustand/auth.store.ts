import { create } from 'zustand';
import { persistNSync } from 'persist-and-sync';
import { User } from './types';
import api, { apiEndpoint } from '@/utils/api.util';

export interface AuthStore {
  access_token: string | undefined,
  refresh_token: string | undefined,
  user: User | undefined
  ,
  setAuth: ({ access_token, refresh_token, user }: { access_token: string | undefined, refresh_token: string | undefined, user: User }) => Promise<void>;
  setAccessToken: (access_token: string) => void;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  persistNSync((set, get) => ({
    access_token: undefined,
    refresh_token: undefined,
    user: undefined,
    setAuth: async ({ access_token, refresh_token, user }) => {
      set({
        access_token: access_token || undefined,
        refresh_token: refresh_token || undefined,
        user: user
      });
    },
    setAccessToken: (access_token) => set((state) => ({ ...state, access_token })),
    logout: () => {
      set({ access_token: undefined, refresh_token: undefined, user: undefined });
    },
    setUser: (user: User) => set((state) => ({ ...state, user })),
    fetchUser: async () => {
      if (!get().access_token) {
        return
      }
      const res = await api.get<User>(`${apiEndpoint.AUTH}/me`).catch((err) => {
        console.error('Error fetching user:', err)
        return { data: undefined }
      });
      set((state) => ({ ...state, user: res.data }));
    }
  }), { name: 'auth' }));