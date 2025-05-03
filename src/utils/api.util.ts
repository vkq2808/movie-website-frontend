// utils/api.util.ts

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const apiEnpoint = {
  MOVIE: '/movie',
  GENRE: '/genre',
  IMAGE: '/image',
  AUTH: '/auth',
  USER: '/user',
}

// Mở rộng interface InternalAxiosRequestConfig để thêm thuộc tính _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor cho request: khởi tạo headers nếu chưa có và thêm access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || {};
    const token = JSON.parse(localStorage.getItem('auth') as string)?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.request.use((req) => {
  console.log('Method:', req.method?.toUpperCase()); // method (GET, POST, PUT, ...)
  console.log('URL:', req.url); // URL của request
  return req;
});

// Interceptor cho response để xử lý lỗi 401 và tự động refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      return new Promise((resolve, reject) => {
        axios.post(`${baseURL}/auth/refresh-token`, { refreshToken })
          .then(({ data }) => {
            const oldAuth = JSON.parse(localStorage.getItem('auth') as string);
            localStorage.setItem('auth', JSON.stringify({ ...oldAuth, accessToken: data.accessToken, refreshToken: data.refreshToken }));
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            processQueue(null, data.accessToken);
            resolve(axios(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
