'use client'
import { baseURL } from '@/utils/api.util';
import { useAuthStore } from '@/zustand/auth.store';
import React from 'react'
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const LoginOauth2 = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const auth = useAuthStore(state => state);

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
      window.location.href = '/';
    }
  }, [auth.access_token]);

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
