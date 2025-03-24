'use client';
import React from 'react'

const ResetPasswordPage = () => {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-sm font-medium text-neutral-50 bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
