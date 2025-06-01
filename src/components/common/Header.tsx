'use client';
import React from "react";
import Link from "next/link";
import { Genre, useAuthStore, useGenreStore, useUserStore } from "@/zustand";
import { ChevronDownIcon, SearchIcon, UserIcon, Globe2Icon } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useHydration } from "@/hooks/useHydration";
import { useGlobalStore } from "@/zustand/global.store";
import { useLanguageStore, SUPPORTED_LANGUAGES } from "@/zustand";

const Header = () => {
  const auth = useAuthStore(state => state.auth); const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);
  const handleLogout = useAuthStore(state => state.logout);
  const genres = useGenreStore(state => state.genres);
  const [displayGenres, setDisplayGenres] = React.useState<Genre[]>([]); const fetchGenres = useGenreStore(state => state.fetchGenres);
  const [search, setSearch] = React.useState('');
  const { currentLanguage, setLanguage } = useLanguageStore();

  // Function to get genre name based on current language
  const getGenreName = (genre: Genre) => {
    const nameForLanguage = genre.names.find(n => n.iso_639_1 === currentLanguage.iso_639_1);
    return nameForLanguage ? nameForLanguage.name : genre.names[0]?.name || 'Unknown';
  };

  React.useEffect(() => {
    if (auth.accessToken) {
      fetchUser();
    } else {
      handleLogout();
    }
  }, [auth.accessToken]);

  React.useEffect(() => {
    if (genres.length > 0) {
      let newDisplayGenres: Genre[] = [];
      newDisplayGenres.push({ id: 'home', names: [{ name: 'Trang chủ', iso_639_1: 'vi' }, { iso_639_1: 'en', name: 'Home' }], original_id: '', created_at: '', updated_at: '' });
      newDisplayGenres.push(...genres);
      setDisplayGenres(newDisplayGenres);
    } else {
      fetchGenres();
    }
  }, [genres]);

  return (
    <header className="bg-gradient-to-b from-slate-900 to-transparent fixed top-0 left-0 right-0 z-5000 text-neutral-50">
      <div className="flex justify-between items-center w-full px-4">
        {/* Navigation links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold text-neutral-100 hover:text-gray-300 transition-colors mr-10 h-12 w-auto flex items-center`}>
            MyLogo
          </Link>
          <div className="flex-1 mx-4 relative">            <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={currentLanguage.iso_639_1 === 'en' ? 'Search movies, actors' : 'Tìm kiếm phim, diễn viên'}
            className="w-full h-10 pl-10 pr-4 rounded placeholder-neutral-50 focus:outline-none"
          />
            <SearchIcon className="w-5 h-5 text-neutral-50 absolute left-3 top-2.5" />
          </div>          <Link href="/chu-de">{currentLanguage.iso_639_1 === 'en' ? 'Topics' : 'Chủ Đề'}</Link>

          {/* Mega menu "Thể loại" */}
          <Popover className="relative">            <PopoverButton className="flex items-center space-x-1cursor-pointer focus:outline-none">
            <span>{currentLanguage.iso_639_1 === 'en' ? 'Genres' : 'Thể Loại'}</span>
            <ChevronDownIcon className="w-4 h-4" />
          </PopoverButton>

            <PopoverPanel className="absolute z-10 mt-2 w-screen max-w-md bg-gray-800 p-4 rounded shadow-lg focus:outline-none">
              <div className="grid grid-cols-4 gap-4">
                {genres.map(g => (
                  <Link className="block px-2 py-1 hover:bg-gray-700 rounded" key={g.id} href={`/genre/${g.original_id}`}>
                    {getGenreName(g)}
                  </Link>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </nav>

        {/* Mobile menu button and user */}        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <Popover className="relative">
            <PopoverButton className="flex items-center space-x-1 focus:outline-none">
              <Globe2Icon className="w-5 h-5" />
            </PopoverButton>

            <PopoverPanel className="absolute z-10 mt-2 w-48 bg-gray-800 p-2 rounded shadow-lg focus:outline-none right-0">              <div className="flex flex-col gap-1">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.iso_639_1}
                  className={`px-4 py-2 text-left hover:bg-gray-700 rounded transition-colors ${currentLanguage.iso_639_1 === lang.iso_639_1 ? 'bg-gray-700' : ''
                    }`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            </PopoverPanel>
          </Popover>

          {/* User Section */}
          <div className="flex items-center lg:hidden space-x-4">
            <UserIcon className="w-6 h-6" />
          </div>
          {user ? (
            <>
              <Link href="/profile" className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors">
                <img src={user.photo_url} alt="avatar" className="w-8 h-8 rounded-full" />
              </Link>
              <div className="cursor-pointer text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors" onClick={handleLogout}>
                {currentLanguage.iso_639_1 === 'en' ? 'Logout' : 'Đăng xuất'}
              </div>
            </>
          ) : (
            <Link href="/auth/login" className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors">
              {currentLanguage.iso_639_1 === 'en' ? 'Login' : 'Đăng nhập'}
            </Link>
          )}
        </div>
      </div >
    </header >
  );
};

export default Header;
