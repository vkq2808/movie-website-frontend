import api, { apiEndpoint } from '@/utils/api.util';

export interface WalletBalance {
  balance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get user's wallet balance
export async function getWalletBalance(): Promise<ApiResponse<WalletBalance>> {
  const response = await api.get<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/balance`
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch wallet balance');
  }

  return response.data;
}

// Add balance to wallet (for testing purposes)
export async function addBalance(amount: number): Promise<ApiResponse<WalletBalance>> {
  const response = await api.post<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/add-balance`,
    { amount }
  );

  if (response.status !== 200) {
    throw new Error('Failed to add balance');
  }

  return response.data;
}
