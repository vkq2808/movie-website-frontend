'use client';
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, useGenreStore, useLanguageStore } from "@/zustand";
import { ChevronDownIcon, SearchIcon, UserIcon } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/useToast";
import { Genre } from "@/types/api.types";

const Header = () => {
  const genres = useGenreStore(state => state.genres);
  const [displayGenres, setDisplayGenres] = React.useState<Genre[]>([]);
  const fetchGenres = useGenreStore(state => state.fetchGenres);
  const [search, setSearch] = React.useState('');
  const router = useRouter();
  const { settings } = useSettings();
  const language = useLanguageStore(l => l.currentLanguage);

  // Function to get genre name based on current language
  const getGenreName = (genre: Genre) => {
    const nameForLanguage = genre.names.find(n => n.iso_639_1 === language.iso_639_1);
    return nameForLanguage ? nameForLanguage.name : genre.names[0]?.name || 'Unknown';
  };

  React.useEffect(() => {
    if (genres.length > 0) {
      const newDisplayGenres: Genre[] = [];
      newDisplayGenres.push(...genres);
      setDisplayGenres(newDisplayGenres);
    } else {
      fetchGenres();
    }
  }, [genres.length, fetchGenres]);

  return (
    <header className="bg-gradient-to-b from-slate-900 to-transparent fixed top-0 left-0 right-0 z-5000 text-neutral-50">
      <div className="flex justify-between items-center w-full px-4">
        {/* Navigation links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold text-neutral-100 hover:text-gray-300 transition-colors mr-10 h-12 w-auto flex items-center`}>
            {settings?.siteName || 'MovieStream'}
          </Link>
          <div className="flex-2 mx-4 relative">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                router.push(`/search?q=${encodeURIComponent(search.trim())}`);
              }
            }}>              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm phim, diễn viên"
                className="w-full h-10 pl-10 pr-10 rounded placeholder-neutral-50 focus:outline-none bg-gray-800/70"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <SearchIcon className="w-5 h-5 text-neutral-50" />
              </button>
            </form>
          </div>

          {/* Mega menu "Thể loại" */}
          <Popover className="relative">            <PopoverButton className="flex items-center space-x-1 cursor-pointer focus:outline-none min-w-24">
            <span>Thể loại</span>
            <ChevronDownIcon className="w-4 h-4" />
          </PopoverButton>
            <PopoverPanel className="absolute z-10 mt-2 w-screen max-w-xl pr-8 bg-gray-800 p-4 rounded shadow-lg focus:outline-none">
              {({ close }) => (
                <div className="grid grid-cols-4 gap-6 w-full">
                  {displayGenres.map(g => (
                    <Link
                      className="block px-2 py-1 w-32 hover:bg-gray-700 text-center break-words hyphens-auto overflow-hidden hover:z-10 hover:scale-110 transition-all"
                      key={g.id}
                      href={`/search?genres=${g.id}`}
                      title={getGenreName(g)}
                      onClick={() => {
                        close();
                      }}
                    >
                      {getGenreName(g)}
                    </Link>
                  ))}
                </div>
              )}
            </PopoverPanel>
          </Popover>

          {/* Wallet & Purchases Links */}
          <Link
            href="/purchase"
            className="flex items-center space-x-1 hover:text-gray-300 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13h10M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <span>Purchase</span>
          </Link>

          <Link
            href="/wallet"
            className="flex items-center space-x-1 hover:text-gray-300 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>Wallet</span>
          </Link>

          <Link
            href="/purchases"
            className="flex items-center space-x-1 hover:text-gray-300 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>My Movies</span>
          </Link>
        </nav>

        {/* Mobile menu button and user */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          {/* <LanguageSwitcher className="hidden lg:block" /> */}

          {/* User Section */}
          <div className="flex items-center lg:hidden space-x-4">
            <UserIcon className="w-6 h-6" />
          </div>
          <UserInformation />
        </div>
      </div >
    </header >
  );
};

const UserInformation = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const router = useRouter();
  const toast = useToast();

  const handleLoginNavigate = () => {
    // Redirect to login with current path as query
    const currentPath = window.location.pathname
    if (currentPath === "/") {
      router.push('/auth/login')
    } else if (currentPath.startsWith("/auth/login")) {
      router.refresh();
    } else {
      router.push(`/auth/login?from=${encodeURIComponent(currentPath)}`)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Image src={user.photo_url ?? '/default-avatar.png'} width={32} height={32} alt="User Avatar" className="w-8 h-8 rounded-full" />
          <Link href="/profile" className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors">
            {user.username || user.email}
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin" prefetch={false} className="text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Admin
            </Link>
          )}
          <button
            onClick={() => {
              try {
                logout();
                toast.success('Đăng xuất thành công');
              } catch (e) {
                toast.error('Đăng xuất thất bại');
              }
            }}
            className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors"
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <div onClick={handleLoginNavigate} className="text-lg cursor-pointer font-medium text-neutral-100 hover:text-gray-400 transition-colors">
          Đăng nhập
        </div>
      )}
    </div>
  );
}

export default Header;
