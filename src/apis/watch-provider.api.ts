import api, { apiEndpoint } from '@/utils/api.util';
import type { ApiResponse } from '@/types/api.response';

export interface WatchProvider {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  display_priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InitializeProvidersResponse {
  count: number;
  providers: Array<{ id: string; name: string; slug: string }>;
}

export const getAllProviders = async (): Promise<ApiResponse<WatchProvider[]>> => {
  const res = await api.get<ApiResponse<WatchProvider[]>>(`${apiEndpoint.WATCH_PROVIDER}`);
  return res.data;
};

export const initializeProviders = async (): Promise<ApiResponse<InitializeProvidersResponse>> => {
  const res = await api.post<ApiResponse<InitializeProvidersResponse>>(
    `${apiEndpoint.WATCH_PROVIDER}/initialize`,
    {},
  );
  return res.data;
};

export const watchProviderApi = {
  getAllProviders,
  initializeProviders,
};
