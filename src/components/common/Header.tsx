'use client';
import React from "react";
import Link from "next/link";
import { Genre, useAuthStore, useGenreStore, useUserStore } from "@/zustand";
import { usePathname } from "next/navigation";

const Header = () => {
  const auth = useAuthStore(state => state.auth);
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);
  const handleLogout = useAuthStore(state => state.logout);
  const path = usePathname();
  const genres = useGenreStore(state => state.genres);
  const [displayGenres, setDisplayGenres] = React.useState<Genre[]>([]);
  const fetchGenres = useGenreStore(state => state.fetchGenres);

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
    <header className="bg-gradient-to-b from-slate-900 fixed top-0 left-0 right-0 z-5000 ">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Navigation links */}
        <nav className="hidden grid-flow-col gap-4 md:grid">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold text-neutral-100 hover:text-gray-300 transition-colors mr-10 h-12 w-auto flex items-center`}>
            MyLogo
          </Link>
          <div className="flex justify-center items-center gap-4 ">
            {
              displayGenres.length > 6 ? (
                <>
                  {displayGenres.slice(0, 6).map((genre) => (
                    <Link key={genre._id} href={`/genre/${genre.slug}`} className={`text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors`}>
                      {genre.name}
                    </Link>
                  ))}
                  <Link href="/genre" className={`text-lg font-medium text-neutral-100 hover:text-gray-400 transition-colors`}>
                    Xem thêm
                  </Link>
                </>
              ) : (<></>)
            }
          </div>
        </nav>

        <div className="flex items-center gap-4">
          {/* <button onClick={handleTestToken} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:cursor-pointer">
            Test Token
          </button> */}
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
