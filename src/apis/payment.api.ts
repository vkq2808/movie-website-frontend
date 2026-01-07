import api, { apiEndpoint } from "@/utils/api.util";
import { ApiResponse } from "@/types/api.response";

export interface CheckoutRequest {
  amount: number;
  currency: "VND" | "USD";
  payment_method: "manual" | "momo" | "vnpay" | "bank";
  return_url: string;
}

export interface CheckoutResponse {
  payment_id: string;
  payment_url: string | null;
  amount: number;
  currency: string;
  payment_method: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: "pending" | "success" | "fail";
  transaction_type: string;
  reference_id?: string;
  description?: string;
  payment_url?: string;
  vnp_transaction_id?: string;
  vnp_order_id?: string;
  created_at: string;
  updated_at: string;
}

export async function checkout(
  data: CheckoutRequest
): Promise<ApiResponse<CheckoutResponse>> {
  const response = await api.post<ApiResponse<CheckoutResponse>>(
    `${apiEndpoint.PAYMENT}/checkout`,
    data
  );
  return response.data;
}

export async function getPayment(
  paymentId: string
): Promise<ApiResponse<PaymentResponse>> {
  const response = await api.get<ApiResponse<PaymentResponse>>(
    `${apiEndpoint.PAYMENT}/${paymentId}`
  );
  return response.data;
}

export async function checkVnpaySignature(
  paymentId: string,
  params: Record<string, string | null>
) {
  const response = await api.get(
    `${apiEndpoint.PAYMENT}/return/vnpay/${paymentId}`,
    { params }
  );
  return response.data;
}
