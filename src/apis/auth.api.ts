import api from "@/utils/api.util";
import { User } from "@/zustand/auth.store";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const login = async (data: LoginData) => {
  return api.post<LoginResponse>('/auth/login', data);
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
};

const register = async (data: RegisterData) => {
  return api.post('/auth/register', data);
}

export interface VerifyData {
  email: string;
  otp: string;
}

const verify = async (data: VerifyData) => {
  return api.post(`/auth/verify`, data);
}

export interface ForgetPasswordData {
  email: string;
}

const forgetPassword = async (data: ForgetPasswordData) => {
  return api.post('/auth/forget-password', data);
}

export interface ResetPasswordData {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const resetPassword = async (data: ResetPasswordData) => {
  return api.post(`/auth/reset-password`, data);
}

export const authApi = {
  login,
  register,
  verify,
  forgetPassword,
  resetPassword,
};