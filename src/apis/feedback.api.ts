import api, { apiEndpoint, handleApiError } from '@/utils/api.util';
import { ApiResponse, PaginatedApiResponse } from '@/types/api.response';

export interface FeedbackUser {
  id: string;
  fullName?: string | null;
  avatar?: string | null;
}

export interface FeedbackMovie {
  id: string;
  title: string;
}

export interface FeedbackItem {
  id: string;
  feedback: string;
  created_at: string;
  updated_at: string;
  user: FeedbackUser | null;
  movie?: FeedbackMovie | null;
  status?: 'active' | 'hidden' | 'deleted';
}

export interface AdminFeedback extends FeedbackItem {
  status: 'active' | 'hidden' | 'deleted';
  movie: FeedbackMovie;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

const mapAndThrow = (error: any, context?: string) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || error?.message || 'API error';
  if (status === 401) throw new UnauthorizedError(message);
  if (status === 403) throw new ForbiddenError(message);
  if (status === 409) throw new ConflictError(message);
  if (status === 404) throw new NotFoundError(message);
  // Fallback to generic mapping (logs & friendly messages)
  throw handleApiError(error, context);
};

// User Feedback APIs

export async function createComment(movieId: string, feedback: string): Promise<FeedbackItem> {
  try {
    const res = await api.post<FeedbackItem>(`${apiEndpoint.FEEDBACK}/${movieId}`, { feedback });
    return res.data as FeedbackItem;
  } catch (error) {
    mapAndThrow(error, 'createComment');
    throw error;
  }
}

export async function getComments(movieId: string, page = 1, limit = 10): Promise<PaginatedApiResponse<FeedbackItem>> {
  try {
    const res = await api.get<PaginatedApiResponse<FeedbackItem>>(`${apiEndpoint.FEEDBACK}/movie/${movieId}`, { params: { page, limit } });
    return res.data;
  } catch (error) {
    mapAndThrow(error, 'getComments');
    throw error;
  }
}

export async function updateComment(id: string, feedback: string): Promise<FeedbackItem> {
  try {
    const res = await api.patch<FeedbackItem>(`${apiEndpoint.FEEDBACK}/${id}`, { feedback });
    return res.data as FeedbackItem;
  } catch (error) {
    mapAndThrow(error, 'updateComment');
    throw error;
  }
}

export async function deleteComment(id: string): Promise<void> {
  try {
    await api.delete(`${apiEndpoint.FEEDBACK}/${id}`);
  } catch (error) {
    mapAndThrow(error, 'deleteComment');
    throw error;
  }
}

// Admin Feedback APIs

export async function adminGetFeedbacks(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'hidden' | 'all';
}): Promise<ApiResponse<{
  feedbacks: AdminFeedback[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}>> {
  try {
    const res = await api.get<ApiResponse<{
      feedbacks: AdminFeedback[];
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
    }>>(`/admin${apiEndpoint.FEEDBACK}`, { params });
    return res.data;
  } catch (error) {
    mapAndThrow(error, 'adminGetFeedbacks');
    throw error;
  }
}

export async function adminHideFeedback(id: string): Promise<ApiResponse<AdminFeedback>> {
  try {
    const res = await api.post<ApiResponse<AdminFeedback>>(`/admin${apiEndpoint.FEEDBACK}/${id}/hide`);
    return res.data;
  } catch (error) {
    mapAndThrow(error, 'adminHideFeedback');
    throw error;
  }
}

export async function adminUnhideFeedback(id: string): Promise<ApiResponse<AdminFeedback>> {
  try {
    const res = await api.post<ApiResponse<AdminFeedback>>(`/admin${apiEndpoint.FEEDBACK}/${id}/unhide`);
    return res.data;
  } catch (error) {
    mapAndThrow(error, 'adminUnhideFeedback');
    throw error;
  }
}

export async function adminDeleteFeedback(id: string): Promise<ApiResponse<null>> {
  try {
    const res = await api.delete<ApiResponse<null>>(`/admin${apiEndpoint.FEEDBACK}/${id}`);
    return res.data;
  } catch (error) {
    mapAndThrow(error, 'adminDeleteFeedback');
    throw error;
  }
}

export const feedbackApi = {
  // User APIs
  createComment,
  getComments,
  updateComment,
  deleteComment,
  // Admin APIs
  adminGetFeedbacks,
  adminHideFeedback,
  adminUnhideFeedback,
  adminDeleteFeedback,
};

