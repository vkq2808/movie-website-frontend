"use client";
import React, { useEffect, useState } from "react";
import { Option, AutoCompleteMultiSelectInput } from "../../extensibles/AutoCompleteMultiSelectInput";
import { adminApi, AdminGenre } from "@/apis/admin.api"; // Giả sử bạn có module API
import { ToastContextValue } from "@/hooks/useToast";
import { MovieFormValues } from "./MovieForm";

interface GenreInputProps {
  currentLanguage: { iso_639_1: string };
  values: { id: string; names: { iso_639_1: string; name: string }[] }[];
  onChange: (field: keyof MovieFormValues, newGenres: Option[]) => void;
  toast: ToastContextValue;
}

export const GenreInput: React.FC<GenreInputProps> = ({
  currentLanguage = {
    iso_639_1: 'en'
  },
  values,
  onChange,
  toast
}) => {
  const fetchGenres = async () => {
    try {
      const { data } = await adminApi.getGenres();

      return data.map((g) => ({
        id: g.id,
        name:
          g.names.find((n) => n.iso_639_1 === currentLanguage.iso_639_1)?.name ||
          g.names[0]?.name,
      }));
    } catch (error) {
      return []
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
      toast={toast}
      label={"Genre"}
      values={filteredValues}
      fetchSuggestions={fetchGenres}
      field="genres"
      onChange={handleChange}
      placeholder="Search or add genres..."
    />
  );
};
