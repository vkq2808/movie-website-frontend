import React from "react";
import Link from "next/link";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { categories } from "@/constants/mockData";

const Header = () => {



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
              <Link key={index} href={item.path} className="text-lg font-medium text-gray-600 hover:text-gray-800 transition-colors">
                {item.title}
              </Link>
            ))
          }
        </nav>

        {/* Nút chuyển dark mode */}
        <div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
