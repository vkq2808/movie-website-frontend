'use client';
import React from "react";
import Link from "next/link";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { categories } from "@/constants/mockData";
import { useAuthStore } from "@/zustand/auth.store";
import api from "@/utils/api.util";

const Header = () => {
  const auth = useAuthStore(state => state.auth);
  const handleLogout = useAuthStore(state => state.logout);

  const handleTestToken = async () => {
    try {
      api.get('/auth/test-token', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
        .then(res => {
          console.log('res', res)
        })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <header className="shadow-[0_4px_3px_-1px_var(--color-neutral-500)]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
          MyLogo
        </Link>

        {/* Navigation links */}
        <nav className="hidden grid-flow-col gap-8 md:grid">
          {
            categories.map((item, index) => (
              <Link key={index} href={item.path} className="text-lg font-medium text-gray-700 hover:text-gray-800 transition-colors">
                {item.title}
              </Link>
            ))
          }
        </nav>

        {/* Nút chuyển dark mode */}
        <div className="flex items-center gap-4">
          <button onClick={handleTestToken} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:cursor-pointer">
            Test Token
          </button>
          <ThemeSwitcher />
          {
            auth.user ? (
              <>
                <Link href="/profile" className="text-lg font-medium text-gray-700 hover:text-gray-800 transition-colors">
                  <img src={auth.user.photoUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                </Link>
                <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-gray-800 transition-colors" onClick={handleLogout}>
                  Đăng xuất
                </div>
              </>
            ) :
              (
                <Link href="/auth/login" className="text-lg font-medium text-gray-700 hover:text-gray-800 transition-colors">
                  Đăng nhập
                </Link>
              )
          }
        </div>
      </div>
    </header>
  );
};

export default Header;
