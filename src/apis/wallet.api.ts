import api, { apiEndpoint } from '@/utils/api.util';
import { ApiResponse } from '@/types/api.response';

export interface WalletBalance {
  balance: number;
}

export interface WalletInfo {
  id: string;
  balance: number;
  created_at: string;
  updated_at: string;
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

// Get current user's wallet details
export async function getMyWallet(): Promise<ApiResponse<WalletInfo>> {
  const response = await api.get<ApiResponse<WalletInfo>>(
    `${apiEndpoint.WALLET}/my-wallet`
  );
  return response.data;
}

// Deduct balance from wallet
export async function deductBalance(amount: number): Promise<ApiResponse<WalletBalance>> {
  const response = await api.post<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/deduct-balance`,
    { amount }
  );
  return response.data;
}
