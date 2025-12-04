import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse, PaginatedApiResponse } from '@/types/api.response';

export interface FeedbackItem {
  id: string;
  feedback: string;
  created_at: string;
  updated_at: string;
  user: { id: string; username: string; photo_url?: string | null };
}

export async function createComment(movieId: string, feedback: string): Promise<FeedbackItem> {
  const res = await api.post<FeedbackItem>(`${apiEndpoint.FEEDBACK}/${movieId}`, { feedback });
  return res.data;
}

export async function getComments(movieId: string, page = 1, limit = 10): Promise<PaginatedApiResponse<FeedbackItem>> {
  const res = await api.get<PaginatedApiResponse<FeedbackItem>>(`${apiEndpoint.FEEDBACK}/movie/${movieId}`, { params: { page, limit } });
  return res.data;
}

export async function updateComment(id: string, feedback: string): Promise<FeedbackItem> {
  const res = await api.patch<FeedbackItem>(`${apiEndpoint.FEEDBACK}/${id}`, { feedback });
  return res.data;
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`${apiEndpoint.FEEDBACK}/${id}`);
}
