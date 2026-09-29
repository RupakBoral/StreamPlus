import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../api";
import type { Filters, SummaryResponse, TimeRange } from "../types";

export interface UseMetricCardsProps {
  timeRange: TimeRange;
  filters: Filters;
}

export function useMetricCards({ timeRange, filters }: UseMetricCardsProps) {
  return useQuery<SummaryResponse, Error>({
    queryKey: ["metric-summary", timeRange.from, timeRange.to, filters],
    queryFn: ({ signal }) =>
      getSummary({
        range: timeRange,
        filters,
        signal,
      }),
    staleTime: 60 * 1000,
    retry: 2,
  });
}
