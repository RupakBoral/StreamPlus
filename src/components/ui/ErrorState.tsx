import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
  compact?: boolean;
}

export const ErrorState = ({
  title = "Failed to load data",
  message = "An error occurred while communicating with the service. Please try again.",
  onRetry,
  isRetrying = false,
  className,
  compact = false,
}: ErrorStateProps) => {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 p-3 rounded-lg bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/50 text-rose-700 dark:text-rose-300",
          className
        )}
      >
        <div className="flex items-center gap-2 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{title}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-rose-100 dark:bg-rose-900/60 hover:bg-rose-200 text-rose-800 dark:text-rose-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3 h-3", isRetrying && "animate-spin")} />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 h-full min-h-[180px]",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isRetrying && "animate-spin")} />
          <span>{isRetrying ? "Retrying..." : "Retry"}</span>
        </button>
      )}
    </div>
  );
};
