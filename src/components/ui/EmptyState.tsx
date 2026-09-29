import { useMemo } from "react";
import { Inbox, FilterX } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Filters } from "../../types";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  filters?: Filters;
  onClearFilters?: () => void;
  className?: string;
}

export const EmptyState = ({
  title = "No data available",
  message,
  filters,
  onClearFilters,
  className,
}: EmptyStateProps) => {
  const activeFiltersSummary = useMemo(() => {
    if (!filters) return null;
    const parts: string[] = [];
    if (filters.device && filters.device.length > 0) {
      parts.push(`Device: ${filters.device.join(", ")}`);
    }
    if (filters.country && filters.country.length > 0) {
      parts.push(`Country: ${filters.country.join(", ")}`);
    }
    if (filters.cdn && filters.cdn.length > 0) {
      parts.push(`CDN: ${filters.cdn.join(", ")}`);
    }
    return parts.length > 0 ? parts.join(" • ") : null;
  }, [filters]);

  const displayMessage =
    message ||
    (activeFiltersSummary
      ? `No playback sessions match active filters (${activeFiltersSummary}). Try broadening your filters.`
      : "No playback sessions recorded for the selected time range.");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700 h-full min-h-[180px]",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
        <Inbox className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
        {displayMessage}
      </p>
      {onClearFilters && activeFiltersSummary && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-colors cursor-pointer"
        >
          <FilterX className="w-3.5 h-3.5 text-slate-500" />
          Clear active filters
        </button>
      )}
    </div>
  );
};
