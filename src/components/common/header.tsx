import React from "react";
import Link from "next/link";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";

const Header = () => {



  return (
    <header className="shadow-[0_4px_3px_-1px_var(--color-neutral-500)]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
          MyLogo
        </Link>

        {/* Navigation links */}
        <nav className="grid grid-flow-col gap-8">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
          <Link href="/services" className="hover:text-gray-300 transition-colors">
            Services
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">
            Contact
          </Link>
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
