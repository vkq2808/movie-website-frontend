import api from "@/utils/api.util";
import { useState } from "react";

interface UseUploadAvatarReturn {
  uploadAvatar: (file: File) => Promise<{ avatarUrl: string }>;
  loading: boolean;
  error: string | null;
}

export function useUploadAvatar(): UseUploadAvatarReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post(`/user/me/avatar`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to upload avatar";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadAvatar,
    loading,
    error,
  };
}
