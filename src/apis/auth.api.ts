import api, { apiEnpoint } from "@/utils/api.util";
import { User } from "@/zustand";

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
  return api.post<LoginResponse>(`${apiEnpoint.AUTH}/login`, data);
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
};

const register = async (data: RegisterData) => {
  return api.post(`${apiEnpoint.AUTH}/register`, data);
}

export interface VerifyData {
  email: string;
  otp: string;
}

const verify = async (data: VerifyData) => {
  return api.post(`${apiEnpoint.AUTH}/verify`, data);
}

export interface ForgetPasswordData {
  email: string;
}

const forgetPassword = async (data: ForgetPasswordData) => {
  return api.post(`${apiEnpoint.AUTH}/forget-password`, data);
}

export interface ResetPasswordData {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const resetPassword = async (data: ResetPasswordData) => {
  return api.post(`${apiEnpoint.AUTH}/reset-password`, data);
}

export const authApi = {
  login,
  register,
  verify,
  forgetPassword,
  resetPassword,
};