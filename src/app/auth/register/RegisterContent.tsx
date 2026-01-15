"use client";
import React from 'react';
import { RegisterForm } from '@/components/common';
import { useSettings } from '@/hooks/useSettings';

export default function RegisterContent() {
  const { settings } = useSettings();

  if (settings && settings.registrationEnabled === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Registration Disabled</h2>
          <p className="text-gray-300">New user registration is currently disabled. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
