'use client';
import React, { useState, useEffect } from 'react';
import { getPaymentHistory, type PaymentRecord } from '@/apis/wallet.api';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

interface PaymentHistoryProps {
  className?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ className = '' }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const fetchPayments = async (reset = false) => {
    try {
      setIsLoading(true);
      const currentOffset = reset ? 0 : offset;
      const response = await getPaymentHistory(limit, currentOffset);

      if (response.success && response.data) {
        if (reset) {
          setPayments(response.data.payments);
        } else {
          setPayments(prev => [...prev, ...response.data.payments]);
        }
        setHasMore(response.data.pagination.has_more);
        setOffset(currentOffset + limit);
      } else {
        setError('Failed to load payment history');
      }
    } catch (error) {
      setError('Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(true);
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (transactionType: string) => {
    switch (transactionType) {
      case 'wallet_topup':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'wallet_deduction':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        );
      case 'purchase':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
    }
  };

  const getTransactionTypeLabel = (transactionType: string) => {
    switch (transactionType) {
      case 'wallet_topup':
        return 'Nạp tiền';
      case 'wallet_deduction':
        return 'Trừ tiền';
      case 'purchase':
        return 'Mua phim';
      case 'refund':
        return 'Hoàn tiền';
      default:
        return 'Giao dịch';
    }
  };

  const getAmountColor = (transactionType: string) => {
    switch (transactionType) {
      case 'wallet_topup':
      case 'refund':
        return 'text-green-600';
      case 'wallet_deduction':
      case 'purchase':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus?.toLowerCase()) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            Success
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Pending
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            Failed
          </span>
        );
      default:
        return null;
    }
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
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchPayments(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Lịch sử giao dịch
        </h3>
        <button
          onClick={() => fetchPayments(true)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Làm mới
        </button>
      </div>

      {isLoading && payments.length === 0 ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-400">Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getTransactionIcon(payment.transaction_type)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">
                      {getTransactionTypeLabel(payment.transaction_type)}
                    </p>
                    {payment.transaction_type === 'wallet_topup' && getStatusBadge(payment.payment_status)}
                  </div>
                  <p className="text-sm text-gray-400">
                    {payment.description || 'Giao dịch'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(payment.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-gray-900 ${getAmountColor(payment.transaction_type)}`}>
                  {payment.transaction_type === 'wallet_topup' || payment.transaction_type === 'refund' ? '+' : '-'}
                  {formatAmount(payment.amount)}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {payment.payment_method}
                </p>
                {payment.reference_id && (
                  <p className="text-xs text-gray-500">
                    ID: {payment.reference_id.slice(-8)}
                  </p>
                )}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => fetchPayments(false)}
                disabled={isLoading}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Đang tải...' : 'Xem thêm'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
