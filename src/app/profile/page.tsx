'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/zustand';
import { useRouter } from 'next/navigation';
import { ProfileHeader, ProfileTabs } from '@/components/user';
import { LoadingSpinner } from '@/components/common';

export default function ProfilePage() {
  const { user, fetchUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure user is loaded; rely on cookies/axios in fetchUser
    if (!user) {
      setIsLoading(true);
      fetchUser()
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user, fetchUser]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

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
