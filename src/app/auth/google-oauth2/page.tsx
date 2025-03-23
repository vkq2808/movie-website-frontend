'use client'
import api from '@/utils/api.util'
import React, { useEffect } from 'react'
import { oauth2Google } from '@/services/auth.service'

const GoogleOAuth2Page = () => {

  const [loading, setLoading] = React.useState(true)

  const handleLoginWithGoogle = async () => {
    try {
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    oauth2Google()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-neutral-50 p-8 rounded-lg shadow-md w-full max-w-md">
        {
          loading ? (
            <div className="flex items-center justify-center h-64">
              <svg
                className="animate-spin h-12 w-12 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4V0H8v17.29l-2-2.002z"
                ></path>
              </svg>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập với Google</h2>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-neutral-50 font-bold py-2 px-4 rounded w-full"
                onClick={handleLoginWithGoogle}
              >
                Đăng nhập với Google
              </button>
            </div>
          )}
      </div>
    </div>
  )
}

export default GoogleOAuth2Page
