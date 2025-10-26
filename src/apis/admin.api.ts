import api, { apiEndpoint } from "@/utils/api.util";
import { ApiResponse } from "@/types/api.response";
import { MovieStatus, Role } from "@/constants/enum";


export interface AdminMovie {
  id: string;
  status: MovieStatus;
  genres: AdminGenre[];
  title: string;
  overview: string;
  original_language: AdminLanguage;
  production_companies: AdminProductionCompany[];
  price: number;

  backdrops: {
    url: string;
    alt: string;
  }[];
  posters: {
    url: string;
    alt: string;
  }[];
  keywords: AdminKeyword[];
  spoken_languages: AdminLanguage[];
  cast: AdminCast[];
  crew: AdminCrew[];
  videos: AdminVideo[];

  popularity: number;
  vote_average: number;
  vote_count: number;
  budget: number;
  revenue: number;
  runtime: number;
  adult: boolean;
  purchases: AdminPurchase[];
  original_id: number;
  release_date: string;


  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AdminVideo {
  id: string;
  name?: string;
  key: string;
  site: string; // "YouTube" hoặc "Vimeo"
  type: string; // "Trailer" | "Featurette" | "Clip" ...
  official: boolean;
}

export interface AdminMoviePerson {
  id: string;
  person: AdminPerson;
}

export interface AdminCast extends AdminMoviePerson {
  character?: string;
  order?: number;
}

export interface AdminCrew extends AdminMoviePerson {
  job?: string;
  department: string;
}

export interface AdminPerson {
  id: string;
  name: string;
  profile_image?: {
    url: string;
    alt: string;
  };
  gender: number;
  adult: boolean;
}

export interface AdminPurchase {
  id: string;
  user: Partial<AdminUser>;
  movie: Partial<AdminMovie>;
  purchase_price: number;
  purchased_at: string;
  created_at: string;
  updated_at: string;
}

export interface AdminKeyword {
  id: string;
  name: string;
}

export interface AdminLanguage {
  id: string;
  name: string;
  english_name: string;
  iso_639_1: string;
}

export interface AdminProductionCompany {
  id: string;
  name: string;
}

export interface AdminGenre {
  id: string;
  names: {
    iso_639_1: string;
    name: string;
  }[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  created_at: string;
  status?: 'active' | 'inactive';
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalViews: number;
  newUsersThisWeek: number;
  viewsToday: number;
  viewsThisMonth: number;
  viewTrends: { date: string; views: number }[];
  topMovies: { id: string; title: string; views: number; thumbnail: string }[];
  system: {
    storageUsedGB: number;
    totalStorageGB: number;
    activeServers: number;
    recentErrors: { id: string; message: string; timestamp: string }[];
  };
  recentActivity: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }[];
  genreDistribution: { names: { iso_639_1: string; name: string; }[]; value: number }[];
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
  /** Tiêu đề phim */
  title: string;

  /** Mô tả phim */
  overview: string;

  /** Ngày phát hành (YYYY-MM-DD) */
  release_date: string;

  /** Ngôn ngữ gốc của phim */
  original_language: AdminLanguage;

  /** Trạng thái phim (draft, published, ...) */
  status: MovieStatus;

  /** Thời lượng (phút) */
  runtime?: number;

  /** Ngân sách sản xuất */
  budget?: number;

  /** Doanh thu */
  revenue?: number;

  /** Giá bán hoặc thuê */
  price?: number;

  /** Ảnh nền (backdrops) */
  backdrops?: {
    url: string;
    alt?: string;
  }[];

  posters?: {
    url: string;
    alt?: string;
  }[];

  /** Danh sách thể loại */
  genres: AdminGenre[]

  /** Danh sách từ khóa */
  keyword_ids?: string[];

  /** Danh sách ngôn ngữ có trong phim */
  spoken_languages: AdminLanguage[];

  /** Danh sách công ty sản xuất */
  production_companies: AdminProductionCompany[];

  /** Danh sách diễn viên */
  cast?: AdminCast[]

  /** Danh sách ekip */
  crew?: AdminCrew[]
}

export interface UpdateMovieData extends Partial<CreateMovieData> {
  id?: string;
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
  status?: MovieStatus | 'all';
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
  // Backend exposes public GET /movie/:id which admin can reuse
  const response = await api.get(`${apiEndpoint.MOVIE}/${id}`);
  return response.data;
};

const createMovie = async (data: CreateMovieData): Promise<ApiResponse<AdminMovie>> => {
  // Backend: POST /movie
  const response = await api.post(`${apiEndpoint.MOVIE}`, data);
  return response.data;
};

const updateMovie = async (id: string, data: UpdateMovieData): Promise<ApiResponse<AdminMovie>> => {
  // Backend: POST /movie/:id
  const response = await api.put<ApiResponse<AdminMovie>>(`${apiEndpoint.MOVIE}/${id}`, data);
  return response.data;
};

const softDeleteMovie = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/soft-delete`);
  return response.data;
};

const restoreMovie = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/restore`);
  return response.data;
};

// Alias for UI: hard delete is not supported; use soft delete under the hood
const deleteMovie = async (id: string): Promise<ApiResponse<null>> => {
  return softDeleteMovie(id);
};

// Movie relations management (Genres)
const setMovieGenres = async (id: string, genre_ids: number[]): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/genres/set`, { genre_ids });
  return response.data;
};
const addMovieGenre = async (id: string, genre_id: number): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/genres/add`, { genre_id });
  return response.data;
};
const removeMovieGenre = async (id: string, genre_id: number): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/genres/remove`, { genre_id });
  return response.data;
};

// Production companies
const setMovieProductionCompanies = async (id: string, company_ids: number[]): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/production-companies/set`, { company_ids });
  return response.data;
};
const addMovieProductionCompany = async (id: string, company_id: number): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/production-companies/add`, { company_id });
  return response.data;
};
const removeMovieProductionCompany = async (id: string, company_id: number): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/production-companies/remove`, { company_id });
  return response.data;
};

// Keywords
const getMovieKeywords = async (query: string): Promise<ApiResponse<AdminKeyword[]>> => {
  const res = await api.get<ApiResponse<AdminKeyword[]>>(`${apiEndpoint.KEYWORD}/search?query=${encodeURIComponent(query)}`);
  return res.data;
}

const setMovieKeywords = async (id: string, keyword_ids: number[]): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/keywords/set`, { keyword_ids });
  return response.data;
};
const addMovieKeyword = async (id: string, keyword_id: number): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/keywords/add`, { keyword_id });
  return response.data;
};
const removeMovieKeyword = async (id: string, keyword_id: number): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/keywords/remove`, { keyword_id });
  return response.data;
};

// Languages
const addLanguageToMovie = async (id: string, language_iso_code: string): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/languages/add`, { language_iso_code });
  return response.data;
};
const setSpokenLanguages = async (id: string, language_codes: string[]): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/languages/set`, { language_codes });
  return response.data;
};
const removeLanguageFromMovie = async (id: string, language_iso_code: string): Promise<ApiResponse<AdminMovie>> => {
  const response = await api.post(`${apiEndpoint.MOVIE}/${id}/languages/remove`, { language_iso_code });
  return response.data;
};

// Finding Person
const getPersons = async (query: string): Promise<ApiResponse<AdminPerson[]>> => {
  const response = await api.get<ApiResponse<AdminPerson[]>>(`${apiEndpoint.PERSON}/search?query=${query}`);
  return response.data;
}

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
export const getAdminStats = async (): Promise<ApiResponse<AdminStats>> => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      // ✅ Fallback: nếu backend chưa có endpoint /admin/stats
      const fallback: ApiResponse<AdminStats> = {
        success: true,
        message: "Admin stats endpoint not available; using default mock data",
        data: {
          totalUsers: 0,
          totalMovies: 0,
          totalViews: 0,
          newUsersThisWeek: 0,
          viewsToday: 0,
          viewsThisMonth: 0,
          viewTrends: [],
          topMovies: [],
          system: {
            storageUsedGB: 0,
            totalStorageGB: 0,
            activeServers: 0,
            recentErrors: [],
          },
          recentActivity: [],
          genreDistribution: [],
        },
      };
      return fallback;
    }

    // ❌ Nếu lỗi khác (500, 401, ...), ném lỗi ra ngoài để component xử lý
    throw error;
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

/**
 * Lấy danh sách tất cả thể loại (Genres)
 */
export const getGenres = async (): Promise<ApiResponse<AdminGenre[]>> => {
  const response = await api.get(`${apiEndpoint.GENRE}`);
  return response.data;
};

/**
 * Tạo mới một thể loại
 * @param data Danh sách tên theo ngôn ngữ (VD: English, Vietnamese)
 */
export const createGenre = async (
  data: { names: { name: string; iso_639_1: string }[] }
): Promise<ApiResponse<AdminGenre>> => {
  const response = await api.post(`${apiEndpoint.GENRE}`, data);
  return response.data;
};

/**
 * Cập nhật thể loại theo id
 * @param id ID của thể loại cần cập nhật
 * @param data Danh sách tên mới theo ngôn ngữ
 */
export const updateGenre = async (
  id: string,
  data: { names: { name: string; iso_639_1: string }[] }
): Promise<ApiResponse<AdminGenre>> => {
  const response = await api.put(`${apiEndpoint.GENRE}/${id}`, data);
  return response.data;
};

/**
 * Xóa thể loại theo id
 * @param id ID của thể loại
 */
export const deleteGenre = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${apiEndpoint.GENRE}/${id}`);
  return response.data;
};

/**
 * Gọi API backend để xoá toàn bộ thể loại và đồng bộ lại từ TMDB
 */
export const refreshGenres = async (): Promise<ApiResponse<null>> => {
  const response = await api.post(`${apiEndpoint.GENRE}/refresh`);
  return response.data;
};

const findLanguages = async (query: string): Promise<ApiResponse<AdminLanguage[]>> => {
  const response = await api.get<ApiResponse<AdminLanguage[]>>(`${apiEndpoint.LANGUAGE}/search?query=${query}`);
  return response.data;
}

const getLanguages = async (): Promise<ApiResponse<AdminLanguage[]>> => {
  const response = await api.get<ApiResponse<AdminLanguage[]>>(`${apiEndpoint.LANGUAGE}`);
  return response.data;
}

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
export const uploadImage = async (file: File, key: string): Promise<ApiResponse<{
  url: string;
}>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', key);

  // Backend: POST /image/poster/upload
  const response = await api.post(`${apiEndpoint.IMAGE}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteImage = async (url: string): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.IMAGE}/delete`, { url });
  return response.data;
}

// Activity Log APIs
const getActivityLogs = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  startstring?: string;
  endstring?: string;
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
  softDeleteMovie,
  restoreMovie,
  deleteMovie,

  // Movie relations
  setMovieGenres,
  addMovieGenre,
  removeMovieGenre,
  setMovieProductionCompanies,
  addMovieProductionCompany,
  removeMovieProductionCompany,

  getMovieKeywords,
  setMovieKeywords,
  addMovieKeyword,
  removeMovieKeyword,

  addLanguageToMovie,
  setSpokenLanguages,
  removeLanguageFromMovie,

  getPersons,


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

  // Languages
  findLanguages,
  getLanguages,

  // Settings
  getSettings,
  updateSettings,

  // Activity
  getActivityLogs,

  // System
  getSystemHealth,
};
