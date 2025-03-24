'use client'
import Link from 'next/link';
import React from 'react'
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const LoginOauth2 = () => {

  return (
    <div className="mt-6 flex justify-center space-x-4">
      <Link href="/auth/google-oauth2" rel="noopener noreferrer">
        <FaGoogle size={24} color="#DB4437" />
      </Link>
      <Link href="/auth/facebook-oauth2" rel="noopener noreferrer">
        <FaFacebook size={24} color="#4267B2" />
      </Link>
    </div>
  )
}

export default LoginOauth2
