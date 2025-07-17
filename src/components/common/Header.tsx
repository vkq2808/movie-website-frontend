'use client';
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Genre, useAuthStore, useGenreStore } from "@/zustand";
import { ChevronDownIcon, SearchIcon, UserIcon } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useLanguage } from "@/contexts/language.context";
import Image from "next/image";

const Header = () => {
  const genres = useGenreStore(state => state.genres);
  const [displayGenres, setDisplayGenres] = React.useState<Genre[]>([]);
  const fetchGenres = useGenreStore(state => state.fetchGenres);
  const [search, setSearch] = React.useState('');
  const { language } = useLanguage();
  const router = useRouter();

  // Function to get genre name based on current language
  const getGenreName = (genre: Genre) => {
    const nameForLanguage = genre.names.find(n => n.iso_639_1 === language);
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
  }, [genres.length, fetchGenres, genres]);

  return (
    <header className="bg-gradient-to-b from-slate-900 to-transparent fixed top-0 left-0 right-0 z-5000 text-neutral-50">
      <div className="flex justify-between items-center w-full px-4">
        {/* Navigation links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold text-neutral-100 hover:text-gray-300 transition-colors mr-10 h-12 w-auto flex items-center`}>
            MyLogo
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
            <PopoverPanel className="absolute z-10 mt-2 w-screen max-w-lg pr-8 bg-gray-800 p-4 rounded shadow-lg focus:outline-none">
              {({ close }) => (
                <div className="grid grid-cols-4 gap-6">
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
  const fetchUser = useAuthStore(state => state.fetchUser);
  const handleLogout = useAuthStore(state => state.logout);

  React.useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Image src={user.photo_url} width={32} height={32} alt="User Avatar" className="w-8 h-8 rounded-full" />
          <Link href="/profile" className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors">
            {user.username || user.email}
          </Link>
          <button
            onClick={handleLogout}
            className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors"
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <Link href="/auth/login" className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors">
          Đăng nhập
        </Link>
      )}
    </div>
  );
}

export default Header;
