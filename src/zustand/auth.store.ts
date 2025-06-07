import { create } from 'zustand';
import { persistNSync } from 'persist-and-sync';

export interface AuthStore {
  auth: {
    accessToken: string | undefined;
    refreshToken: string | undefined;
  },
  setAuth: ({ accessToken, refreshToken }: { accessToken: string | undefined, refreshToken: string | undefined }) => void;
  setToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  persistNSync((set) => ({
    auth: {
      accessToken: undefined,
      refreshToken: undefined,
    }, setAuth: ({ accessToken, refreshToken }) => {
      console.log('setAuth called with:', { accessToken, refreshToken });
      // Handle case where accessToken or refreshToken might be null or undefined
      if (!accessToken && !refreshToken) {
        console.warn('Both accessToken and refreshToken are empty in setAuth');
      }
      set({
        auth: {
          accessToken: accessToken || undefined,
          refreshToken: refreshToken || undefined
        }
      });
    },
    setToken: (accessToken) => set((state) => ({ auth: { ...state.auth, accessToken } })),
    logout: () => set({ auth: { accessToken: undefined, refreshToken: undefined } }),
  }), { name: 'auth' }
  ));