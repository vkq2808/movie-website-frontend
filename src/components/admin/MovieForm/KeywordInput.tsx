import React from "react";
import AutoCompleteMultiSelectInput, { Option } from "./AutoCompleteMultiSelectInput";
import { MovieFormValues } from "./MovieForm";
import { adminApi } from "@/apis/admin.api";

interface KeywordInputProps {
  keywords: Option[];
  onChange: (field: keyof MovieFormValues, newKeywords: Option[]) => void;
}

export default function KeywordInput({ keywords, onChange }: KeywordInputProps) {
  // Hàm fetch keyword từ backend (NestJS)
  const fetchSuggestions = async (query: string): Promise<string[]> => {
    const list = await adminApi.getMovieKeywords(query);
    return list.data.map(i => i.name);
  };

  return (
    <AutoCompleteMultiSelectInput
      label="Keywords"
      field="keywords"
      values={keywords}
      onChange={onChange}
      fetchSuggestions={fetchSuggestions}
      placeholder="Enter or select keywords..."
      cacheKey="keyword_suggestions"
    />
  );
}
