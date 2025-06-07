'use client'
import api, { apiEnpoint } from '@/utils/api.util';
import { useAuthStore } from '@/zustand/auth.store';
import { useUserStore } from '@/zustand/user.store';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'

// This component will wrap the useSearchParams hook
function FacebookOauth2Content() {
  const setAuth = useAuthStore(state => state.setAuth);
  const searchParams = useSearchParams();
  const setUser = useUserStore(state => state.setUser);
  // Effect lấy dữ liệu callback từ URL và gọi API
  React.useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      console.log('Facebook OAuth2 Callback code:', code);
      api
        .get(`${apiEnpoint.AUTH}/facebook-oauth2/callback`, {
          params: { code }
        })
        .then((res) => {
          if (res.status === 200) {
            console.log('Auth response:', res.data);
            try {
              setAuth({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
              console.log('Auth set successfully');
            } catch (error) {
              console.error('Error setting auth:', error);
            }

            try {
              if (res.data.user) {
                setUser(res.data.user);
                console.log('User set successfully');
              } else {
                console.warn('No user data in response');
              }
            } catch (error) {
              console.error('Error setting user:', error);
            }

            setTimeout(() => {
              window.close();
            }, 1000); // Close after 1 second to ensure state updates
          }
        })
        .catch((err) => {
          console.error('Error in Facebook OAuth callback:', err);
        });
    }

  }, [searchParams, setAuth, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Facebook OAuth2 Callback</h1>
        <p className="text-center">
          Trang này sẽ chuyển hướng về trang chủ sau khi quá trình OAuth2 của Facebook hoàn tất.
        </p>
      </div>
    </div>
  );
}

// Loading component to show while waiting for the content to load
function LoadingCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Facebook OAuth2 Callback</h1>
        <p className="text-center">
          Đang xử lý đăng nhập Facebook...
        </p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
function FacebookOauth2CallbackPage() {
  return (
    <Suspense fallback={<LoadingCallback />}>
      <FacebookOauth2Content />
    </Suspense>
  );
}

export default FacebookOauth2CallbackPage
