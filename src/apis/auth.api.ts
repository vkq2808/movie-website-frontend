import api, { apiEndpoint } from "@/utils/api.util";
import { User } from "@/zustand";
import { ApiResponse } from "@/types/api.response";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

const login = async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(`${apiEndpoint.AUTH}/login`, data);
  return response.data;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
};

const register = async (data: RegisterData): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.AUTH}/register`, data);
  return response.data;
}

export interface VerifyData {
  email: string;
  otp: string;
}

const verify = async (data: VerifyData): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(`${apiEndpoint.AUTH}/verify`, data);
  return response.data;
}

export interface ForgetPasswordData {
  email: string;
}

const forgetPassword = async (data: ForgetPasswordData): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.AUTH}/forget-password`, data);
  return response.data;
}

export interface ResetPasswordData {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const resetPassword = async (data: ResetPasswordData): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.AUTH}/reset-password`, data);
  return response.data;
}

export interface ResendOtpData {
  email: string;
}

const resendOTP = async (data: ResendOtpData): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.AUTH}/resend-otp`, data);
  return response.data;
}

export const authApi = {
  login,
  register,
  verify,
  forgetPassword,
  resetPassword,
  resendOTP,
};