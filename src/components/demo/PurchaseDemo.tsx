'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import WalletBalance from '@/components/common/Wallet/WalletBalance';

const PurchaseDemo: React.FC = () => {
  const [currentBalance, setCurrentBalance] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Movie Purchase System
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience our complete movie purchasing workflow with virtual currency.
            Add money to your wallet, browse movies, and build your digital collection.
          </p>
        </div>

        {/* Demo Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Step 1: Wallet */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold">Add Money to Wallet</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Start by adding virtual currency to your wallet. Choose from quick amounts or enter a custom value.
            </p>
            <Link
              href="/wallet"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manage Wallet
            </Link>
          </div>

          {/* Step 2: Browse */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">Browse & Purchase</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Explore our movie collection and purchase titles using your wallet balance. Each movie shows its price and ownership status.
            </p>
            <Link
              href="/home"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Movies
            </Link>
          </div>

          {/* Step 3: Library */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold">Your Library</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Access all your purchased movies in one place. View purchase history, total spent, and watch anytime.
            </p>
            <Link
              href="/purchases"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View Library
            </Link>
          </div>
        </div>

        {/* Current Wallet Status */}
        <div className="max-w-md mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Current Wallet</h2>
          <WalletBalance showAddBalance={false} />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Purchase</h3>
            <p className="text-gray-400 text-sm">Buy movies instantly with one click using your wallet balance</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Ownership Tracking</h3>
            <p className="text-gray-400 text-sm">Automatic tracking of purchased movies with ownership badges</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Wallet</h3>
            <p className="text-gray-400 text-sm">Safe and secure virtual currency system with balance protection</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Purchase Analytics</h3>
            <p className="text-gray-400 text-sm">Track your spending and view detailed purchase statistics</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Movie Collection?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Add money to your wallet and start purchasing movies from our extensive collection.
            Build your personal digital library today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wallet"
              className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Money to Wallet
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16l13-8L7 4z" />
              </svg>
              Browse Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDemo;
