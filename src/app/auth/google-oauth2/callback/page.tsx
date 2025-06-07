'use client'
import api, { apiEnpoint } from '@/utils/api.util';
import { useAuthStore } from '@/zustand/auth.store';
import { useUserStore } from '@/zustand/user.store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, Suspense } from 'react';

// Component that uses useSearchParams
const GoogleOAuth2Content = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  const setUser = useUserStore(state => state.setUser);
  const searchParams = useSearchParams();

  // Effect lấy dữ liệu callback từ URL và gọi API
  useEffect(() => {
    const code = searchParams.get('code');
    const scope = searchParams.get('scope');
    const authUser = searchParams.get('authUser');
    const prompt = searchParams.get('prompt');

    if (code && scope) {
      console.log('Google OAuth2 Callback Params:', { code, scope, authUser, prompt });
      // Log the setAuth function to see if it's defined correctly
      console.log('setAuth function:', setAuth);

      api
        .get(`${apiEnpoint.AUTH}/google-oauth2/callback`, {
          params: { code, scope, authUser, prompt }
        }).then((res) => {
          if (res.status === 200) {
            console.log('Auth response:', res.data);
            // Manually check if the data we're using exists
            console.log('accessToken exists:', !!res.data.accessToken);
            console.log('refreshToken exists:', !!res.data.refreshToken);

            try {
              if (res.data.user) {
                setUser(res.data.user);
                console.log('After setUser - success');
              } else {
                console.warn('No user data in response');
              }
            } catch (error) {
              console.error('Error in setUser:', error);
            }

            try {
              setAuth({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
              console.log('After setAuth - success');
            } catch (error) {
              console.error('Error in setAuth:', error);
            }

            setTimeout(() => {
              window.close();
            }, 1000); // Close after 1 second to ensure state updates
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [searchParams, setAuth, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Google OAuth2 Callback</h1>
        <p className="text-center">
          Trang này sẽ chuyển hướng về trang chủ sau khi quá trình OAuth2 của Google hoàn tất.
        </p>
      </div>
    </div>
  );
};

// Loading component to show while waiting for the content to load
const LoadingCallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Google OAuth2 Callback</h1>
        <p className="text-center">
          Đang xử lý đăng nhập Google...
        </p>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const GoogleOAuth2CallBackPage = () => {
  return (
    <Suspense fallback={<LoadingCallback />}>
      <GoogleOAuth2Content />
    </Suspense>
  );
};

export default GoogleOAuth2CallBackPage;
