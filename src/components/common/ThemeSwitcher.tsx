"use client";

import React, { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import useThemeStore from "@/zustand/theme.store";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();

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
        className={`w-10 h-6 rounded-full flex items-center justify-between transition-colors ${theme === "dark" ? "bg-green-500" : "bg-gray-300"
          }`}
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
