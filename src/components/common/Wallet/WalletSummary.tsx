'use client';
import React, { useState, useEffect } from 'react';
import { getWalletSummary, type WalletSummary as WalletSummaryType } from '@/apis/wallet.api';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

interface WalletSummaryProps {
  className?: string;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ className = '' }) => {
  const [summary, setSummary] = useState<WalletSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const response = await getWalletSummary();
        if (response.success && response.data) {
          setSummary(response.data);
        } else {
          setError('Failed to load wallet summary');
        }
      } catch (error) {
        setError('Failed to load wallet summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Thống kê ví
      </h3>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tổng nạp tiền</p>
              <p className="text-xl font-semibold text-green-400">
                {formatAmount(summary.total_topups)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tổng chi tiêu</p>
              <p className="text-xl font-semibold text-red-400">
                {formatAmount(summary.total_deductions)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Số giao dịch</p>
              <p className="text-xl font-semibold text-blue-400">
                {summary.transaction_count}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {summary.recent_transactions.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Giao dịch gần đây</h4>
          <div className="space-y-2">
            {summary.recent_transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${transaction.transaction_type === 'wallet_topup' || transaction.transaction_type === 'refund'
                    ? 'bg-green-400'
                    : 'bg-red-400'
                    }`} />
                  <div>
                    <p className="text-sm text-white">
                      {transaction.description || 'Giao dịch'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${transaction.transaction_type === 'wallet_topup' || transaction.transaction_type === 'refund'
                    ? 'text-green-400'
                    : 'text-red-400'
                    }`}>
                    {transaction.transaction_type === 'wallet_topup' || transaction.transaction_type === 'refund' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSummary;
