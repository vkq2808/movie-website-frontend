// utils/auth.util.ts

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  // With cookie-based auth, consider authenticated if user exists in localStorage or access_token cookie is present
  try {
    const raw = localStorage.getItem('auth');
    const user = raw ? JSON.parse(raw)?.user : null;
    if (user) return true;
    // Fallback: check cookie presence
    const cookies = document.cookie || '';
    return cookies.includes('access_token=');
  } catch {
    return false;
  }
};

export const getAuthToken = (): string | null => {
  // Tokens are stored in cookies now; clients shouldn't read them directly
  return null;
};

export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null;

  try {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;

    const { user } = JSON.parse(auth);
    return user || null;
  } catch {
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('auth');
};

export const isAuthError = (error: any): boolean => {
  // AxiosError shape or our wrapped Error('Authentication required')
  if (!error) return false;
  if (error?.response?.status === 401) return true;
  const msg = error?.message || error?.response?.data?.message;
  if (typeof msg === 'string') {
    return msg.toLowerCase().includes('authentication required') || msg.toLowerCase().includes('unauthorized');
  }
  return false;
};
