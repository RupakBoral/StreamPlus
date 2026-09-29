import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { type BreakdownSortField, type SortOrder } from "../../../types";

interface BreakdownTableHeadProps {
  sortBy: BreakdownSortField;
  sortOrder: SortOrder;
  onSortChange: (field: BreakdownSortField) => void;
  currentDimLabel: string;
  metricLabel: string;
}

export const BreakdownTableHead = ({
  sortBy,
  sortOrder,
  onSortChange,
  currentDimLabel,
  metricLabel,
}: BreakdownTableHeadProps) => {
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

  return (
    <thead>
      <tr className="border-b border-slate-100 dark:border-slate-700/80 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
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
        <th className="py-2 px-2 text-right">
          <button
            type="button"
            onClick={() => onSortChange("value")}
            className="group inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase ml-auto cursor-pointer"
          >
            <span>{metricLabel}</span>
            {renderSortIndicator("value")}
          </button>
        </th>
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
        <th className="py-2 pl-2 text-right">
          <span className="cursor-default">Share of Plays</span>
        </th>
      </tr>
    </thead>
  );
};
