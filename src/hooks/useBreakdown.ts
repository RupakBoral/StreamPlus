import { useQuery } from "@tanstack/react-query";
import { getBreakdown } from "../api";
import type {
  BreakdownResponse,
  BreakdownSortField,
  DimensionKey,
  Filters,
  MetricKey,
  SortOrder,
  TimeRange,
} from "../types";

export interface UseBreakdownProps {
  timeRange: TimeRange;
  metric: MetricKey;
  dimension: DimensionKey;
  filters: Filters;
  search: string;
  sortBy: BreakdownSortField;
  sortOrder: SortOrder;
  page: number;
  pageSize?: number;
}

export function useBreakdown({
  timeRange,
  metric,
  dimension,
  filters,
  search,
  sortBy,
  sortOrder,
  page,
  pageSize = 5,
}: UseBreakdownProps) {
  return useQuery<BreakdownResponse, Error>({
    queryKey: [
      "breakdown",
      timeRange.from,
      timeRange.to,
      metric,
      dimension,
      filters,
      search,
      sortBy,
      sortOrder,
      page,
      pageSize,
    ],
    queryFn: ({ signal }) =>
      getBreakdown({
        range: timeRange,
        metric,
        dimension,
        filters,
        search,
        sortBy,
        sortOrder,
        page,
        pageSize,
        signal,
      }),
    staleTime: 60 * 1000,
    retry: 2,
  });
}
