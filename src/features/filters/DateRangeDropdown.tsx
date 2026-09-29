import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { DATE_PRESETS, type DatePreset } from "../../types";

export interface DateRangeDropdownProps {
  selectedPreset: DatePreset;
  onChange: (preset: DatePreset) => void;
}

export const DateRangeDropdown = ({
  selectedPreset,
  onChange,
}: DateRangeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const activeLabel =
    DATE_PRESETS.find((p) => p.key === selectedPreset)?.label ?? "Last 7 days";

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/20"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-slate-400 dark:text-slate-500 font-normal">Range</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{activeLabel}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-44 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Time Window
          </div>
          {DATE_PRESETS.map((preset) => {
            const isSelected = preset.key === selectedPreset;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => {
                  onChange(preset.key);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{preset.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
