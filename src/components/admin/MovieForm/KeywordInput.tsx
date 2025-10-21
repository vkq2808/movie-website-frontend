import React from "react";
import { AutoCompleteMultiSelectInput, Option } from "../../extensibles/AutoCompleteMultiSelectInput";
import { adminApi, AdminKeyword } from "@/apis/admin.api";
import { CreateOptionModal, CreateOptionProps, CreateOptionState } from "@/components/extensibles/CreateOptionModal";
import { ToastContextValue } from "@/contexts/toast.context";


class CreateKeywordModal extends CreateOptionModal<AdminKeyword> {
}

class KeywordMultipleInput extends AutoCompleteMultiSelectInput<AdminKeyword> {

  renderCreateModal(): React.JSX.Element {

    const handleSubmit = (newOption: AdminKeyword) => {
      this.addItem(newOption)
    }

    return (
      <CreateKeywordModal creatingOption={{ id: "", name: this.state.inputValue }} handleSubmit={handleSubmit} label="Create new keyword" />
    )
  }
}

interface KeywordInputProps {
  keywords: AdminKeyword[];
  onChange: (field: string, newKeywords: Option[]) => void;
  toast: ToastContextValue;
}

export default function KeywordInput({
  keywords,
  onChange,
  toast
}: KeywordInputProps) {
  // Hàm fetch keyword từ backend (NestJS)
  const fetchSuggestions = async (query: string): Promise<AdminKeyword[]> => {
    const list = await adminApi.getMovieKeywords(query);
    return list.data;
  };

  return (
    <KeywordMultipleInput
      toast={toast}
      label="Keyword"
      field="keywords"
      values={keywords}
      onChange={onChange}
      fetchSuggestions={fetchSuggestions}
      placeholder="Enter or select keywords..."
      cacheKey="keyword_suggestions"
    />
  );
}
