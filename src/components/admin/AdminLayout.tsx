'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  FilmIcon,
  UsersIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated, clearAuth, isAdmin } from '@/utils/auth.util';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Dashboard' }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Movies', href: '/admin/movies', icon: FilmIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/auth/login?redirect=/admin');
      return;
    }

    // Check if user is admin
    if (!isAdmin()) {
      router.push('/auth/login?error=insufficient_permissions');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <SidebarContent navigation={navigation} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-900">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-white mb-6">{title}</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  navigation: NavItem[];
  onLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ navigation, onLogout }) => {
  return (
    <>
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
        <h1 className="text-white text-xl font-bold">MovieStream Admin</h1>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            >
              <item.icon className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex-shrink-0 flex bg-gray-700 p-4">
          <button
            onClick={onLogout}
            className="flex-shrink-0 w-full group block text-left text-gray-300 hover:text-white transition-colors"
          >
            <div className="flex items-center">
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
