"use client";

import { useEffect, useState } from "react";
import { Switcher } from "@/components/common";
import { Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="flex p-2 select-none rounded-full bg-gray-300 transition-colors"
    >
      <Switcher onChange={toggleTheme} initialValue={theme === "dark"} />
      <Moon size={28} />
    </div>
  );
}
