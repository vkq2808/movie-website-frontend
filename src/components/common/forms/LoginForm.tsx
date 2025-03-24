'use client';
import React, { FormEvent } from 'react'
import Link from 'next/link';
import api from '@/utils/api.util';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand/auth.store';
import { authApi } from '@/apis/auth.api';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const setAth = useAuthStore(state => state.setAuth);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg('');
    setLoading(true);

    try {
      await authApi.login({ email, password }).then(res => {
        console.log('res', res)
        if (res.data.user) {
          setAth({ accessToken: res.data.accessToken, user: res.data.user, refreshToken: res.data.refreshToken });
          router.push('/')
        }
      })
        .catch(err => {
          throw new Error(err.response.data.message)
        })
    } catch (err) {
      setErrorMsg('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleLoginSubmit} className="space-y-5">
      {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu của bạn"
          required
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-neutral-50 py-3 rounded hover:bg-blue-600 transition-colors"
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm