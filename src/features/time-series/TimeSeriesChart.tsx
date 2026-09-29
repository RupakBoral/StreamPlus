import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTimeSeries } from "../../hooks/useTimeSeries";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import {
  formatAxisTick,
  formatDateRangeSpan,
  formatGranularity,
  formatTimestamp,
} from "../../lib/format";
import {
  METRIC_META,
  type DimensionKey,
  type Filters,
  type MetricKey,
  type TimeRange,
} from "../../types";
import { SERIES_COLORS } from "./constants";
import { ChartHeader } from "./components/ChartHeader";
import { ChartLegend } from "./components/ChartLegend";
import { CustomTooltip } from "./components/CustomTooltip";

interface TimeSeriesChartProps {
  timeRange: TimeRange;
  metric: MetricKey;
  groupBy: DimensionKey | null;
  onGroupByChange: (groupBy: DimensionKey | null) => void;
  filters: Filters;
  onClearFilters?: () => void;
}

interface ChartRow {
  ts: number;
  [seriesKey: string]: number;
}

export const TimeSeriesChart = ({
  timeRange,
  metric,
  groupBy,
  onGroupByChange,
  filters,
  onClearFilters,
}: TimeSeriesChartProps) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useTimeSeries({
    timeRange,
    metric,
    groupBy,
    filters,
  });

  const metricMeta = METRIC_META[metric];
  const chartTitle = `${metricMeta.label} over time`;
  const rangeSpan = formatDateRangeSpan(timeRange.from, timeRange.to);
  const granularityText = data?.granularitySec ? formatGranularity(data.granularitySec) : "Hourly buckets";
  const subtitle = `${granularityText} · ${rangeSpan}`;

  // Transform data for Recharts
  const { chartData, seriesNames } = useMemo(() => {
    if (!data || !data.series || data.series.length === 0) {
      return { chartData: [], seriesNames: [] };
    }

    const seriesList = data.series;
    const names = seriesList.map((s) => s.name);

    // Collect all timestamps
    const tsSet = new Set<number>();
    for (const s of seriesList) {
      for (const p of s.points) {
        tsSet.add(p.ts);
      }
    }
    const sortedTs = Array.from(tsSet).sort((a, b) => a - b);

    // Build row per timestamp
    const tsMap = new Map<number, ChartRow>();
    for (const ts of sortedTs) {
      tsMap.set(ts, { ts });
    }

    for (const s of seriesList) {
      for (const p of s.points) {
        const row = tsMap.get(p.ts);
        if (row) {
          row[s.name] = p.value;
        }
      }
    }

    return {
      chartData: Array.from(tsMap.values()),
      seriesNames: names,
    };
  }, [data]);

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-slate-800 p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
      <ChartHeader
        chartTitle={chartTitle}
        subtitle={subtitle}
        groupBy={groupBy}
        onGroupByChange={onGroupByChange}
      />

      <ChartLegend
        seriesNames={seriesNames}
        groupBy={groupBy}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full min-h-[290px] relative">
        {isLoading ? (
          <div className="w-full h-full flex flex-col justify-end gap-2 p-2">
            <Skeleton className="w-full h-4/5 rounded-xl" />
            <div className="flex justify-between gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : isError ? (
          <div className="h-full flex items-center justify-center">
            <ErrorState
              title="Failed to load time series data"
              message={error?.message || "Could not retrieve time series points."}
              onRetry={() => refetch()}
              isRetrying={isFetching}
            />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              title="No chart data available"
              filters={filters}
              onClearFilters={onClearFilters}
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
                className="dark:stroke-slate-700/60"
              />
              <XAxis
                dataKey="ts"
                tickFormatter={(ts) => formatTimestamp(ts)}
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                minTickGap={40}
              />
              <YAxis
                tickFormatter={(val) => formatAxisTick(val, metric)}
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <CustomTooltip
                    active={active}
                    payload={payload}
                    label={label}
                    groupBy={groupBy}
                    metric={metric}
                  />
                )}
              />
              {seriesNames.map((name, index) => {
                const color = SERIES_COLORS[index % SERIES_COLORS.length];
                return (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                    isAnimationActive={true}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
