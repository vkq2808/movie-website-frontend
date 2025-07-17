import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'res.cloudinary.com',
      'www.youtube.com',
      'i.ytimg.com',
      'img.youtube.com',
      'lh3.googleusercontent.com',
      "platform-lookaside.fbsbx.com",
      "image.tmdb.org"
    ],
  },
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With',
          },
        ],
      },
    ];
  },
  eslint: {
    dirs: ['src/app', 'src/components', 'src/zustand', 'src/apis', 'src/hooks', 'src/contexts', 'src/constants', 'src/dto'],
  },
};

export default nextConfig;
