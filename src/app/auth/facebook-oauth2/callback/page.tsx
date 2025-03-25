'use client'
import api from '@/utils/api.util';
import { useAuthStore } from '@/zustand/auth.store';
import { useUserStore } from '@/zustand/user.store';
import { useSearchParams } from 'next/navigation';
import React from 'react'

function FacebookOauth2CallbackPage() {
  const setAuth = useAuthStore(state => state.setAuth);
  const searchParams = useSearchParams();
  const setUser = useUserStore(state => state.setUser);

  // Effect lấy dữ liệu callback từ URL và gọi API
  React.useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      api
        .get('/auth/facebook-oauth2/callback', {
          params: { code }
        })
        .then((res) => {
          if (res.status === 200) {
            setAuth({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
            setUser(res.data.user);
            window.close();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

  }, [searchParams, setAuth]);

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

export default FacebookOauth2CallbackPage
