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

export interface PaymentRecord {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_type: string;
  reference_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentRecord[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

export interface WalletSummary {
  current_balance: number;
  total_topups: number;
  total_deductions: number;
  transaction_count: number;
  recent_transactions: PaymentRecord[];
}

// Get user's wallet balance
export async function getWalletBalance(): Promise<ApiResponse<WalletBalance>> {
  const response = await api.get<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/balance`
  );
  return response.data;
}

// Add balance to wallet (for testing purposes)
export async function addBalance(
  amount: number,
  paymentMethod?: string,
  referenceId?: string,
  description?: string
): Promise<ApiResponse<WalletBalance>> {
  const response = await api.post<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/add-balance`,
    {
      amount,
      payment_method: paymentMethod,
      reference_id: referenceId,
      description
    }
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
export async function deductBalance(
  amount: number,
  description?: string
): Promise<ApiResponse<WalletBalance>> {
  const response = await api.post<ApiResponse<WalletBalance>>(
    `${apiEndpoint.WALLET}/deduct-balance`,
    {
      amount,
      description
    }
  );
  return response.data;
}

// Get payment history
export async function getPaymentHistory(
  limit: number = 20,
  offset: number = 0
): Promise<ApiResponse<PaymentHistoryResponse>> {
  const response = await api.get<ApiResponse<PaymentHistoryResponse>>(
    `${apiEndpoint.WALLET}/payment-history`,
    {
      params: { limit, offset }
    }
  );
  return response.data;
}

// Get wallet summary
export async function getWalletSummary(): Promise<ApiResponse<WalletSummary>> {
  const response = await api.get<ApiResponse<WalletSummary>>(
    `${apiEndpoint.WALLET}/summary`
  );
  return response.data;
}
