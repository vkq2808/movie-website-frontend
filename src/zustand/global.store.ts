import { create } from "zustand";

export interface GlobalStore {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoading: true,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));