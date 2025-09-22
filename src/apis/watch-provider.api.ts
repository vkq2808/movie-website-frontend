import api from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface WatchProvider {
  id: string;
  provider_name: string;
  slug: string;
}

export const getAllProviders = async (): Promise<ApiResponse<WatchProvider[]>> => {
  const res = await api.get<ApiResponse<WatchProvider[]>>('/watch-providers/providers');
  return res.data;
};

export const initializeProviders = async (): Promise<ApiResponse<{ count: number; providers: Array<{ id: string; name: string; slug: string }> }>> => {
  const res = await api.post<ApiResponse<{ count: number; providers: Array<{ id: string; name: string; slug: string }> }>>('/watch-providers/providers/initialize', {});
  return res.data;
};

export const watchProviderApi = {
  getAllProviders,
  initializeProviders,
};
