/**
 * API wrapper layer over mock-api.ts.
 * Normalizes error handling and provides clean typesafe interfaces for TanStack Query.
 */
import {
  fetchDimensionValues as mockFetchDimensionValues,
  fetchSummary as mockFetchSummary,
  fetchTimeSeries as mockFetchTimeSeries,
  fetchBreakdown as mockFetchBreakdown,
  type TimeSeriesParams as MockTimeSeriesParams,
  type BreakdownParams as MockBreakdownParams,
} from "./mock-api";

import {
  ApiError,
  type DimensionKey,
  type FilterOption,
  type Filters,
  type MetricKey,
  type SummaryResponse,
  type TimeRange,
  type TimeSeriesResponse,
  type BreakdownResponse,
  type BreakdownSortField,
  type SortOrder,
} from "./types";

export interface SummaryQueryArgs {
  range: TimeRange;
  filters?: Filters;
  signal?: AbortSignal;
}

export interface TimeSeriesQueryArgs {
  range: TimeRange;
  metric: MetricKey;
  groupBy?: DimensionKey | null;
  filters?: Filters;
  signal?: AbortSignal;
}

export interface BreakdownQueryArgs {
  range: TimeRange;
  metric: MetricKey;
  dimension: DimensionKey;
  filters?: Filters;
  search?: string;
  sortBy?: BreakdownSortField;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

export async function getDimensionValues(
  dimension: DimensionKey,
  signal?: AbortSignal
): Promise<FilterOption[]> {
  try {
    return await mockFetchDimensionValues(dimension, signal);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    if (err instanceof ApiError) {
      throw new Error(`Failed to load ${dimension} options (${err.status}): ${err.message}`);
    }
    throw new Error(`Unexpected error loading ${dimension} options`);
  }
}

export async function getSummary(args: SummaryQueryArgs): Promise<SummaryResponse> {
  try {
    return await mockFetchSummary(args);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    if (err instanceof ApiError) {
      throw new Error(`Failed to load metrics summary (${err.status}): ${err.message}`);
    }
    throw new Error("Unable to fetch summary metrics from server");
  }
}

export async function getTimeSeries(args: TimeSeriesQueryArgs): Promise<TimeSeriesResponse> {
  try {
    const params: MockTimeSeriesParams = {
      range: args.range,
      metric: args.metric,
      groupBy: args.groupBy,
      filters: args.filters,
      signal: args.signal,
    };
    return await mockFetchTimeSeries(params);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    if (err instanceof ApiError) {
      throw new Error(`Failed to load time series data (${err.status}): ${err.message}`);
    }
    throw new Error("Unable to fetch time series from server");
  }
}

export async function getBreakdown(args: BreakdownQueryArgs): Promise<BreakdownResponse> {
  try {
    const params: MockBreakdownParams = {
      range: args.range,
      metric: args.metric,
      dimension: args.dimension,
      filters: args.filters,
      search: args.search,
      sortBy: args.sortBy,
      sortOrder: args.sortOrder,
      page: args.page,
      pageSize: args.pageSize,
      signal: args.signal,
    };
    return await mockFetchBreakdown(params);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    if (err instanceof ApiError) {
      throw new Error(`Failed to load breakdown data (${err.status}): ${err.message}`);
    }
    throw new Error("Unable to fetch breakdown from server");
  }
}
