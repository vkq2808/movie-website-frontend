'use client';
import React, { useState, useEffect } from 'react';
import { Movie } from '@/types/api.types'
import { purchaseMovie, checkMovieOwnership } from '@/apis/movie-purchase.api';
import { getWalletBalance } from '@/apis/wallet.api';
import { useAuthStore } from '@/zustand/auth.store';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

interface MoviePurchaseButtonProps {
  movie: Movie;
  onPurchaseSuccess?: () => void;
  className?: string;
}

const MoviePurchaseButton: React.FC<MoviePurchaseButtonProps> = ({
  movie,
  onPurchaseSuccess,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [ownsMovie, setOwnsMovie] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Get user from auth store
  const user = useAuthStore(state => state.user);

  // Check ownership and wallet balance on component mount
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    const checkInitialState = async () => {
      setIsLoading(true);
      try {
        // Check if user owns the movie
        const ownershipResponse = await checkMovieOwnership(movie.id);
        setOwnsMovie(ownershipResponse.data.owns_movie);

        // Get wallet balance
        const balanceResponse = await getWalletBalance();
        console.log('Wallet balance:', balanceResponse);
        setWalletBalance(balanceResponse.data.balance);
      } catch (error) {
        setError('Failed to load purchase information');
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialState();
  }, [movie.id, user]);

  const handlePurchase = async () => {
    if (isPurchasing || ownsMovie) return;

    setIsPurchasing(true);
    setError(null);

    try {
      // Check if user has sufficient balance
      if (walletBalance < movie.price) {
        setError('Insufficient wallet balance');
        return;
      }

      // Purchase the movie
      const response = await purchaseMovie(movie.id);

      // Update states
      setOwnsMovie(true);
      setWalletBalance(prev => prev - movie.price);

      // Call success callback
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }

      // Show success message (you can customize this)
      alert(`Successfully purchased "${movie.title}" for $${movie.price}!`);
    } catch (error: unknown) {
      // Handle specific error messages
      if (error && typeof error === 'object' && 'response' in error &&
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        setError(error.response.data.message as string);
      } else if (error && typeof error === 'object' && 'message' in error &&
        typeof error.message === 'string' && error.message.includes('already purchased')) {
        setError('You already own this movie');
        setOwnsMovie(true);
      } else if (error && typeof error === 'object' && 'message' in error &&
        typeof error.message === 'string' && error.message.includes('Insufficient')) {
        setError('Insufficient wallet balance');
      } else {
        setError('Failed to purchase movie. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  // Show price without login prompt if user is not authenticated
  if (!user) {
    return (
      <div className={`${className}`}>
        <div className="p-2 rounded-lg text-center bg-yellow-400 text-black">
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">${movie.price}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <LoadingSpinner />
        <span className="ml-2 text-gray-400">Loading...</span>
      </div>
    );
  }

  // Show owned state
  if (ownsMovie) {
    return (
      <div className={`flex items-center p-4 bg-green-600 text-white rounded-lg ${className}`}>
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">You own this movie</span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Wallet Balance Display */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>Wallet Balance:</span>
        <span className="font-medium">${walletBalance?.toFixed(2)}</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={isPurchasing || walletBalance < movie.price}
        className={`
          w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${walletBalance >= movie.price && !isPurchasing
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isPurchasing ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">Purchasing...</span>
          </>
        ) : (
          <>
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13h10M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            <span>
              Buy Now - ${movie.price}
              {walletBalance < movie.price && ' (Insufficient Balance)'}
            </span>
          </>
        )}
      </button>

      {/* Insufficient Balance Warning */}
      {walletBalance < movie.price && (
        <div className="text-xs text-gray-500 text-center">
          You need ${(movie.price - walletBalance).toFixed(2)} more to purchase this movie
        </div>
      )}
    </div>
  );
};

export default MoviePurchaseButton;
