import api, { apiEndpoint } from '@/utils/api.util';
import type { ApiResponse } from '@/types/api.response';

export enum VoucherType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
  FREE = 'FREE',
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: VoucherType;
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface UserVoucher {
  id: string;
  voucher: Voucher;
  used: boolean;
  assigned_at: string;
  used_at?: string;
}

// Get user's available vouchers
export async function getMyVouchers(): Promise<ApiResponse<Voucher[]>> {
  const response = await api.get<ApiResponse<Voucher[]>>(
    `${apiEndpoint.VOUCHER}/mine`
  );
  return response.data;
}

// Calculate discount based on voucher type
export function calculateDiscount(voucher: Voucher, originalPrice: number): number {
  switch (voucher.type) {
    case VoucherType.PERCENT:
      return (originalPrice * voucher.value) / 100;
    case VoucherType.FIXED:
      return Math.min(originalPrice, voucher.value);
    case VoucherType.FREE:
      return originalPrice;
    default:
      return 0;
  }
}

// Calculate final price after discount
export function calculateFinalPrice(originalPrice: number, discount: number): number {
  return Math.max(0, originalPrice - discount);
}