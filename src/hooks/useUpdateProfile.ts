import api from "@/utils/api.util";
import { useState } from "react";

interface UpdateProfilePayload {
  username?: string;
  birthdate?: string;
}

interface UseUpdateProfileReturn {
  updateProfile: (payload: UpdateProfilePayload) => Promise<any>;
  loading: boolean;
  error: string | null;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch(`/user/me`, payload);
      return response.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
  };
}
