'use client'
import { baseURL } from '@/utils/api.util';
import { useAuthStore } from '@/zustand/auth.store';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';

const LoginOauth2 = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = useAuthStore(state => state);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleGoogleOauth2Login = () => {
    // setIsLoading(true);
    window.open(`${baseURL}` + '/auth/google-oauth2', 'newwindow', 'width=500, height=600');
  }

  const handleFacebookOauth2Login = () => {
    // setIsLoading(true);
    window.open(`${baseURL}` + '/auth/facebook-oauth2', 'newwindow', 'width=500, height=600');
  }

  React.useEffect(() => {
    if (auth.access_token) {
      setIsLoading(false);
      router.push(from || '/');
    }
  }, [auth.access_token, router]);

  return (
    isLoading ?
      <div className="mt-6 flex justify-center space-x-4">
        <ClipLoader size={24} color="#DB4437" />
      </div> :
      <div className="mt-6 flex justify-center space-x-4">
        <div onClick={handleGoogleOauth2Login} className='cursor-pointer'>
          <FaGoogle size={24} color="#DB4437" />
        </div>
        <div onClick={handleFacebookOauth2Login} className='cursor-pointer'>
          <FaFacebook size={24} color="#4267B2" />
        </div>
      </div>
  )
}

export default LoginOauth2
