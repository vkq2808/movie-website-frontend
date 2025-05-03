'use client';
import React from "react";
import Link from "next/link";
import { Genre, useAuthStore, useGenreStore, useUserStore } from "@/zustand";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, SearchIcon, UserIcon } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const Header = () => {
  const auth = useAuthStore(state => state.auth);
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);
  const handleLogout = useAuthStore(state => state.logout);
  const path = usePathname();
  const genres = useGenreStore(state => state.genres);
  const [displayGenres, setDisplayGenres] = React.useState<Genre[]>([]);
  const fetchGenres = useGenreStore(state => state.fetchGenres);
  const [search, setSearch] = React.useState('');

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
      newDisplayGenres.push({ _id: 'home', name: 'Trang chủ', slug: '' });
      newDisplayGenres.push(...(genres.map((item) => { return { _id: item._id, name: item.name, slug: item.slug } })));
      setDisplayGenres(newDisplayGenres);
    } else {
      fetchGenres();
    }
    console.log(genres)
  }, [genres]);

  return (
    <header className="bg-gradient-to-b from-slate-900 fixed top-0 left-0 right-0 z-5000 text-neutral-50">
      <div className="flex justify-between items-center w-full px-4 bg-neutral-950">
        {/* Navigation links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold text-neutral-100 hover:text-gray-300 transition-colors mr-10 h-12 w-auto flex items-center`}>
            MyLogo
          </Link>
          <div className="flex-1 mx-4 relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm phim, diễn viên"
              className="w-full h-10 pl-10 pr-4 rounded placeholder-neutral-50 focus:outline-none"
            />
            <SearchIcon className="w-5 h-5 text-neutral-50 absolute left-3 top-2.5" />
          </div>
          <Link href="/chu-de">Chủ Đề</Link>

          {/* Mega menu "Thể loại" */}
          <Popover className="relative">
            <PopoverButton className="flex items-center space-x-1cursor-pointer focus:ring-0">
              <span>Thể Loại</span>
              <ChevronDownIcon className="w-4 h-4" />
            </PopoverButton>

            <PopoverPanel className="absolute z-10 mt-2 w-screen max-w-md bg-gray-800 p-4 rounded shadow-lg">
              <div className="grid grid-cols-4 gap-4">
                {genres.map(g => (
                  <Link className="block px-2 py-1 hover:bg-gray-700 rounded" key={g._id} href={`/genre/${g.slug}`}>
                    {g.name}
                  </Link>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </nav>

        {/* Mobile menu button and user */}


        <div className="flex items-center gap-4">
          {/* <button onClick={handleTestToken} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:cursor-pointer">
            Test Token
          </button> */}
          <div className="flex items-center lg:hidden space-x-4">
            <UserIcon className="w-6 h-6" />
            {/* Implement a mobile slide-out menu here if needed */}
          </div>
          {
            user ? (
              <>
                <Link href="/profile" className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors">
                  <img src={user.photoUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                </Link>
                <div className="cursor-pointer text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors" onClick={handleLogout}>
                  Đăng xuất
                </div>
              </>
            ) :
              (
                <Link href="/auth/login" className="text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors">
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
