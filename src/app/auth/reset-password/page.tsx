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
      setError('Vui lòng điền đầy đủ thông tin');
      toast.warning('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (resetPasswordData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (resetPasswordData.password.length > 20) {
      setError('Mật khẩu không được quá 20 ký tự');
      toast.warning('Mật khẩu không được quá 20 ký tự');
      return false;
    }

    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      setError('Mật khẩu không khớp');
      toast.warning('Mật khẩu không khớp');
      return false;
    }

    if (resetPasswordData.otp.length !== 6) {
      setError('Mã OTP không hợp lệ');
      toast.warning('Mã OTP không hợp lệ');
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
          toast.success('Đổi mật khẩu thành công');
          router.push('/auth/login');
        } else {
          toast.error(res.message || 'Đổi mật khẩu thất bại');
        }
      }).catch((error) => {
        const msg = error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
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
            <label className="block text-sm font-medium text-neutral-700">Mật khẩu mới</label>
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
            <label className="block text-sm font-medium text-neutral-700">Nhập lại mật khẩu</label>
            <input
              type="password"
              className="w-full text-gray-700 px-4 py-2 mt-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500"
              name="confirmPassword"
              value={resetPasswordData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700">Mã OTP</label>
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
            {loading ? <ClipLoader color="#fff" loading={loading} size={20} /> : 'Đổi mật khẩu'}
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
        <h1 className="text-xl font-medium text-center">Đang tải...</h1>
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
