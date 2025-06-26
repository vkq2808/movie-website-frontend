'use client'
import api, { apiEndpoint } from '@/utils/api.util';
import { useAuthStore } from '@/zustand/auth.store';
import { access } from 'fs';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'

// This component will wrap the useSearchParams hook
function FacebookOauth2Content() {
  const setAuth = useAuthStore(state => state.setAuth);
  const setUser = useAuthStore(state => state.setUser);
  const searchParams = useSearchParams();
  // Effect lấy dữ liệu callback từ URL và gọi API
  React.useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      console.log('Facebook OAuth2 Callback code:', code);
      api
        .get(`${apiEndpoint.AUTH}/facebook-oauth2/callback`, {
          params: { code }
        })
        .then((res) => {
          if (res.status === 200) {

            try {
              if (res.data.user) {
                console.log(res.data.access_token, res.data.refresh_token, res.data.user);
                setAuth({ access_token: res.data.access_token, refresh_token: res.data.refresh_token, user: res.data.user }).then(() => {
                  window.close();
                });
              } else {
                console.warn('No user data in response');
              }
            } catch (error) {
              console.error('Error setting user:', error);
            }
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
