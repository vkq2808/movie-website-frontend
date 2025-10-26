"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) {
        await fetchUser();
      }
      if (!mounted) return;
      setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user, fetchUser]);

  useEffect(() => {
    if (checking) return;
    // If not logged in, go to login
    if (!user) {
      router.replace('/auth/login?from=/admin');
      return;
    }
    // If not admin, go home
    if (user.role !== 'admin') {
      router.replace('/');
    }
  }, [checking, user, router]);

  if (checking || !user || user.role !== 'admin') {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
