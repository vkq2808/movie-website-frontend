'use client'
import api from '@/utils/api.util';
import { useAuthStore } from '@/zustand/auth.store';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const GoogleOAuth2CallBackPage = () => {
  const [timer, setTimer] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Effect xử lý đồng hồ đếm ngược khi dữ liệu đã được tải
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace('/'); // Điều hướng về trang chủ
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoaded, router]);

  // Effect lấy dữ liệu callback từ URL và gọi API
  useEffect(() => {
    const code = searchParams.get('code');
    const scope = searchParams.get('scope');
    const authUser = searchParams.get('authUser');
    const prompt = searchParams.get('prompt');

    if (code && scope) {
      api
        .get('/auth/google-oauth2/callback', {
          params: { code, scope, authUser, prompt }
        })
        .then((res) => {
          if (res.status === 200) {
            setAuth(res.data);
            setIsLoaded(true);
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
        <h1 className="text-3xl font-bold text-center">Google OAuth2 Callback</h1>
        <p className="text-center">
          Trang này sẽ chuyển hướng về trang chủ sau khi quá trình OAuth2 của Google hoàn tất.
        </p>
        <p className="text-center">
          {isLoaded ? `Vui lòng chờ... (${timer})` : 'Vui lòng chờ...'}
        </p>
      </div>
    </div>
  );
};

export default GoogleOAuth2CallBackPage;
