"use client";
import React, { useEffect, useState } from "react";
import AutoCompleteMultiSelectInput, { Option } from "./AutoCompleteMultiSelectInput";
import { adminApi, AdminGenre } from "@/apis/admin.api"; // Giả sử bạn có module API
import { MovieFormValues } from "./MovieForm";

interface GenreInputProps {
  label?: string;
  currentLanguage: { iso_639_1: string };
  values: { id: string; names: { iso_639_1: string; name: string }[] }[];
  onChange: (field: keyof MovieFormValues, newGenres: Option[]) => void;
}

export const GenreInput: React.FC<GenreInputProps> = ({
  label = "Genres",
  currentLanguage = {
    iso_639_1: 'vi'
  },
  values,
  onChange
}) => {
  const fetchGenres = async () => {
    try {
      const res = await adminApi.getGenres();
      return res.data.map((g: AdminGenre) => (g.names.find((n) => n.iso_639_1 === currentLanguage.iso_639_1)?.name)).filter(i => i != undefined)
    } catch (error) {
      return []
      console.error("Failed to fetch genres", error);
    }
  };

  const selected = values.map((g) => ({
    id: g.id,
    name:
      g.names.find((n) => n.iso_639_1 === currentLanguage.iso_639_1)?.name ||
      g.names[0]?.name,
  }));

  const handleChange = (field: keyof MovieFormValues, items: { id: string; name: string }[]) => {
    const updated = items.map((i) => ({
      id: i.id,
      name: i.name,
    }));
    onChange(field, updated);
  };

  const convertedValues = values.map(v => ({ id: v.id, name: (v.names.find(n => n.iso_639_1 === currentLanguage.iso_639_1)?.name || "") }))
  const filteredValues = convertedValues.filter(v => v.name != "");

  return (
    <AutoCompleteMultiSelectInput
      label={label}
      values={filteredValues}
      fetchSuggestions={fetchGenres}
      field="genres"
      onChange={handleChange}
      placeholder="Search or add genres..."
    />
  );
};
