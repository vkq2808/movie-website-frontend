import { NextPage } from 'next';
import Link from 'next/link';
import { LoginForm, LoginOauth2 } from '@/components/common';

const LoginPage: NextPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400  to-pink-400">
      <div className="bg-slate-100 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please log in to continue.
        </p>
        <LoginForm />
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Sign up now
          </Link>
        </p>
        <p className="mt-6 text-sm text-center text-gray-600">
          Forgot your password?{' '}
          <Link href="/auth/forget-password" className="text-blue-600 hover:underline">
            Reset password
          </Link>
        </p>
        <LoginOauth2 />
      </div>
    </div>
  );
};

export default LoginPage;