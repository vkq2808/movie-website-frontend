// utils/auth.util.ts

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const auth = localStorage.getItem('auth');
    if (!auth) return false;

    const { access_token, refresh_token } = JSON.parse(auth);
    return !!(access_token && refresh_token);
  } catch {
    return false;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;

    const { access_token } = JSON.parse(auth);
    return access_token || null;
  } catch {
    return null;
  }
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
  return (
    error?.message?.includes('Authentication required') ||
    error?.message?.includes('log in') ||
    error?.response?.status === 401
  );
};
