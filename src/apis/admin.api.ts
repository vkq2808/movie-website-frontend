import api, { apiEndpoint } from "@/utils/api.util";
import { ApiResponse } from "@/types/api.response";

// Admin Movie Management
export interface AdminMovie {
  id: string;
  title: string;
  description: string;
  release_date: string;
  poster_url?: string;
  trailer_url?: string;
  status: 'published' | 'draft';
  genres: AdminGenre[];
  vote_average: number;
  popularity: number;
  created_at: string;
  updated_at: string;
}

export interface AdminGenre {
  id: string;
  name: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
  avatar_url?: string;
  total_purchases: number;
  total_watch_time: number;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalViews: number;
  newUsersThisWeek: number;
  recentActivity: ActivityItem[];
  userGrowth: ChartData[];
  genreDistribution: ChartData[];
  mostWatchedMovies: PopularMovie[];
}

export interface ActivityItem {
  id: string;
  type: 'user_registration' | 'movie_added' | 'role_changed' | 'movie_deleted';
  description: string;
  timestamp: string;
  user?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PopularMovie {
  id: string;
  title: string;
  views: number;
}

export interface CreateMovieData {
  title: string;
  description: string;
  release_date: string;
  poster_url?: string;
  trailer_url?: string;
  status: 'published' | 'draft';
  genre_ids: string[];
  vote_average: number;
  popularity: number;
}

export interface UpdateMovieData extends Partial<CreateMovieData> {
  id: string;
}

export interface UpdateUserData {
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
}

// Movie Management APIs
const getMovies = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'published' | 'draft';
}): Promise<ApiResponse<{
  movies: AdminMovie[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}>> => {
  const response = await api.get(`${apiEndpoint.MOVIE}/admin`, { params });
  return response.data;
};

const getMovie = async (id: string): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.get(`${apiEndpoint.MOVIE}/admin/${id}`);
  return response.data;
};

const createMovie = async (data: CreateMovieData): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/admin`, data);
  return response.data;
};

const updateMovie = async (id: string, data: UpdateMovieData): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.put(`${apiEndpoint.MOVIE}/admin/${id}`, data);
  return response.data;
};

const deleteMovie = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${apiEndpoint.MOVIE}/admin/${id}`);
  return response.data;
};

// User Management APIs
const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'all' | 'admin' | 'user';
  status?: 'all' | 'active' | 'inactive';
}): Promise<ApiResponse<{
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}>> => {
  const response = await api.get(`${apiEndpoint.USER}/admin`, { params });
  return response.data;
};

const updateUser = async (id: string, data: UpdateUserData): Promise<ApiResponse<AdminUser>> => {
  const response = await api.put(`${apiEndpoint.USER}/admin/${id}`, data);
  return response.data;
};

const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${apiEndpoint.USER}/admin/${id}`);
  return response.data;
};

// Dashboard APIs
const getAdminStats = async (): Promise<ApiResponse<AdminStats>> => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) {
      // Fallback: backend does not expose /admin/stats yet
      const fallback: ApiResponse<AdminStats> = {
        success: true,
        message: 'Admin stats endpoint not available; using defaults',
        data: {
          totalUsers: 0,
          totalMovies: 0,
          totalViews: 0,
          newUsersThisWeek: 0,
          recentActivity: [],
          userGrowth: [],
          genreDistribution: [],
          mostWatchedMovies: [],
        },
      };
      return fallback;
    }
    throw err;
  }
};

const getTrendingMovies = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{
  movies: AdminMovie[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}>> => {
  const response = await api.get(`${apiEndpoint.RECOMMENDATIONS}/trending`, { params });
  return response.data;
};

// Genre Management APIs
const getGenres = async (): Promise<ApiResponse<AdminGenre[]>> => {
  const response = await api.get(`${apiEndpoint.GENRE}`);
  return response.data;
};

const createGenre = async (data: { name: string }): Promise<ApiResponse<AdminGenre>> => {
  const response = await api.post(`${apiEndpoint.GENRE}`, data);
  return response.data;
};

const updateGenre = async (id: string, data: { name: string }): Promise<ApiResponse<AdminGenre>> => {
  const response = await api.put(`${apiEndpoint.GENRE}/${id}`, data);
  return response.data;
};

const deleteGenre = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${apiEndpoint.GENRE}/${id}`);
  return response.data;
};

// System Settings APIs
export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultLanguage: string;
  maxFileSize: number;
  sessionTimeout: number;
  enableAnalytics: boolean;
  backupFrequency: string;
  logRetentionDays: number;
}

const getSettings = async (): Promise<ApiResponse<SystemSettings>> => {
  const response = await api.get('/admin/settings');
  return response.data;
};

const updateSettings = async (data: SystemSettings): Promise<ApiResponse<SystemSettings>> => {
  const response = await api.put('/admin/settings', data);
  return response.data;
};

// Image Upload API
const uploadImage = async (file: File, type: 'poster' | 'backdrop' | 'avatar'): Promise<ApiResponse<{
  url: string;
  public_id: string;
}>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post(`${apiEndpoint.IMAGE}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Activity Log APIs
const getActivityLogs = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<{
  logs: ActivityItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}>> => {
  const response = await api.get('/admin/activity-logs', { params });
  return response.data;
};

// System Health Check
const getSystemHealth = async (): Promise<ApiResponse<{
  database: 'connected' | 'disconnected';
  cache: 'running' | 'stopped';
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  lastBackup: string;
  uptime: number;
}>> => {
  const response = await api.get('/admin/health');
  return response.data;
};

export const adminApi = {
  // Movies
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,

  // Users
  getUsers,
  updateUser,
  deleteUser,

  // Dashboard
  getAdminStats,
  getTrendingMovies,

  // Genres
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,

  // Settings
  getSettings,
  updateSettings,

  // Images
  uploadImage,

  // Activity
  getActivityLogs,

  // System
  getSystemHealth,
};
