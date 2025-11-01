// utils/api.util.ts

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const apiEndpoint = {
  MOVIE: '/movie',
  MOVIE_PURCHASE: '/movie-purchases',
  WALLET: '/wallet',
  GENRE: '/genre',
  IMAGE: '/image',
  AUTH: '/auth',
  USER: '/user',
  LANGUAGE: '/language',
  RECOMMENDATIONS: '/recommendations',
  WATCH_HISTORY: '/watch-history',
  FEEDBACK: '/feedback',
  CHAT: '/chat',
  KEYWORD: '/keyword',
  PERSON: '/person',
  VIDEO: '/video',
  WATCH_PROVIDER: '/watch-provider',
}

// Mở rộng interface InternalAxiosRequestConfig để thêm thuộc tính __retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  __retry?: boolean;
  __requiresAuth?: boolean;
}

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:2808/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Important for cookie-based auth across origins: accept Set-Cookie and send cookies
  withCredentials: true,
});

// Helper: read cookie in browser
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
};

// On module load in browser, prime axios default Authorization from cookie
(() => {
  if (typeof window !== 'undefined') {
    try {
      const cookieToken = getCookie('access_token');
      if (cookieToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${cookieToken}`;
      }
    } catch {
      // ignore
    }
  }
})();

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

// Interceptor cho request: khởi tạo headers nếu chưa có và thêm access token (from cookie)
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    config.headers = config.headers || {};
    let token = '';
    try {
      if (typeof window !== 'undefined') {
        const cookieToken = getCookie('access_token');
        if (cookieToken) token = cookieToken;
      }
    } catch { /* ignore */ }

    if (token) {
      // Ensure standard header assignment compatible with Axios
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    // Add a flag to indicate if this request had auth when sent
    config.__requiresAuth = !!token;

    return config;
  },
  error => Promise.reject(error)
);

// Interceptor cho response để xử lý lỗi 401 và tự động refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 409 errors (Invalid Token)
    if (error.response?.status === 409) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest.__retry) {
      // If the request was made without auth initially, don't try to refresh
      if (!originalRequest.__requiresAuth) {
        return Promise.reject(new Error('Authentication required'));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers && token) {
              (originalRequest.headers as any)['Authorization'] = `Bearer ${token}`;
            }
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest.__retry = true;
      isRefreshing = true;
      return new Promise((resolve, reject) => {
        // Ask backend to refresh using cookie-based refresh token (use shared instance)
        api.post(`/auth/refresh-token`, {})
          .then((res) => {
            // Backend uses ResponseUtil.success => { success, message, data: { access_token, refresh_token, user } }
            const payload = res?.data?.data ?? res?.data;
            const newAccessToken = payload?.access_token;
            const newRefreshToken = payload?.refresh_token;

            const oldAuthRaw = localStorage.getItem('auth');
            const oldAuth = oldAuthRaw ? JSON.parse(oldAuthRaw) : {} as any;
            if (originalRequest.headers && newAccessToken) {
              (originalRequest.headers as any)['Authorization'] = `Bearer ${newAccessToken}`;
            }
            if (newAccessToken) {
              api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              // Store access token in a non-HttpOnly cookie
              if (typeof document !== 'undefined') {
                try {
                  const isSecure = window.location.protocol === 'https:';
                  document.cookie = `access_token=${newAccessToken}; Path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
                  try { window.dispatchEvent(new CustomEvent('auth:token-updated')); } catch { }
                  try { new BroadcastChannel('auth').postMessage({ type: 'token-updated' }); } catch { }
                } catch { }
              }
            }
            // Store refresh token in cookie as well if provided (backend also sets it via Set-Cookie)
            if (typeof document !== 'undefined' && newRefreshToken) {
              try {
                const isSecure = window.location.protocol === 'https:';
                document.cookie = `refresh_token=${newRefreshToken}; Path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
              } catch { }
            }
            // Keep only user in localStorage (if present in payload)
            try {
              const user = (payload && payload.user) ? payload.user : oldAuth?.user;
              if (user) {
                localStorage.setItem('auth', JSON.stringify({ user }));
              } else {
                localStorage.removeItem('auth');
              }
            } catch { /* ignore */ }
            processQueue(null, newAccessToken ?? null);
            resolve(api(originalRequest));
          })
          .catch(err => {
            // Clear auth and don't log refresh errors
            try { localStorage.removeItem('auth'); } catch { /* ignore */ }
            // Do not clear cookies here; only clear on explicit user logout
            try { window.dispatchEvent(new CustomEvent('auth:token-updated')); } catch { }
            try { new BroadcastChannel('auth').postMessage({ type: 'token-updated' }); } catch { }
            processQueue(new Error('Authentication required'), null);
            reject(new Error('Authentication required'));
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

// Generic error handler for API calls
export const handleApiError = (error: any, context?: string): Error => {
  // Don't log authentication errors to console
  if (error.message === 'Authentication required') {
    return new Error('Please log in to access this feature');
  }

  // Only log unexpected errors
  if (error.response?.status !== 401) {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
  }

  // Return user-friendly error messages
  if (error.response?.status === 403) {
    return new Error('You do not have permission to access this resource');
  }

  if (error.response?.status === 404) {
    return new Error('The requested resource was not found');
  }

  if (error.response?.status >= 500) {
    return new Error('Server error. Please try again later');
  }

  return error;
};
