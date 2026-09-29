import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  PlusCircle,
} from "lucide-react";
import { useBreakdown } from "../../hooks/useBreakdown";
import { Pagination } from "../../components/ui/Pagination";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCompactNumber, formatMetricValue, formatPercentShare } from "../../lib/format";
import { cn } from "../../lib/utils";
import {
  METRIC_META,
  type BreakdownSortField,
  type DimensionKey,
  type Filters,
  type MetricKey,
  type SortOrder,
  type TimeRange,
} from "../../types";

export interface BreakdownTableProps {
  timeRange: TimeRange;
  metric: MetricKey;
  dimension: DimensionKey;
  onDimensionChange: (dim: DimensionKey) => void;
  filters: Filters;
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: BreakdownSortField;
  sortOrder: SortOrder;
  onSortChange: (field: BreakdownSortField) => void;
  page: number;
  onPageChange: (page: number) => void;
  onRowClick: (dimension: DimensionKey, value: string) => void;
  onClearFilters?: () => void;
}

export const BreakdownTable = ({
  timeRange,
  metric,
  dimension,
  onDimensionChange,
  filters,
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  page,
  onPageChange,
  onRowClick,
  onClearFilters,
}: BreakdownTableProps) => {
  // input for 300ms debouncing
  const [localSearch, setLocalSearch] = useState(search);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      onSearchChange(val);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Dimension dropdown state
  const [isDimOpen, setIsDimOpen] = useState(false);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dimRef.current && !dimRef.current.contains(event.target as Node)) {
        setIsDimOpen(false);
      }
    }
    if (isDimOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDimOpen]);

  const { data, isLoading, isError, error, refetch, isFetching } = useBreakdown({
    timeRange,
    metric,
    dimension,
    filters,
    search,
    sortBy,
    sortOrder,
    page,
    pageSize: 5,
  });

  const dimensionOptions: { label: string; value: DimensionKey }[] = [
    { label: "Device", value: "device" },
    { label: "Country", value: "country" },
    { label: "CDN", value: "cdn" },
  ];

  const currentDimLabel = dimensionOptions.find((d) => d.value === dimension)?.label ?? "Device";
  const metricMeta = METRIC_META[metric];

  // Helper to render sort indicator
  const renderSortIndicator = (field: BreakdownSortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
    );
  };

  // Check if a row value is already active in filters
  const isValueFiltered = (val: string) => {
    const list = filters[dimension];
    return Boolean(list && list.includes(val));
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-slate-800 p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between gap-3 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Breakdown
        </h3>

        {/* Dimension Selector */}
        <div className="relative inline-block text-left" ref={dimRef}>
          <button
            type="button"
            onClick={() => setIsDimOpen(!isDimOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {currentDimLabel}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDimOpen && (
            <div className="absolute right-0 z-40 mt-1.5 w-36 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-1 animate-in fade-in zoom-in-95 duration-100">
              {dimensionOptions.map((opt) => {
                const isSelected = opt.value === dimension;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onDimensionChange(opt.value);
                      setIsDimOpen(false);
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

      {/* Search Input */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={handleInputChange}
          placeholder={`Search ${currentDimLabel.toLowerCase()}...`}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Main Table Content */}
      <div className="flex-1 flex flex-col justify-between min-h-[260px]">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-4 gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20 ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
              <Skeleton className="h-3 w-24 ml-auto" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 py-2 items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-14 ml-auto" />
                <Skeleton className="h-4 w-14 ml-auto" />
                <Skeleton className="h-4 w-24 ml-auto" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="my-auto py-6">
            <ErrorState
              title="Failed to load breakdown"
              message={error?.message || "Could not retrieve breakdown rows."}
              onRetry={() => refetch()}
              isRetrying={isFetching}
            />
          </div>
        ) : !data || data.rows.length === 0 ? (
          <div className="my-auto py-6">
            <EmptyState
              title="No rows found"
              message={
                search
                  ? `No ${currentDimLabel.toLowerCase()} matching "${search}"`
                  : `No breakdown data for active filters.`
              }
              filters={filters}
              onClearFilters={onClearFilters}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/80 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  {/* Dimension Column */}
                  <th className="py-2 pr-2">
                    <button
                      type="button"
                      onClick={() => onSortChange("key")}
                      className="group inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase cursor-pointer"
                    >
                      <span>{currentDimLabel}</span>
                      {renderSortIndicator("key")}
                    </button>
                  </th>

                  {/* Selected Metric Column */}
                  <th className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => onSortChange("value")}
                      className="group inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase ml-auto cursor-pointer"
                    >
                      <span>{metricMeta.label}</span>
                      {renderSortIndicator("value")}
                    </button>
                  </th>

                  {/* Plays Column */}
                  <th className="py-2 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => onSortChange("plays")}
                      className="group inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase ml-auto cursor-pointer"
                    >
                      <span>Plays</span>
                      {renderSortIndicator("plays")}
                    </button>
                  </th>

                  {/* Share of Plays Column */}
                  <th className="py-2 pl-2 text-right">
                    <span className="cursor-default">Share of Plays</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {data.rows.map((row) => {
                  const filtered = isValueFiltered(row.key);
                  const formattedValue = formatMetricValue(row.value, metric);
                  const formattedPlays = formatCompactNumber(row.plays, 1);
                  const percentShare = formatPercentShare(row.share);
                  const sharePctNum = Math.min(100, Math.max(0, row.share * 100));

                  return (
                    <tr
                      key={row.key}
                      onClick={() => onRowClick(dimension, row.key)}
                      title={`Click to filter by ${currentDimLabel}: ${row.key}`}
                      className={cn(
                        "group cursor-pointer transition-colors duration-150",
                        filtered
                          ? "bg-indigo-50/70 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/50"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-700/40"
                      )}
                    >
                      {/* Dimension Key */}
                      <td className="py-2.5 pr-2 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span>{row.key}</span>
                          {filtered && (
                            <span className="text-[10px] font-normal text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1 rounded">
                              active
                            </span>
                          )}
                          <PlusCircle className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-500 transition-opacity ml-auto" />
                        </div>
                      </td>

                      {/* Metric Value */}
                      <td className="py-2.5 px-2 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formattedValue}
                      </td>

                      {/* Plays */}
                      <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formattedPlays}
                      </td>

                      {/* Share of Plays */}
                      <td className="py-2.5 pl-2 text-right">
                        <div className="inline-flex items-center justify-end gap-2 w-full max-w-[120px]">
                          {/* Mini Progress Bar */}
                          <div className="w-14 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                              style={{ width: `${sharePctNum}%` }}
                            />
                          </div>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium w-10 text-right">
                            {percentShare}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer: Pagination */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80">
          <Pagination
            currentPage={page}
            totalRows={data?.totalRows ?? 0}
            pageSize={5}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};
