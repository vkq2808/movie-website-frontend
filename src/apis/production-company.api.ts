import api from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface ProductionCompany {
  id: string;
  name: string;
  origin_country?: string;
  logo_path?: string | null;
}

export interface CompanyMovie {
  id: string;
  title: string;
  poster_url?: string;
}

// Listings
export const listCompanies = async (params?: { page?: number; limit?: number }): Promise<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>> => {
  const res = await api.get<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>>('/production-companies', { params });
  return res.data;
};

export const getPopularCompanies = async (params?: { page?: number; limit?: number }): Promise<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>> => {
  const res = await api.get<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>>('/production-companies/popular', { params });
  return res.data;
};

export const searchCompanies = async (q: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>> => {
  const res = await api.get<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>>('/production-companies/search', { params: { q, ...(params || {}) } });
  return res.data;
};

export const getCompaniesByCountry = async (country: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>> => {
  const res = await api.get<ApiResponse<{ companies: ProductionCompany[]; total: number; page: number; limit: number; hasMore: boolean }>>(`/production-companies/by-country/${encodeURIComponent(country)}`, { params });
  return res.data;
};

export const getCompanyById = async (id: string): Promise<ApiResponse<ProductionCompany>> => {
  const res = await api.get<ApiResponse<ProductionCompany>>(`/production-companies/${id}`);
  return res.data;
};

export const getCompanyMovies = async (id: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ movies: CompanyMovie[]; total: number; page: number; limit: number; hasMore: boolean }>> => {
  const res = await api.get<ApiResponse<{ movies: CompanyMovie[]; total: number; page: number; limit: number; hasMore: boolean }>>(`/production-companies/${id}/movies`, { params });
  return res.data;
};

// Initialize data
export const initializeCompanies = async (): Promise<ApiResponse<{ message?: string }>> => {
  const res = await api.post<ApiResponse<{ message?: string }>>('/production-companies/initialize', {});
  return res.data;
};

export const initializeCompaniesFromMovies = async (): Promise<ApiResponse<{ message?: string }>> => {
  const res = await api.post<ApiResponse<{ message?: string }>>('/production-companies/initialize-from-movies', {});
  return res.data;
};

// CRUD (if supported on backend)
export const createCompany = async (payload: { name: string; origin_country?: string }): Promise<ApiResponse<ProductionCompany>> => {
  const res = await api.post<ApiResponse<ProductionCompany>>('/production-companies', payload);
  return res.data;
};

export const updateCompany = async (id: string, payload: { name?: string; origin_country?: string }): Promise<ApiResponse<ProductionCompany>> => {
  const res = await api.put<ApiResponse<ProductionCompany>>(`/production-companies/${id}`, payload);
  return res.data;
};

export const deleteCompany = async (id: string): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(`/production-companies/${id}`);
  return res.data;
};

export const removeCompanyMovie = async (companyId: string, movieId: string): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(`/production-companies/${companyId}/movies/${movieId}`);
  return res.data;
};

export const productionCompanyApi = {
  listCompanies,
  getPopularCompanies,
  searchCompanies,
  getCompaniesByCountry,
  getCompanyById,
  getCompanyMovies,
  initializeCompanies,
  initializeCompaniesFromMovies,
  createCompany,
  updateCompany,
  deleteCompany,
  removeCompanyMovie,
};
