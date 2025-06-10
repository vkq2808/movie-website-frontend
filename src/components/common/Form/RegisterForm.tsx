'use client';
import React from 'react';
import { useState } from 'react';
import api from '@/utils/api.util';
import { useRouter } from 'next/navigation';
import { authApi, RegisterData } from '@/apis/auth.api';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const initialRegisterData: RegisterData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
  }
  const [formData, setFormData] = useState(initialRegisterData);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateData();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    await authApi.register(formData).then(res => {
      if (res.status === 201) {
        router.push(`/auth/verify?email=${formData.email}`);
      }
    }).catch(err => {
      setError(err.response.data.message);
    });
  };

  const validateData = async () => {
    // Validate the form data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.username) {
      setError('Username is required');
      return false;
    }

    if (!formData.email) {
      setError('Email is required');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Invalid email');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least 8 characters, including one letter and one number');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Confirm Password is required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.birthdate) {
      setError('Birthdate is required');
      return false;
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          autoComplete="email"
          required
          className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700 font-medium">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="shipping mobile tel-local-suffix webauthn"
          className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-neutral-50 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Đăng ký
      </button>
    </form>
  );
};
export default RegisterForm;