import api, { apiEndpoint } from '@/utils/api.util';

export type BotMessageReplyResponse =
  | { status: 'success'; data: { botMessage: { message: string } } }
  | { status: 'error'; error: { code?: string; message: string } };

export async function sendChatMessage(message: string): Promise<BotMessageReplyResponse> {
  const response = await api.post<BotMessageReplyResponse>(`${apiEndpoint.CHAT ?? '/chat'}/send`, { message });
  return response.data;
}
