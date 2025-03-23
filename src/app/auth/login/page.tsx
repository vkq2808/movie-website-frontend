import { NextPage } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/common';

const LoginPage: NextPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-neutral-50 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Chào mừng trở lại!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Vui lòng đăng nhập để tiếp tục.
        </p>
        <LoginForm />
        <p className="mt-6 text-sm text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;