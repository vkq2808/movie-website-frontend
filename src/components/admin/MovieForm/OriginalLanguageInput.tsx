import { adminApi, AdminLanguage } from "@/apis/admin.api";
import SearchableRadioSelect from "@/components/extensibles/SearchableRadioSelect";
import { JSX, useEffect, useMemo, useState } from "react";
import { MovieFormValues } from "./MovieForm";

class OriginalLanguageSearchableRadioSelect extends SearchableRadioSelect<AdminLanguage> {

  renderHeader(): JSX.Element {
    return (
      <div className="flex w-full">
        <h2>Original Language</h2>
      </div>
    )
  }

  renderOptionContent(opt: AdminLanguage): JSX.Element {
    return (
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">
          {opt.name}
        </div>
        {opt.iso_639_1 && (
          <div className="text-xs text-gray-500">{opt.iso_639_1}</div>
        )}
      </div>
    )
  }
}

type OriginalLanguageInputProps = {
  onChange: (field: keyof MovieFormValues, l: AdminLanguage) => void;
};

export const OriginalLanguageInput = ({ onChange }: OriginalLanguageInputProps) => {
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data } = await adminApi.getLanguages();
        setLanguages(data);
      } catch (err) {
        console.error("Failed to load languages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleChange = (l: AdminLanguage) => {
    onChange('original_language', l);
  }

  if (loading) {
    return <div>Loading languages...</div>;
  }

  return (
    <OriginalLanguageSearchableRadioSelect
      options={languages}
      onChange={handleChange}
    />
  );
};