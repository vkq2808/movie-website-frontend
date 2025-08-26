'use client';
import React, { FormEvent } from 'react'
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand/auth.store';
import { authApi } from '@/apis/auth.api';
import { useToast } from '@/contexts/toast.context';

const LoginForm = () => {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg('');
    setLoading(true);

    await authApi.login({ email, password }).then(res => {
      if (res.success) {
        // Persist user in local store
        setAuth({ user: res.data.user })
        // Write FE-domain cookies so middleware (edge) can validate using backend
        try {
          const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
          const at = res.data.access_token;
          const rt = res.data.refresh_token;
          if (at) document.cookie = `access_token=${at}; Path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
          if (rt) document.cookie = `refresh_token=${rt}; Path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
          // Broadcast token update
          try { window.dispatchEvent(new CustomEvent('auth:token-updated')); } catch { }
          try { new BroadcastChannel('auth').postMessage({ type: 'token-updated' }); } catch { }
        } catch { /* ignore */ }
        toast.success('Đăng nhập thành công');
      }
    }).catch(err => {
      const msg = err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setErrorMsg(msg);
      toast.error(msg);
      console.error('Login error:', err);
    }).finally(() => {
      setLoading(false);
    });
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
          className="w-full p-3 border border-gray-300 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full text-gray-700 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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