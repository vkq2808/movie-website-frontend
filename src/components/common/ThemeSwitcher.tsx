"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { on } from "events";

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
      className="flex p-1 select-none rounded-full bg-gray-300 transition-colors"
    >
      <button
        onClick={toggleTheme}
        style={{
          width: "40px",
          height: "24px",
          borderRadius: "15px",
          backgroundColor: theme === "dark" ? "green" : "gray",
          border: "none",
          cursor: "pointer",
          position: "relative",
          outline: "none"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: theme === "dark" ? "16px" : "3px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s ease"
          }}
        />
      </button>
      <Moon size={24} />
    </div>
  );
}
