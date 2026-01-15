'use client';

import Link from 'next/link';
import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaQuestionCircle,
  FaUserAstronaut,
  FaPlusCircle,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Newsletter signup logic here
  };

  return (
    <footer className="bg-gradient-to-b from-black to-gray-800 pt-12 pb-6 text-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 select-none">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/genres" className="hover:text-purple-400 transition duration-300">Categories</Link></li>
              <li><Link href="/recommendations" className="hover:text-purple-400 transition duration-300">Top Rated</Link></li>
              <li><Link href="/new" className="hover:text-purple-400 transition duration-300">New Releases</Link></li>
              <li><Link href="/upcoming" className="hover:text-purple-400 transition duration-300">Upcoming</Link></li>
            </ul>
          </div>          {/* Customer Support */}
          <div>
            <h3 className="text-xl font-bold mb-4 select-none">Customer Support</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaPhone className="text-purple-400" />
                <Link href="tel:+84919309031" className="hover:text-purple-400 transition duration-300">
                  Hotline
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FaQuestionCircle className="text-purple-400" />
                <Link href="#" className="hover:text-purple-400 transition duration-300">FAQ</Link>
              </li>
              <li className="flex items-center gap-2">
                <FaUserAstronaut className="text-purple-400" />
                <Link href="#" className="hover:text-purple-400 transition duration-300">Help Center</Link>
              </li>
              <li className="flex items-center gap-2">
                <FaPlusCircle className="text-purple-400" />
                <Link href="#" className="hover:text-purple-400 transition duration-300">Registration Support</Link>
              </li>
            </ul>
          </div>          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4 select-none">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-purple-400 transition duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition duration-300">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition duration-300">About Us</Link></li>
            </ul>
          </div>          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 select-none">Latest Updates</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative flex justify-center items-center">
                <FaEnvelope className="left-3 text-purple-400 text-3xl" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-800 rounded-lg py-2 ml-3 pl-10 pr-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  aria-label="Email for newsletter"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <Link href="#" aria-label="Facebook" className=" hover:text-purple-400 transition duration-300">
                <FaFacebookF size={24} />
              </Link>
              <Link href="#" aria-label="Twitter" className=" hover:text-purple-400 transition duration-300">
                <FaTwitter size={24} />
              </Link>
              <Link href="#" aria-label="Instagram" className=" hover:text-purple-400 transition duration-300">
                <FaInstagram size={24} />
              </Link>
              <Link href="#" aria-label="YouTube" className=" hover:text-purple-400 transition duration-300">
                <FaYoutube size={24} />
              </Link>
              <Link href="#" aria-label="TikTok" className=" hover:text-purple-400 transition duration-300">
                <FaTiktok size={24} />
              </Link>
            </div>            <p className="text-gray-400 text-sm">
              © {currentYear} MovieHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
