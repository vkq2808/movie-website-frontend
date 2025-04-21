import api, { apiEnpoint } from "@/utils/api.util";
import { create } from "zustand";
import { User } from "./types";

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
      const res = await api.get<User>(`${apiEnpoint.AUTH}/me`);
      set({ user: res.data });
    } catch (error) {
      console.error(error);
    }
  }
}));

