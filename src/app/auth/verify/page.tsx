'use client';
import api, { apiEndpoint } from '@/utils/api.util';
import { authApi } from '@/apis/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// Component using useSearchParams
const VerifyContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const handleSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.verify({ email: email || '', otp });
      if (res.success) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.log(err);
      setError('OTP không hợp lệ');
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      if (!email) return;
      const res = await api.post(`${apiEndpoint.AUTH}/resend-otp`, { email });
      if (res.status === 200) {
        // Đặt lại timer khi gửi lại OTP thành công
        setCountdown(60);
      }
    } catch (err) {
      console.log(err);
      setError('Không thể gửi lại OTP. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!email) {
      router.push('/auth/register');
    }
    setIsLoading(false);
  }, [email, router]);

  // Hiệu ứng đếm ngược cho nút gửi lại OTP
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Xác thực OTP</h2>
        {isLoading ? (
          <p className="text-center text-gray-600">Đang tải...</p>
        ) : (
          <div className="flex flex-col space-y-4">
            {
              email &&
              <p className="text-center text-gray-700">
                Vui lòng nhập OTP được gửi đến email: <span className="font-semibold">{email}</span>
              </p>
            }
            <form onSubmit={handleSubmitOTP} className="flex flex-col space-y-4">
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Nhập OTP"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button type="submit" className="bg-blue-500 text-gray-50 p-3 rounded-lg hover:bg-blue-600 transition-colors">
                Xác thực
              </button>
            </form>
            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                className={`text-sm ${countdown > 0 || isResending
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 hover:underline'
                  }`}
              >
                {countdown > 0 ? `Gửi lại OTP sau ${countdown} giây` : 'Gửi lại OTP'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading component to show while waiting for the content to load
const LoadingVerify = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Xác thực OTP</h2>
        <p className="text-center text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const VerifyPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingVerify />}>
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
