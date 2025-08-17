import { create } from 'zustand';
import { User } from './types';
import type { ApiResponse } from '@/types/api.response';
import api, { apiEndpoint } from '@/utils/api.util';

export interface AuthStore {
  user: User | undefined
  ,
  setAuth: ({ user }: { user: User }) => Promise<void>;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
  hydrated: boolean;
}

export const useAuthStore = create<AuthStore>(
  (set, get) => ({
    user: undefined,
    hydrated: false,
    setAuth: async ({ user }) => {
      // Update store
      set({
        user: user
      });
      // Persist only user to localStorage; both tokens live in cookies now
      try {
        if (user) {
          localStorage.setItem('auth', JSON.stringify({ user }));
        } else {
          localStorage.removeItem('auth');
        }
      } catch { /* ignore */ }
    },
    logout: () => {
      set({ user: undefined, hydrated: true });
      try {
        localStorage.removeItem('auth');
      } catch {
        // ignore
      }
      // Clear token cookies
      if (typeof document !== 'undefined') {
        try {
          document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax';
          document.cookie = 'refresh_token=; Path=/; Max-Age=0; SameSite=Lax';
          try { window.dispatchEvent(new CustomEvent('auth:token-updated')); } catch { }
          try { new BroadcastChannel('auth').postMessage({ type: 'token-updated' }); } catch { }
        } catch { /* ignore */ }
      }
      delete api.defaults.headers.common['Authorization'];
    },
    setUser: (user: User) => set((state) => ({ ...state, user })),
    fetchUser: async () => {
      try {
        const { data } = await api.get<ApiResponse<User>>(`${apiEndpoint.AUTH}/me`);
        if (data?.success && data.data) {
          set((state) => ({ ...state, user: data.data }));
        }
      } catch (err) {
        // Ignore 401s silently; user is not authenticated
        // Only log unexpected errors
        // @ts-expect-error: err may be an AxiosError; safe optional chaining check
        if (!(err?.response?.status === 401)) {
          console.error('Error fetching user:', err);
        }
      }
    }
  }));