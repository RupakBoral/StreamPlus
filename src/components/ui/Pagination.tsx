import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalRows,
  pageSize,
  onPageChange,
  className,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  // If 0 total rows
  if (totalRows === 0) {
    return (
      <div className={cn("flex items-center justify-between text-xs text-slate-500", className)}>
        <span>0 rows</span>
      </div>
    );
  }

  const startRow = Math.min((currentPage - 1) * pageSize + 1, totalRows);
  const endRow = Math.min(currentPage * pageSize, totalRows);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className={cn("flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 select-none", className)}>
      <div>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {totalRows <= pageSize ? `${totalRows} of ${totalRows} rows` : `${startRow}–${endRow} of ${totalRows} rows`}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors",
              currentPage === page
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            )}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
