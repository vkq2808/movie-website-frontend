import api, { apiEnpoint } from "@/utils/api.util";
import { User } from "@/zustand";

const fetchUser = async (): Promise<User> => {
  try {
    const res = await api.get(`${apiEnpoint.AUTH}/me`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export {
  fetchUser
}