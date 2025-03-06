/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Sử dụng class để điều khiển Dark Mode
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
