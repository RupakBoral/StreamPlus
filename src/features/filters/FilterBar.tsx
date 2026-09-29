import React from "react";
import { Activity, Moon, Sun, RotateCcw } from "lucide-react";
import { DateRangeDropdown } from "./DateRangeDropdown";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { useDimensionOptions } from "../../hooks/useDimensionOptions";
import type { DatePreset, DimensionKey, Filters } from "../../types";

export interface FilterBarProps {
  rangePreset: DatePreset;
  filters: Filters;
  onRangeChange: (preset: DatePreset) => void;
  onFilterChange: (dimension: DimensionKey, values: string[]) => void;
  onClearFilters: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  rangePreset,
  filters,
  onRangeChange,
  onFilterChange,
  onClearFilters,
  isDarkMode,
  onToggleTheme,
}) => {
  // Dimension options
  const deviceOptions = useDimensionOptions("device");
  const countryOptions = useDimensionOptions("country");
  const cdnOptions = useDimensionOptions("cdn");

  const hasActiveFilters = Boolean(
    (filters.device && filters.device.length > 0) ||
    (filters.country && filters.country.length > 0) ||
    (filters.cdn && filters.cdn.length > 0)
  );

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 px-1">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
          <Activity className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            StreamPulse
          </span>
          <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            QoE
          </span>
        </div>
      </div>

      {/* Reset Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            title="Reset all dimension filters"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Date Range Selector */}
        <DateRangeDropdown
          selectedPreset={rangePreset}
          onChange={onRangeChange}
        />

        {/* Device Multi-Select */}
        <MultiSelectDropdown
          label="Device"
          options={deviceOptions.data ?? []}
          selectedValues={filters.device ?? []}
          onChange={(values) => onFilterChange("device", values)}
          isLoading={deviceOptions.isLoading}
          isError={deviceOptions.isError}
          onRetry={() => deviceOptions.refetch()}
        />

        {/* Country Multi-Select */}
        <MultiSelectDropdown
          label="Country"
          options={countryOptions.data ?? []}
          selectedValues={filters.country ?? []}
          onChange={(values) => onFilterChange("country", values)}
          isLoading={countryOptions.isLoading}
          isError={countryOptions.isError}
          onRetry={() => countryOptions.refetch()}
        />

        {/* CDN Multi-Select */}
        <MultiSelectDropdown
          label="CDN"
          options={cdnOptions.data ?? []}
          selectedValues={filters.cdn ?? []}
          onChange={(values) => onFilterChange("cdn", values)}
          isLoading={cdnOptions.isLoading}
          isError={cdnOptions.isError}
          onRetry={() => cdnOptions.refetch()}
        />

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
