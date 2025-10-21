/* eslint-disable @typescript-eslint/no-explicit-any */
///
///
///       Claude Sonet 4.5 Refferenced. 
///
///



import React from "react";

export type RadioSelectOption = {
  id: string;
  name: string;
};

type RadioSelectProps<T> = {
  options: T[];
  value?: string | null;
  onChange?: (id: string) => void;
  placeholder?: string;
  noOptionsText?: string;
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  maxResults?: number;
};

type State = {
  uncontrolledValue: string | null;
  query: string;
  open: boolean;
  activeIndex: number;
};

export default class SearchableRadioSelect<
  T extends RadioSelectOption,
  P extends RadioSelectProps<T> = RadioSelectProps<T>
> extends React.Component<P, State> {
  static defaultProps = {
    placeholder: "Search...",
    noOptionsText: "No options",
    className: "",
    searchable: true,
    clearable: true,
    maxResults: 250,
  };

  private id: string;
  private containerRef = React.createRef<HTMLDivElement>();
  private inputRef = React.createRef<HTMLInputElement>();
  private listRef = React.createRef<HTMLDivElement>();

  constructor(props: P) {
    super(props);
    this.id = `radio-select-${Math.random().toString(36).substr(2, 9)}`;
    this.state = {
      uncontrolledValue: props.value ?? null,
      query: "",
      open: false,
      activeIndex: -1,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleDocClick);
  }

  componentDidUpdate(prevProps: P, prevState: State) {
    const { value: controlledValue, options } = this.props;
    const { open, query } = this.state;

    // Sync uncontrolled value with controlled prop
    if (this.isControlled() && controlledValue !== prevProps.value) {
      this.setState({ uncontrolledValue: controlledValue ?? null });
    }

    // Update active index when dropdown opens or query changes
    if (
      open !== prevState.open ||
      query !== prevState.query ||
      options !== prevProps.options
    ) {
      if (!open) {
        this.setState({ activeIndex: -1 });
      } else {
        const filtered = this.getFilteredOptions();
        const idx = filtered.findIndex((f) => f.id === this.getSelectedId());
        this.setState({
          activeIndex: idx >= 0 ? idx : filtered.length ? 0 : -1,
        });
      }
    }
  }

  private isControlled = (): boolean => {
    return this.props.value !== undefined;
  };

  private getSelectedId = (): string | null => {
    return this.isControlled()
      ? this.props.value ?? null
      : this.state.uncontrolledValue;
  };

  private getFilteredOptions = (): T[] => {
    const { options, maxResults = 250 } = this.props;
    const { query } = this.state;
    const lower = query.trim().toLowerCase();

    if (!lower) return options.slice(0, maxResults);

    return options
      .filter(
        (o) =>
          (o.name || "").toLowerCase().includes(lower) ||
          (String(o.id) || "").toLowerCase().includes(lower)
      )
      .slice(0, maxResults);
  };

  private handleDocClick = (e: MouseEvent) => {
    if (!this.containerRef.current) return;
    if (!this.containerRef.current.contains(e.target as Node)) {
      this.setState({ open: false });
    }
  };

  private selectId = (id: string) => {
    const { onChange } = this.props;
    if (!this.isControlled()) {
      this.setState({ uncontrolledValue: id });
    }
    onChange?.(id);
    this.setState({ open: false });
    this.inputRef.current?.blur();
  };

  private scrollActiveIntoView = () => {
    if (!this.listRef.current) return;
    const { activeIndex } = this.state;
    const el = this.listRef.current.querySelectorAll<HTMLElement>(
      "[data-item-index]"
    )[activeIndex];
    el?.scrollIntoView({ block: "nearest" });
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { open, activeIndex, query } = this.state;
    const filtered = this.getFilteredOptions();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        this.setState({ open: true });
        return;
      }
      this.setState(
        {
          activeIndex: Math.min(filtered.length - 1, Math.max(0, activeIndex + 1)),
        },
        this.scrollActiveIntoView
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.setState(
        {
          activeIndex: Math.min(filtered.length - 1, Math.max(0, activeIndex - 1)),
        },
        this.scrollActiveIntoView
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        this.selectId(filtered[activeIndex].id);
      } else {
        this.setState({ open: !open });
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (query) {
        this.setState({ query: "" });
      } else {
        this.setState({ open: false });
      }
    }
  };

  render() {
    const {
      placeholder,
      noOptionsText,
      className,
      searchable,
      clearable,
      onChange,
    } = this.props;
    const { query, open, activeIndex } = this.state;
    const selectedId = this.getSelectedId();
    const filtered = this.getFilteredOptions();

    return (
      <div ref={this.containerRef} className={`relative ${className}`}>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <input
              ref={this.inputRef}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={`${this.id}-list`}
              aria-autocomplete="list"
              placeholder={placeholder}
              value={searchable ? query : ""}
              onChange={(e) => {
                this.setState({ query: e.target.value, open: true });
              }}
              onFocus={() => this.setState({ open: true })}
              onKeyDown={this.handleKeyDown}
              className="w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {clearable && selectedId && (
                <button
                  type="button"
                  onClick={() => {
                    if (!this.isControlled()) {
                      this.setState({ uncontrolledValue: null });
                    }
                    onChange?.(null as any);
                  }}
                  aria-label="Clear selection"
                  className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                onClick={() => this.setState({ open: !open })}
                aria-label={open ? "Close options" : "Open options"}
                className="text-sm px-2 py-1 rounded hover:bg-gray-100"
              >
                ▾
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-2 ${open ? "" : "hidden"}`}>
          <div
            id={`${this.id}-list`}
            ref={this.listRef}
            role="listbox"
            tabIndex={-1}
            className="max-h-60 overflow-auto rounded border border-gray-200 bg-white shadow-sm"
          >
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">{noOptionsText}</div>
            ) : (
              filtered.map((opt, i) => {
                const checked = opt.id === selectedId;
                const active = i === activeIndex;
                return (
                  <div
                    data-item-index={i}
                    key={opt.id}
                    role="option"
                    aria-selected={checked}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      this.selectId(opt.id);
                    }}
                    onMouseEnter={() => this.setState({ activeIndex: i })}
                    className={`flex items-start gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${active ? "bg-blue-50" : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name={`sr-${this.id}`}
                      checked={checked}
                      readOnly
                      className="mt-1"
                      tabIndex={-1}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {opt.name}
                      </div>
                      {opt.id && (
                        <div className="text-xs text-gray-500">{opt.id}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
}