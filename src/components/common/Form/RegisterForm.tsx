'use client';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, RegisterData } from '@/apis/auth.api';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const initialRegisterData: RegisterData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
  }
  const [formData, setFormData] = useState(initialRegisterData);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState('');
  const [pwdVisible, setPwdVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
  const [emailAvailable, setEmailAvailable] = useState<null | boolean>(null);
  const [checking, setChecking] = useState<{ email: boolean; username: boolean }>({ email: false, username: false });

  const canSubmit = useMemo(() => {
    return !submitting && (!checking.email && !checking.username);
  }, [submitting, checking]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Debounced availability checks
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (formData.username && formData.username.length >= 3) {
        setChecking((c) => ({ ...c, username: true }));
        try {
          const res = await authApi.checkUsername(formData.username);
          setUsernameAvailable(res.data.available);
        } catch (_) {
          setUsernameAvailable(null);
        } finally {
          setChecking((c) => ({ ...c, username: false }));
        }
      } else {
        setUsernameAvailable(null);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [formData.username]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const email = formData.email.trim();
      if (email) {
        setChecking((c) => ({ ...c, email: true }));
        try {
          const res = await authApi.checkEmail(email);
          setEmailAvailable(res.data.available);
        } catch (_) {
          setEmailAvailable(null);
        } finally {
          setChecking((c) => ({ ...c, email: false }));
        }
      } else {
        setEmailAvailable(null);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    const isValid = await validateData();
    if (!isValid) {
      setSubmitting(false);
      return;
    }

    await authApi.register(formData).then(res => {
      if (res.success) {
        setInfo('Đăng ký thành công. Đang chuyển hướng đến trang nhập OTP...');
        toast.success('Đăng ký thành công');
        // Small delay so users can see the message before redirect
        setTimeout(() => {
          router.push(`/auth/verify?email=${formData.email}`);
        }, 900);
      }
    }).catch(err => {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg) && msg.length > 0) {
        setError(msg[0]);
        toast.error(msg[0]);
      } else if (typeof msg === 'string') {
        setError(msg);
        toast.error(msg);
      } else {
        const fallback = 'Đăng ký thất bại. Vui lòng thử lại.';
        setError(fallback);
        toast.error(fallback);
      }
    });
    // Keep submitting state if success (until redirect). If failed, stop loading.
    setSubmitting(false);
  };

  const validateData = async () => {
    // Validate the form data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,50}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

    if (!formData.username) {
      setError('Username is required');
      toast.warning('Username is required');
      return false;
    }

    if (!usernameRegex.test(formData.username)) {
      setError('Username must be 3-30 characters and contain only letters, numbers, and underscores');
      toast.warning('Username must be 3-30 characters and contain only letters, numbers, and underscores');
      return false;
    }

    if (!formData.email) {
      setError('Email is required');
      toast.warning('Email is required');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Invalid email');
      toast.warning('Invalid email');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      toast.warning('Password is required');
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8-50 chars, include upper, lower, and a number');
      toast.warning('Password must be 8-50 chars, include upper, lower, and a number');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Confirm Password is required');
      toast.warning('Confirm Password is required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.warning('Passwords do not match');
      return false;
    }

    if (!formData.birthdate) {
      setError('Birthdate is required');
      toast.warning('Birthdate is required');
      return false;
    }

    // Check availability results if present
    if (emailAvailable === false) {
      setError('Email is already in use');
      toast.warning('Email is already in use');
      return false;
    }
    if (usernameAvailable === false) {
      setError('Username is already taken');
      toast.warning('Username is already taken');
      return false;
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label htmlFor="username" className="block text-gray-700 font-medium">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required
          className="mt-1 w-full text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {usernameAvailable !== null && (
          <p className={`text-sm mt-1 ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {checking.username ? 'Đang kiểm tra...' : usernameAvailable ? 'Username khả dụng' : 'Username đã được sử dụng'}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 w-full text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {emailAvailable !== null && (
          <p className={`text-sm mt-1 ${emailAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {checking.email ? 'Đang kiểm tra...' : emailAvailable ? 'Email khả dụng' : 'Email đã được sử dụng'}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700 font-medium">
          Password
        </label>
        <div className="relative">
          <input
            type={pwdVisible ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="mt-1 w-full text-gray-700 p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={() => setPwdVisible((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            {pwdVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={confirmVisible ? 'text' : 'password'}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="mt-1 w-full p-2 pr-10 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={() => setConfirmVisible((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            {confirmVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="birthdate" className="block text-gray-700 font-medium">
          Birthdate
        </label>
        <input
          type="date"
          name="birthdate"
          id="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          required
          className="mt-1 w-full text-gray-700 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {!error && info && <p className="text-blue-600">{info}</p>}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full bg-blue-500 text-neutral-50 py-2 rounded-lg transition duration-300 ${!canSubmit ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
      >
        {submitting ? 'Đang gửi...' : 'Đăng ký'}
      </button>
    </form>
  );
};
export default RegisterForm;