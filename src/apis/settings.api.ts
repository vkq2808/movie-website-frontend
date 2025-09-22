import api from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface PublicSettings {
  siteName?: string;
  siteDescription?: string;
  maintenanceMode?: boolean;
  defaultLanguage?: string;
}

export const getPublicSettings = async (): Promise<ApiResponse<PublicSettings>> => {
  const res = await api.get<ApiResponse<PublicSettings>>('/settings');
  return res.data;
};

export const settingsApi = {
  getPublicSettings,
};
