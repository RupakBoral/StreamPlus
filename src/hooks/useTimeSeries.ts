import { useQuery } from "@tanstack/react-query";
import { getTimeSeries } from "../api";
import type { DimensionKey, Filters, MetricKey, TimeRange, TimeSeriesResponse } from "../types";

export interface UseTimeSeriesProps {
  timeRange: TimeRange;
  metric: MetricKey;
  groupBy: DimensionKey | null;
  filters: Filters;
}

export function useTimeSeries({ timeRange, metric, groupBy, filters }: UseTimeSeriesProps) {
  return useQuery<TimeSeriesResponse, Error>({
    queryKey: ["time-series", timeRange.from, timeRange.to, metric, groupBy, filters],
    queryFn: ({ signal }) =>
      getTimeSeries({
        range: timeRange,
        metric,
        groupBy,
        filters,
        signal,
      }),
    staleTime: 60 * 1000,
    retry: 2,
  });
}
