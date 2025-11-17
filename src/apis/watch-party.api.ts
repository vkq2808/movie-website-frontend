import { Movie } from '@/types/api.types';
import api from '@/utils/api.util';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export interface WatchPartyTicket {
  id: string;
  price: number;
  is_voucher?: boolean;
  description?: string;
  name: string;
}

export interface WatchPartyParticipant {
  id: string;
  username: string;
  avatar?: string;
}

export interface WatchParty {
  id: string;
  movie: Movie;
  start_time: string;
  end_time: string;
  is_featured: boolean;
  max_participants: number;
  status: 'upcoming' | 'ongoing' | 'finished';
  participant_count: number;
  participants?: WatchPartyParticipant[];
  has_purchased?: boolean;
  ticket?: WatchPartyTicket;
  created_at: string;
  updated_at: string;
}

export interface WatchPartyLog {
  id: string;
  event_type: 'message' | 'join' | 'leave' | 'play' | 'pause' | 'seek';
  content: string;
  real_time: string;
  event_time: number;
  user?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export interface PurchaseTicketResponse {
  success: boolean;
  message: string;
  data: {
    purchase_id: string;
    watch_party: WatchParty;
  };
}

export interface UserTicketPurchase {
  purchase_id: string;
  purchased_at: string;
  ticket: WatchPartyTicket;
  watch_party: WatchParty;
}


export interface WatchPartyLiveInfo {
  startTime: string;
  currentTime: number;
  chats: WatchPartyLog[];
  watchParty: WatchParty;
}

export const watchPartyApi = {
  async getAll(status?: string): Promise<WatchParty[]> {
    const params = status ? { status } : {};
    const response = await api.get(`watch-parties`, { params });
    return response.data;
  },

  async getById(id: string): Promise<WatchParty> {
    const response = await api.get(`watch-parties/${id}`);
    return response.data;
  },

  async getLiveInfo(id: string): Promise<WatchPartyLiveInfo> {
    const response = await api.get(`watch-parties/${id}/live`);
    return response.data;
  },

  async getEventLogs(partyId: string): Promise<WatchPartyLog[]> {
    const response = await api.get(`watch-parties/${partyId}/logs`);
    return response.data;
  },

  async getMyPurchases(): Promise<UserTicketPurchase[]> {
    const response = await api.get(`users/me/purchases`);
    return response.data?.data ?? response.data;
  },
};

export async function purchaseTicket(
  watchPartyId: string,
  ticketId?: string,
): Promise<PurchaseTicketResponse> {
  const payload = ticketId ? { ticket_id: ticketId } : {};
  const response = await api.post(
    `watch-parties/${watchPartyId}/purchase`,
    payload,
  );

  return response.data;
}
