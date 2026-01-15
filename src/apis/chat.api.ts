import { Movie } from "@/types/api.types";
import api, { apiEndpoint } from "@/utils/api.util";

export type BotMessageReplyResponse =
  | { status: "success"; data: { botMessage: { message: string } } }
  | { status: "error"; error: { code?: string; message: string } };

export interface ChatMovieResponse {
  userMessage: string;
  response: string;
  relatedMovies: Movie[];
  intent: string;
}

export async function sendChatMessage(
  message: string
): Promise<ChatMovieResponse> {
  const response = await api.post<ChatMovieResponse>(`/api/ai/chat/movie`, {
    message,
  });
  return response.data;
}
