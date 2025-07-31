import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface WalletBalance {
  balance: number;
}

// Get user's wallet balance
export async function getWalletBalance(): Promise<ApiResponse<WalletBalance>> {
  const response = await api.get<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/balance`
  );
  return response.data;
}

// Add balance to wallet (for testing purposes)
export async function addBalance(amount: number): Promise<ApiResponse<WalletBalance>> {
  const response = await api.post<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/add-balance`,
    { amount }
  );
  return response.data;
}
