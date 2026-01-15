'use client'
import { authApi, ResetPasswordData } from '@/apis/auth.api';
import { useRouter, useSearchParams } from 'next/navigation'
import { ClipLoader } from 'react-spinners';
import React, { Suspense } from 'react'
import { useToast } from '@/hooks/useToast'

// Component using useSearchParams
const ResetPasswordContent = () => {
  const params = useSearchParams();
  const toast = useToast();
  const initialResetPasswordData: ResetPasswordData = {
    email: params.get('email') || '',
    password: '',
    confirmPassword: '',
    otp: '',
  }
  const [resetPasswordData, setResetPasswordData] = React.useState(initialResetPasswordData);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordData({
      ...resetPasswordData,
      [e.target.name]: e.target.value,
    });
  }

  const validateData = () => {
    if (!resetPasswordData.password || !resetPasswordData.confirmPassword || !resetPasswordData.otp) {
      setError('Please fill in all fields');
      toast.warning('Please fill in all fields');
      return false;
    }

    if (resetPasswordData.password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.warning('Password must be at least 6 characters');
      return false;
    }

    if (resetPasswordData.password.length > 20) {
      setError('Password cannot exceed 20 characters');
      toast.warning('Password cannot exceed 20 characters');
      return false;
    }

    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match');
      toast.warning('Passwords do not match');
      return false;
    }

    if (resetPasswordData.otp.length !== 6) {
      setError('Invalid OTP');
      toast.warning('Invalid OTP');
      return false;
    }

    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    if (!validateData()) return;

    setLoading(true);

    setTimeout(() => {
      authApi.resetPassword(resetPasswordData).then((res) => {
        if (res.success) {
          toast.success('Password changed successfully');
          router.push('/auth/login');
        } else {
          toast.error(res.message || 'Failed to change password');
        }
      }).catch((error) => {
        const msg = error?.response?.data?.message || 'An error occurred while changing the password';
        setError(msg);
        toast.error(msg);
      }).finally(() => {
        setLoading(false);
      });
    }, 300);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              className="w-full text-gray-700 px-4 cursor-not-allowed py-2 mt-2 text-sm border-b border-neutral-300 focus:outline-none focus:border-neutral-500"
              name="email"
              value={resetPasswordData.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700">New password</label>
            <input
              type="password"
              className="w-full text-gray-700 px-4 py-2 mt-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500"
              name="password"
              value={resetPasswordData.password}
              onChange={handleChange}
              autoComplete='old-password'
              autoCorrect='off'
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700">Confirm new password</label>
            <input
              type="password"
              className="w-full text-gray-700 px-4 py-2 mt-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500"
              name="confirmPassword"
              value={resetPasswordData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700">OTP</label>
            <input
              type="text"
              className="w-full text-gray-700 px-4 py-2 mt-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500"
              name="otp"
              value={resetPasswordData.otp}
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-sm font-medium text-neutral-50 bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
          >
            {loading ? <ClipLoader color="#fff" loading={loading} size={20} /> : 'Change password'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Loading component to show while waiting for the content to load
const LoadingResetPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-medium text-center">Loading...</h1>
        <div className="flex justify-center mt-4">
          <ClipLoader color="#3b82f6" size={30} />
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<LoadingResetPassword />}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage
