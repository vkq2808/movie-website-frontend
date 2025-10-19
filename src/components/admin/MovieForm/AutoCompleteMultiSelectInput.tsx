"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { MovieFormValues } from "./MovieForm";

export interface Option {
  id: string;
  name: string;
}

interface AutoCompleteMultiSelectInputProps {
  label?: string;
  field: keyof MovieFormValues;
  values: Option[];
  onChange: (field: keyof MovieFormValues, newValues: Option[]) => void;
  fetchSuggestions: (query: string) => Promise<string[]>; // ⚡️ thay vì truyền list sẵn
  placeholder?: string;
  cacheKey?: string; // optional cache key
}

export default function AutoCompleteMultiSelectInput({
  label,
  values,
  field,
  onChange,
  fetchSuggestions,
  placeholder = "Type and press Enter...",
  cacheKey = "keyword_cache",
}: AutoCompleteMultiSelectInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(inputValue, 400);
  const cacheRef = useRef<Map<string, string[]>>(new Map());

  // Gọi API hoặc dùng cache
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setShowSuggestions(false);
      return;
    }

    const cached = cacheRef.current.get(debouncedQuery.toLowerCase());
    if (cached) {
      setSuggestions(cached);
      setShowSuggestions(true);
      return;
    }

    let cancelled = false;
    fetchSuggestions(debouncedQuery).then((data) => {
      if (!cancelled) {
        cacheRef.current.set(debouncedQuery.toLowerCase(), data);
        setSuggestions(data);
        setShowSuggestions(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, fetchSuggestions]);

  const addItem = (name: string) => {
    const trimmed = name.trim().replace(/\s+/g, " ");
    if (!trimmed) return;

    if (values.some((v) => v.name.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }

    onChange(field, [...values, { id: String(Date.now()), name: trimmed }]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeItem = (id: string) => onChange(field, values.filter((v) => v.id !== id));

  return (
    <div className="relative w-full">
      {label && <label className="block text-gray-400 mb-1">{label}</label>}

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-full text-sm"
          >
            <span>{item.name}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-white hover:text-gray-300 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded bg-gray-800 p-2 text-white"
        placeholder={placeholder}
      />

      {/* Suggestion dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-gray-700 w-full rounded mt-1 max-h-40 overflow-auto shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => addItem(s)}
              className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
