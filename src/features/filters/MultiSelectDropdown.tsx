import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "../../lib/utils";
import type { FilterOption } from "../../types";

export interface MultiSelectDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const MultiSelectDropdown = ({
  label,
  options,
  selectedValues = [],
  onChange,
  isLoading = false,
  isError = false,
  onRetry,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const handleSelectAll = () => {
    onChange(options.map((o) => o.value));
  };

  const handleClear = () => {
    onChange([]);
  };

  // Determine display label
  const renderDisplay = () => {
    if (selectedValues.length === 0) {
      return <span className="font-semibold text-slate-700 dark:text-slate-200">All</span>;
    }
    if (selectedValues.length === 1) {
      const match = options.find((o) => o.value === selectedValues[0]);
      return (
        <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded text-[11px]">
          {match ? match.label : selectedValues[0]}
        </span>
      );
    }
    return (
      <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded text-[11px]">
        {selectedValues.length} selected
      </span>
    );
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/20"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
          selectedValues.length > 0 && "border-indigo-200 dark:border-indigo-800"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-slate-400 dark:text-slate-500 font-normal">{label}</span>
        {renderDisplay()}
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100 dark:border-slate-700/80 px-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Filter {label}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                All
              </button>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-4 text-center text-xs text-slate-400">Loading options...</div>
          ) : isError ? (
            <div className="p-2 text-center text-xs text-rose-500">
              Failed to load
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="block mx-auto mt-1 text-[11px] text-indigo-600 underline"
                >
                  Retry
                </button>
              )}
            </div>
          ) : options.length === 0 ? (
            <div className="py-2 text-center text-xs text-slate-400">No options</div>
          ) : (
            <div className="max-h-56 overflow-y-auto space-y-0.5">
              {options.map((option) => {
                const isChecked = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                      isChecked
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          isChecked
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                        )}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                    {isChecked && (
                      <span className="text-[10px] text-indigo-500 font-normal">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {selectedValues.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end px-1">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
              >
                <X className="w-3 h-3" />
                Reset {label} filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
