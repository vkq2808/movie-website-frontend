import React from "react";
import { AutoCompleteMultiSelectInput } from "../../extensibles/AutoCompleteMultiSelectInput";
import { adminApi, AdminLanguage } from "@/apis/admin.api";
import { CreateOptionModal, CreateOptionProps, CreateOptionState } from "@/components/extensibles/CreateOptionModal";
import { ToastContextValue } from "@/hooks/useToast";


class CreateLanguageModal extends CreateOptionModal<AdminLanguage> {

  renderModalContent(): React.JSX.Element {
    const { label } = this.props;
    return (
      <>
        <h2 className="text-lg text-white font-semibold mb-4">
          {label || "Create new option"}
        </h2>

        <div className="flex flex-col gap-3">
          {/* Name field */}
          <div>
            <label className="block text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={this.state.creatingOption?.name || ""}
              onChange={(e) =>
                this.setState({
                  creatingOption: { ...this.state.creatingOption, name: e.target.value },
                })
              }
              className="w-full rounded bg-gray-700 p-2 text-white"
              placeholder="Enter name..."
              required
            />
          </div>

          {/* English name field */}
          <div>
            <label className="block text-gray-400 mb-1">English name</label>
            <input
              type="text"
              value={this.state.creatingOption?.name || ""}
              onChange={(e) =>
                this.setState({
                  creatingOption: { ...this.state.creatingOption, name: e.target.value },
                })
              }
              className="w-full rounded bg-gray-700 p-2 text-white"
              placeholder="Enter english name..."
              required
            />
          </div>

          {/* Iso_639_1 field */}
          <div className="flex items-center gap-2">
            <label className="block text-gray-400 mb-1">Iso_639_1</label>
            <input
              type="text"
              value={this.state.creatingOption?.iso_639_1 || ""}
              onChange={(e) =>
                this.setState({
                  creatingOption: { ...this.state.creatingOption, iso_639_1: e.target.value },
                })
              }
              className="w-full rounded bg-gray-700 p-2 text-white"
              placeholder="Enter iso_639_1..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={this.closeModal}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
              onClick={(e) => this.handleSubmit(e)}
            >
              Create
            </button>
          </div>
        </div>
      </>
    )
  }
}

class LanguageMultipleInput extends AutoCompleteMultiSelectInput<AdminLanguage> {

  renderCreateModal(): React.JSX.Element {
    const handleSubmit = (newOption: AdminLanguage) => {
      this.addItem(newOption)
    }
    return (
      <CreateLanguageModal
        creatingOption={{ id: "", name: this.state.inputValue, iso_639_1: "" }}
        handleSubmit={handleSubmit}
        label="Create new language"
      />
    )
  }

  renderSelectedItem(item: AdminLanguage): React.JSX.Element {
    return (
      <div
        key={Date.now().toString()}
        className="flex h-full justify-between items-center gap-2 bg-white px-3 pt-3 pb-2.5 text-black rounded-full text-sm"
      >
        <div>
          <span>Name: </span>
          <span>{item.name}</span>
        </div>

        <div>
          <span>iso_639_1:</span>
          <span>{item.iso_639_1}</span>
        </div>

        <button
          onClick={() => this.removeItem(item.name, item.id)}
          className="text-white hover:text-gray-300 cursor-pointer"
        >
          ✕
        </button>
      </div>
    )
  }

  renderAllSelectedItem(values: AdminLanguage[]): React.JSX.Element {
    return (
      <div className="flex flex-col gap-2 mb-2">
        {values.map((item) => this.renderSelectedItem(item))}
      </div>
    )
  }
}

interface LanguageInputProps {
  languages: AdminLanguage[];
  onChange: (field: string, newLanguages: AdminLanguage[]) => void;
  toast: ToastContextValue;
}

export default function LanguageInput({
  languages,
  onChange,
  toast
}: LanguageInputProps) {
  // Hàm fetch keyword từ backend (NestJS)
  const fetchSuggestions = async (query: string): Promise<AdminLanguage[]> => {
    const list = await adminApi.findLanguages(query);
    return list.data;
  };

  return (
    <LanguageMultipleInput
      toast={toast}
      label="Spoken languages"
      field="spoken_languages"
      values={languages}
      onChange={onChange}
      fetchSuggestions={fetchSuggestions}
      placeholder="Enter or select languages..."
      cacheKey="spoken_languages_suggestions"
      allowCreation={false}
    />
  );
}
