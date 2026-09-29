import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import { DIMENSION_LABELS, type DimensionKey } from "../../../types";

interface ChartHeaderProps {
  chartTitle: string;
  subtitle: string;
  groupBy: DimensionKey | null;
  onGroupByChange: (groupBy: DimensionKey | null) => void;
}

const groupOptions: { label: string; value: DimensionKey | null }[] = [
  { label: "None", value: null },
  { label: "Device", value: "device" },
  { label: "Country", value: "country" },
  { label: "CDN", value: "cdn" },
];

export const ChartHeader = ({
  chartTitle,
  subtitle,
  groupBy,
  onGroupByChange,
}: ChartHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const currentGroupLabel = groupBy
    ? DIMENSION_LABELS[groupBy] ?? groupBy
    : "None";

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {chartTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Group By selector dropdown */}
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <span className="text-slate-400 dark:text-slate-500 font-normal">Group by</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {currentGroupLabel}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 z-40 mt-1.5 w-36 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-1 animate-in fade-in zoom-in-95 duration-100">
            {groupOptions.map((opt) => {
              const isSelected = opt.value === groupBy;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    onGroupByChange(opt.value);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
