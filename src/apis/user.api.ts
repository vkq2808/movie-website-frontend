import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface Profile {
  id: string;
  username: string;
  email: string;
  photo_url?: string | null;
  role?: 'admin' | 'user';
}

export interface UpdateProfileDto {
  username?: string;
  photo_url?: string | null;
  birthdate?: string;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}

export interface SessionInfo {
  id: string;
  device?: string;
  ip?: string;
  created_at: string;
  last_active_at?: string;
}

export const getMe = async (): Promise<ApiResponse<Profile>> => {
  const res = await api.get<ApiResponse<Profile>>(`${apiEndpoint.AUTH}/me`);
  return res.data;
};

export const updateProfile = async (dto: UpdateProfileDto): Promise<ApiResponse<Profile>> => {
  const res = await api.patch<ApiResponse<Profile>>(`${apiEndpoint.AUTH}/profile`, dto);
  return res.data;
};

export const changePassword = async (dto: ChangePasswordDto): Promise<ApiResponse<null>> => {
  const res = await api.patch<ApiResponse<null>>(`${apiEndpoint.AUTH}/change-password`, dto);
  return res.data;
};

export const logout = async (refresh_token?: string): Promise<ApiResponse<{ message?: string }>> => {
  const res = await api.post<ApiResponse<{ message?: string }>>(`${apiEndpoint.AUTH}/logout`, refresh_token ? { refresh_token } : {});
  return res.data;
};

export const logoutAll = async (): Promise<ApiResponse<{ message?: string }>> => {
  const res = await api.post<ApiResponse<{ message?: string }>>(`${apiEndpoint.AUTH}/logout-all`, {});
  return res.data;
};

export const getSessions = async (): Promise<ApiResponse<SessionInfo[]>> => {
  const res = await api.get<ApiResponse<SessionInfo[]>>(`${apiEndpoint.AUTH}/sessions`);
  return res.data;
};

export const deactivateAccount = async (reason?: string): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(`${apiEndpoint.AUTH}/deactivate`, { data: reason ? { reason } : {} });
  return res.data;
};

export const userApi = {
  getMe,
  updateProfile,
  changePassword,
  logout,
  logoutAll,
  getSessions,
  deactivateAccount,
};

