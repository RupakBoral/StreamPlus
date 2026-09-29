import { cn } from "../../lib/utils";
import { formatMetricValue } from "../../lib/format";
import { computeMetricDelta } from "../../lib/polarity";
import type { MetricKey, MetricMeta } from "../../types";

export interface MetricCardProps {
  meta: MetricMeta;
  presentValue: number;
  pastValue: number;
  isSelected: boolean;
  onSelect: (metric: MetricKey) => void;
}

export const MetricCard = ({
  meta,
  presentValue,
  pastValue,
  isSelected,
  onSelect,
}: MetricCardProps) => {
  const delta = computeMetricDelta(presentValue, pastValue, meta.key);

  const formattedPresent = formatMetricValue(presentValue, meta.key);
  const formattedPast = formatMetricValue(pastValue, meta.key);

  const sentimentColor =
    delta.sentiment === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : delta.sentiment === "bad"
      ? "text-rose-600 dark:text-rose-400"
      : "text-slate-500 dark:text-slate-400";

  return (
    <button
      type="button"
      onClick={() => onSelect(meta.key)}
      aria-label={`${meta.label}: ${formattedPresent}, ${delta.sentimentLabel} by ${Math.abs(delta.pctChange).toFixed(1)}% versus ${formattedPast}`}
      className={cn(
        "group relative flex flex-col justify-between text-left p-4 rounded-xl transition-all duration-200 cursor-pointer select-none",
        "bg-white dark:bg-slate-800 shadow-sm",
        isSelected
          ? "border-2 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
          : "border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
      )}
    >
      {/* Top Header: Metric Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {meta.label}
        </span>
        {isSelected && (
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Active on chart" />
        )}
      </div>

      {/* Middle: Present Metric Value */}
      <div className="my-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {formattedPresent}
        </span>
      </div>

      {/* Bottom: Period-over-period delta with polarity indicator */}
      <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
        <span className={cn("inline-flex items-center gap-0.5 font-semibold", sentimentColor)}>
          <span>{delta.arrowChar}</span>
          <span>{Math.abs(delta.pctChange).toFixed(1)}%</span>
        </span>
        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-normal">
          vs {formattedPast}
        </span>
      </div>

      {/* Screen-reader polarity & change explanation */}
      <span className="sr-only">
        {delta.sentimentLabel} ({delta.formattedChange}) compared to prior period value of {formattedPast}
      </span>
    </button>
  );
};
