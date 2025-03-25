import api from "@/utils/api.util";
import { User } from "@/zustand/auth.store";

const fetchUser = async (): Promise<User> => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (error) {
    throw error;
  }
}

export {
  fetchUser
}