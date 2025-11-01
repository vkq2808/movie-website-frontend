import api, { apiEndpoint } from "@/utils/api.util";
import { User } from "@/types/api.types";
import { ApiResponse } from "@/types/api.response";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user?: User;
}

const login = async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>(`${apiEndpoint.AUTH}/login`, data);
    return response.data;
  } catch {
    return {
      data: {
        access_token: "",
        refresh_token: "",
        user: undefined
      },
      message: "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu.",
      success: false
    }
  }
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; // client-side only, will not be sent to backend
  birthdate: string; // YYYY-MM-DD
};

const register = async (data: RegisterData): Promise<ApiResponse<null>> => {
  // Send only whitelisted fields expected by backend DTO
  const payload = {
    username: data.username,
    email: data.email,
    password: data.password,
    birthdate: data.birthdate,
  };
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.AUTH}/register`, payload);
  return response.data;
}

export interface VerifyData {
  email: string;
  otp: string;
}

const verify = async (data: VerifyData): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.AUTH}/verify`, data);
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
  otp_type: 'VERIFY_EMAIL' | 'RESET_PASSWORD';
}

const resendOTP = async (data: ResendOtpData): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`${apiEndpoint.AUTH}/resend-otp`, data);
  return response.data;
}

const checkEmail = async (email: string): Promise<ApiResponse<{ available: boolean }>> => {
  const response = await api.get<ApiResponse<{ available: boolean }>>(`${apiEndpoint.AUTH}/check-email`, { params: { email } });
  return response.data;
}

const checkUsername = async (username: string): Promise<ApiResponse<{ available: boolean }>> => {
  const response = await api.get<ApiResponse<{ available: boolean }>>(`${apiEndpoint.AUTH}/check-username`, { params: { username } });
  return response.data;
}

export const authApi = {
  login,
  register,
  verify,
  forgetPassword,
  resetPassword,
  resendOTP,
  checkEmail,
  checkUsername,
};