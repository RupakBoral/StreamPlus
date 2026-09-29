/**
 * Re-export all domain and API types from `./api/types`,
 * plus application-level types used across features.
 */
export * from "./api/types";

import {
  type DimensionKey,
  type MetricKey,
  type SortOrder,
  type BreakdownSortField,
  type DatePreset,
  type TimeRange,
  type Filters,
} from "./api/types";


export const DEFAULT_PRESET: DatePreset = "last-7-days";
export const DEFAULT_METRIC: MetricKey = "rebufferRatio";
export const DEFAULT_BREAKDOWN_DIM: DimensionKey = "device";
export const DEFAULT_SORT_BY: BreakdownSortField = "value";
export const DEFAULT_SORT_ORDER: SortOrder = "desc";
export const DEFAULT_PAGE: number = 1;

export interface DashboardUrlState {
  range: string;
  device: string[];
  country: string[];
  cdn: string[];
  metric: MetricKey;
  groupBy: DimensionKey | "none";
  breakdownDim: DimensionKey;
  breakdownSearch: string;
  breakdownSort: BreakdownSortField;
  breakdownOrder: SortOrder;
  breakdownPage: number;
}

export interface UrlDashboardState {
  rangePreset: DatePreset;
  timeRange: TimeRange;
  filters: Filters;
  metric: MetricKey;
  groupBy: DimensionKey | null;
  breakdownDim: DimensionKey;
  breakdownSearch: string;
  breakdownSort: BreakdownSortField;
  breakdownOrder: SortOrder;
  breakdownPage: number;
}

export interface ParsedUrlParamsState {
  rangePreset: DatePreset;
  filters: Filters;
  metric: MetricKey;
  groupBy: DimensionKey | null;
  breakdownDim: DimensionKey;
  breakdownSearch: string;
  breakdownSort: BreakdownSortField;
  breakdownOrder: SortOrder;
  breakdownPage: number;
}
