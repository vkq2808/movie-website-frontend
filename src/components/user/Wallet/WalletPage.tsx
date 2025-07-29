'use client';
import React from 'react';
import WalletBalance from '@/components/common/Wallet/WalletBalance';

const WalletPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Wallet</h1>
          <p className="text-gray-400">
            Manage your wallet balance and view transaction history
          </p>
        </div>

        {/* Wallet Balance Section */}
        <div className="max-w-2xl mx-auto">
          <WalletBalance
            showAddBalance={true}
            onBalanceUpdate={(newBalance) => {
              console.log('Balance updated:', newBalance);
            }}
          />
        </div>

        {/* Information Section */}
        <div className="max-w-2xl mx-auto mt-8 space-y-6">
          {/* How it works */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              How it works
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium">Add money to your wallet</p>
                  <p className="text-sm text-gray-400">Choose from quick amounts or enter a custom amount</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium">Browse and purchase movies</p>
                  <p className="text-sm text-gray-400">Use your wallet balance to buy movies instantly</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-medium">Watch anytime</p>
                  <p className="text-sm text-gray-400">Access your purchased movies from your library</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Wallet Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Instant transactions</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure payments</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No transaction fees</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Balance never expires</span>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-yellow-400 mr-3 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h4 className="font-medium text-yellow-400 mb-1">Important Notice</h4>
                <p className="text-sm text-yellow-200">
                  This is a demonstration wallet system using virtual currency.
                  No real money is involved in these transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
