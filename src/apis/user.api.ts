import api, { apiEndpoint } from "@/utils/api.util";
import { User } from "@/zustand";

const fetchUser = async (): Promise<User> => {
  try {
    const res = await api.get(`${apiEndpoint.AUTH}/me`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export {
  fetchUser
}