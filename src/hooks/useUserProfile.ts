import { useState, useEffect } from "react";
import { User } from "@/types/api.types";
import api from "@/utils/api.util";

interface UseUserProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/user/me`, {
        withCredentials: true,
      });
      setUser(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchProfile,
  };
}
