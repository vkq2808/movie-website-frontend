// services/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Định nghĩa kiểu cho đối tượng User
export interface User {
  _id: string;
  email: string;
  username: string;
  age: number;
  photoUrl?: string;
  role: string;
}

// Kiểu cho response của auth
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Kiểu cho thông tin đăng nhập
export interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL, // thay đổi theo API của bạn
    // Ví dụ: thêm token nếu cần, bạn có thể cấu hình prepareHeaders ở đây
    prepareHeaders: (headers, { getState }) => {
      // Nếu đã có token lưu trong store, thêm vào header cho các request khác
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint đăng nhập (login)
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    // (Tùy chọn) Endpoint lấy thông tin người dùng sau khi đã đăng nhập
    getProfile: builder.query<User, void>({
      query: () => 'auth/profile',
    }),
  }),
});

// Export hook tự động tạo ra từ endpoint
export const { useLoginMutation, useGetProfileQuery } = authApi;