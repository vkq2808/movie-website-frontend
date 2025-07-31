'use client';
import React, { useState, useEffect } from 'react';
import { getWalletBalance, addBalance } from '@/apis/wallet.api';
import { useAuthStore } from '@/zustand/auth.store';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface WalletBalanceProps {
  showAddBalance?: boolean;
  onBalanceUpdate?: (newBalance: number) => void;
  className?: string;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  showAddBalance = false,
  onBalanceUpdate,
  className = '',
}) => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get user from auth store
  const user = useAuthStore(state => state.user);

  const fetchBalance = async () => {
    // Only fetch if user is authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getWalletBalance();
      const newBalance = response.data.balance;
      setBalance(newBalance);

      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }
    } catch (error) {
      setError('Failed to load wallet balance');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  const handleAddBalance = async () => {
    const amount = parseFloat(addAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsAddingBalance(true);
    setError(null);

    try {
      const response = await addBalance(amount);
      const newBalance = response.data.balance;
      setBalance(newBalance);
      setAddAmount('');

      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error &&
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        setError(error.response.data.message as string);
      } else {
        setError('Failed to add balance');
      }
    } finally {
      setIsAddingBalance(false);
    }
  };

  const quickAddAmounts = [10, 25, 50, 100];

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-xl font-medium text-white mb-2">Login Required</h3>
          <p className="text-gray-400 mb-4">Please login to view your wallet balance</p>
          <a
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Login to Access Wallet
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <LoadingSpinner />
        <span className="text-gray-400">Loading balance...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Balance Display */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-400">Wallet Balance</p>
            <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
          </div>
        </div>

        <button
          onClick={fetchBalance}
          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
          title="Refresh balance"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Add Balance Section */}
      {showAddBalance && (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
          <h3 className="text-lg font-medium text-white">Add Money to Wallet</h3>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {quickAddAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setAddAmount(amount.toString())}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                +${amount}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Custom Amount</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddBalance}
                disabled={isAddingBalance || !addAmount}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                {isAddingBalance ? (
                  <>
                    <LoadingSpinner />
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
