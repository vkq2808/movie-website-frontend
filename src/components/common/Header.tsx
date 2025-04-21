'use client';
import React from "react";
import Link from "next/link";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { categories } from "@/constants/mockData";
import { useAuthStore } from "@/zustand/auth.store";
import api from "@/utils/api.util";
import { fetchUser } from "@/apis/user.api";
import { useUserStore } from "@/zustand/user.store";
import { usePathname } from "next/navigation";

const Header = () => {
  const auth = useAuthStore(state => state.auth);
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);
  const handleLogout = useAuthStore(state => state.logout);
  const path = usePathname();

  const handleTestToken = async () => {
    try {
      return api.get('/auth/test-token', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    if (auth.accessToken) {
      fetchUser();
    } else {
      handleLogout();
    }
  }, [auth.accessToken]);

  return (
    <header className="shadow-[0_4px_3px_-1px_var(--color-neutral-500)] bg-gradient-to-b from-slate-50 to-transparent sticky top-0 z-5000">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}

        {/* Navigation links */}
        <nav className="hidden grid-flow-col gap-8 md:grid">
          <Link href="/" className={`text-2xl font-bold hover:text-gray-300 transition-colors mr-10 h-12 w-auto flex items-center`}>
            MyLogo
          </Link>
          {
            categories.map((item, index) => (
              <Link key={index} href={item.path} className={`text-lg font-medium text-gray-700 h-full flex items-center hover:text-gray-800 transition-colors 
                ${path === item.path ? 'text-gray-800 border-b-2 bg-gradient-to-t from-cyan-300 via-cyan-100 to-slate-50' : ''}`}>
                {item.title}
              </Link>
            ))
          }
        </nav>

        {/* Nút chuyển dark mode */}
        <div className="flex items-center gap-4">
          {/* <button onClick={handleTestToken} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:cursor-pointer">
            Test Token
          </button> */}
          <ThemeSwitcher />
          {
            user ? (
              <>
                <Link href="/profile" className="text-lg font-medium text-gray-700 hover:text-gray-800 transition-colors">
                  <img src={user.photoUrl} alt="avatar" className="w-8 h-8 rounded-full" />
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
