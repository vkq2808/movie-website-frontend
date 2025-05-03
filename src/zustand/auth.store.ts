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
      user: undefined
    },
    setAuth: (auth) => set({ auth }),
    setToken: (accessToken) => set((state) => ({ auth: { ...state.auth, accessToken } })),
    logout: () => set({ auth: { accessToken: undefined, refreshToken: undefined } }),
  }), { name: 'auth' }
  ));