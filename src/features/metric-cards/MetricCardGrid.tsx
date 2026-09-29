import { MetricCard } from "./MetricCard";
import { useMetricCards } from "../../hooks/useMetricCards";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { METRIC_META, type MetricKey, type Filters, type TimeRange } from "../../types";

const ORDERED_METRICS: MetricKey[] = [
  "plays",
  "uniqueViewers",
  "avgBitrateKbps",
  "rebufferRatio",
  "startupTimeMs",
  "errorRate",
];

export interface MetricCardGridProps {
  timeRange: TimeRange;
  filters: Filters;
  selectedMetric: MetricKey;
  onSelectMetric: (metric: MetricKey) => void;
  onClearFilters?: () => void;
}

export const MetricCardGrid = ({
  timeRange,
  filters,
  selectedMetric,
  onSelectMetric,
  onClearFilters,
}: MetricCardGridProps) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useMetricCards({
    timeRange,
    filters,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {ORDERED_METRICS.map((key) => (
          <div
            key={key}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 h-[116px] flex flex-col justify-between"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-28 my-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white dark:bg-slate-800 p-2 shadow-sm border border-slate-200 dark:border-slate-700">
        <ErrorState
          title="Failed to load metric summary"
          message={error?.message || "Could not retrieve summary metrics."}
          onRetry={() => refetch()}
          isRetrying={isFetching}
          compact
        />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="No summary data"
        filters={filters}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {ORDERED_METRICS.map((key) => {
        const meta = METRIC_META[key];
        const present = data.present[key] ?? 0;
        const past = data.past[key] ?? 0;

        return (
          <MetricCard
            key={key}
            meta={meta}
            presentValue={present}
            pastValue={past}
            isSelected={selectedMetric === key}
            onSelect={onSelectMetric}
          />
        );
      })}
    </div>
  );
};
