import React from 'react';
import AdminClientShell from './AdminClientShell';

export const metadata = {
  title: 'Admin - MovieStream',
};

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  // Persist a single Admin sidebar/layout across all admin pages for better UX and performance
  return (
    <AdminClientShell>{children}</AdminClientShell>
  );
}
