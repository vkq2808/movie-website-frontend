'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/zustand';
import { useRouter } from 'next/navigation';
import { ProfileHeader, ProfileTabs } from '@/components/user';
import { LoadingSpinner } from '@/components/common';

export default function ProfilePage() {
  const { user, access_token, fetchUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!access_token) {
      console.log(access_token, 'No access token found');
      router.push('/auth/login');
      return;
    }

    // Fetch user data if not already available
    if (!user) {
      setIsLoading(true);
      fetchUser()
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setIsLoading(false);
          // If there's an authentication error, redirect to login
          if (error?.response?.status === 401 || error?.response?.status === 409) {
            router.push('/auth/login');
          }
        });
    } else {
      setIsLoading(false);
    }
  }, [access_token, user, fetchUser, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full bg-black text-white min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {user && (
          <>
            <ProfileHeader user={user} />
            <ProfileTabs user={user} />
          </>
        )}
      </div>
    </main>
  );
}
