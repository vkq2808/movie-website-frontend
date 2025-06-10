// utils/api.util.ts

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const apiEndpoint = {
  MOVIE: '/movie',
  GENRE: '/genre',
  IMAGE: '/image',
  AUTH: '/auth',
  USER: '/user',
  LANGUAGE: '/language',
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
    const savedAuth = localStorage.getItem('auth');
    const token = savedAuth ? JSON.parse(savedAuth).access_token : null;

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
      const refresh_token = localStorage.getItem('auth');
      const token = refresh_token ? JSON.parse(refresh_token).refresh_token : null;

      return new Promise((resolve, reject) => {
        axios.post(`${baseURL}/auth/refresh-token`, { refresh_token })
          .then(({ data }) => {
            const oldAuth = JSON.parse(localStorage.getItem('auth') as string);
            localStorage.setItem('auth', JSON.stringify({ ...oldAuth, access_token: data.access_token, refresh_token: data.refresh_token }));
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
            processQueue(null, data.access_token);
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
