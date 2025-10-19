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
  const redirect = searchParams.get('redirect');

  const handleGoogleOauth2Login = () => {
    // setIsLoading(true);
    window.open(`${baseURL}` + '/auth/google-oauth2', 'newwindow', 'width=500, height=600');
  }

  const handleFacebookOauth2Login = () => {
    // setIsLoading(true);
    window.open(`${baseURL}` + '/auth/facebook-oauth2', 'newwindow', 'width=500, height=600');
  }

  const handleReturnToUrl = async () => {
    setIsLoading(true);
    const target = from || redirect || '/';
    router.push(target);
    setIsLoading(false);
  }

  React.useEffect(() => {
    if (auth.user) {
      handleReturnToUrl();
    }
  }, [auth.user, from, redirect]);

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
