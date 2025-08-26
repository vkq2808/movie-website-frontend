import api, { apiEndpoint } from '@/utils/api.util';

export type BotMessageReplyResponse = {
  data?: {
    botMessage?: {
      message?: string;
    };
  };
  botMessage?: {
    message?: string;
  };
};

export async function sendChatMessage(message: string) {
  // Adjust endpoint as needed
  const response = await api.post<BotMessageReplyResponse>(`${apiEndpoint.CHAT ?? '/chat'}/send`, { message });
  return response.data;
}
