"use client";
import React, { Component, ChangeEvent, FormEvent } from "react";
import { MovieFormValues } from "../admin/MovieForm/MovieForm";
import { CreateOptionModal } from "./CreateOptionModal";
import { ToastContextValue, useToast } from "@/contexts/toast.context";

export interface Option {
  id?: string;
  name: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface AutoCompleteMultiSelectInputProps<T> {
  label?: string;
  field: keyof MovieFormValues;
  values: T[];
  onChange: (field: keyof MovieFormValues, newValues: T[]) => void;
  fetchSuggestions: (query: string) => Promise<T[]>;
  placeholder?: string;
  cacheKey?: string;
  toast: ToastContextValue;
  limit?: number;
  allowCreation?: boolean;
}

export interface AutoCompleteMultiSelectInputState<T> {
  inputValue: string;
  suggestions: T[];
  showSuggestions: boolean;
  showCreateModal: boolean;
}

export class AutoCompleteMultiSelectInput<T extends Option>
  extends Component<AutoCompleteMultiSelectInputProps<T>, AutoCompleteMultiSelectInputState<T>> {
  private cacheRef = new Map<string, T[]>();
  private debounceTimer?: NodeJS.Timeout;
  toast: ToastContextValue;

  constructor(props: AutoCompleteMultiSelectInputProps<T>) {
    super(props);
    this.state = {
      inputValue: "",
      suggestions: [],
      showSuggestions: false,
      showCreateModal: false,
    };
    this.toast = props.toast;
  }

  // ======================================================
  // FETCH + INPUT + ADD/REMOVE
  // ======================================================
  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    this.debounceFetch(value);
  };

  debounceFetch = (query: string) => {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.fetchSuggestions(query), 400);
  };

  async fetchSuggestions(query: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      this.setState({ showSuggestions: false });
      return;
    }

    const cached = this.cacheRef.get(trimmed.toLowerCase());
    if (cached) {
      this.setState({ suggestions: cached, showSuggestions: true });
      return;
    }

    const data = await this.props.fetchSuggestions(trimmed);
    this.cacheRef.set(trimmed.toLowerCase(), data);
    this.setState({ suggestions: data, showSuggestions: true });
  }

  addItem = (item: T) => {
    const trimmed = item.name.trim().replace(/\s+/g, " ");
    if (!trimmed) return;

    const { values, field, onChange } = this.props;
    if (values.some((v) => v.name.toLowerCase() === trimmed.toLowerCase())) {
      this.setState({ inputValue: "" });
      return;
    }

    onChange(field, [...values, { ...item, name: trimmed } as T]);
    this.setState({ inputValue: "", showSuggestions: false });
    this.toast.success("Successfully add " + this.props.label)
  };

  removeItem = (name: string, id?: string) => {

    const { values, field, onChange } = this.props;
    if (!id) {
      onChange(field, values.filter((v) => v.name !== name))
      return;
    }
    onChange(field, values.filter((v) => v.id !== id));
    this.toast.success("Successfully remove " + this.props.label)
  };

  // ======================================================
  // RENDER PARTS
  // ======================================================

  renderCreateModal() {
    class CreateOptionClass extends CreateOptionModal<T> { }
    const creatingOption = {
      id: "",
      name: this.state.inputValue || "Hello world"
    }
    return (
      <CreateOptionClass creatingOption={creatingOption as T} handleSubmit={this.addItem} />
    );
  }

  renderSuggestionItem(s: T, i: number) {
    return (
      <li
        key={i}
        onClick={() => this.addItem(s)}
        className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-white"
      >
        {s.name}
      </li>
    );
  }

  renderSelectedItem(item: T) {
    return (
      <div
        key={item.id}
        className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-full text-sm"
      >
        <span>{item.name}</span>
        <button
          onClick={() => this.removeItem(item.name, item.id)}
          className="text-white hover:text-gray-300 cursor-pointer"
        >
          ✕
        </button>
      </div>
    );
  }

  renderAllSelectedItem(values: T[]) {
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((item) => this.renderSelectedItem(item))}
      </div>
    );
  }

  // ======================================================
  // MAIN RENDER
  // ======================================================
  render() {
    const { label, placeholder = "Type to search...", values, limit = 100, allowCreation = true } = this.props;
    const { inputValue, suggestions, showSuggestions } = this.state;

    const showCreateButton =
      inputValue.trim().length > 0 &&
      !suggestions.some(
        (s) => s.name.toLowerCase() === inputValue.trim().toLowerCase()
      );

    return (
      <div className="relative w-full">
        {label && <label className="block text-gray-400 mb-1">{label}</label>}

        {this.renderAllSelectedItem(values)}

        <input
          type="text"
          value={inputValue}
          onChange={this.handleInputChange}
          className="w-full rounded bg-gray-800 p-2 text-white"
          placeholder={placeholder}
          disabled={values.length >= limit}
        />

        {/* Dropdown */}
        {showSuggestions && (
          <ul className="absolute z-10 bg-gray-700 w-full rounded mt-1 max-h-40 overflow-auto shadow-lg">
            {suggestions.map((s, i) => this.renderSuggestionItem(s, i))}
            {showCreateButton && allowCreation && (this.renderCreateModal())}
          </ul>
        )}
      </div>
    );
  }
}


function withToast<P>(
  WrappedComponent: React.ComponentType<P & { toast: ToastContextValue }>
) {
  return function WithToast(props: P) {
    const toast = useToast();
    return <WrappedComponent {...props} toast={toast} />;
  };
}

export default withToast(AutoCompleteMultiSelectInput);
