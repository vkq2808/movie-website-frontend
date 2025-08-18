"use client";
import React from 'react';
import { AdminGuard, AdminLayout } from '@/components/admin';

export default function AdminClientShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='pt-20'>
      <AdminGuard>
        <AdminLayout>{children}</AdminLayout>
      </AdminGuard>
    </div>
  );
}
