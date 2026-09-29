import { useState, useEffect } from "react";
import {
  type DatePreset,
  type DimensionKey,
  type MetricKey,
  type BreakdownSortField,
  type ParsedUrlParamsState,
} from "../types";
import {
  getTimeRangeForPreset,
  parseUrlParams,
  serializeUrlParams,
} from "@/lib/urlState";

export function useUrlState() {
  const [state, setState] = useState<ParsedUrlParamsState>(() => parseUrlParams());

  useEffect(() => {
    const handlePopState = () => setState(parseUrlParams());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateState = (updater: (prev: ParsedUrlParamsState) => ParsedUrlParamsState) => {
    setState((prev) => {
      const next = updater(prev);
      const queryString = serializeUrlParams(next);
      const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
      window.history.pushState(null, "", newUrl);
      return next;
    });
  };

  // Filter setters
  const setRangePreset = (rangePreset: DatePreset) => {
    updateState((prev) => ({ ...prev, rangePreset, breakdownPage: 1 }));
  };

  const setDimensionFilter = (dimension: DimensionKey, values: string[]) => {
    updateState((prev) => {
      const newFilters = { ...prev.filters };
      if (values.length > 0) {
        newFilters[dimension] = values;
      } else {
        delete newFilters[dimension];
      }
      return { ...prev, filters: newFilters, breakdownPage: 1 };
    });
  };

  const addDimensionFilterValue = (dimension: DimensionKey, value: string) => {
    updateState((prev) => {
      const current = prev.filters[dimension] ?? [];
      if (current.includes(value)) return prev;
      return {
        ...prev,
        filters: { ...prev.filters, [dimension]: [...current, value] },
        breakdownPage: 1,
      };
    });
  };

  const clearAllFilters = () => {
    updateState((prev) => ({ ...prev, filters: {}, breakdownPage: 1 }));
  };

  // Metric & Layout setters
  const setMetric = (metric: MetricKey) => {
    updateState((prev) => ({ ...prev, metric }));
  };

  const setGroupBy = (groupBy: DimensionKey | null) => {
    updateState((prev) => ({ ...prev, groupBy }));
  };

  const setBreakdownDim = (breakdownDim: DimensionKey) => {
    updateState((prev) => ({
      ...prev,
      breakdownDim,
      breakdownPage: 1,
    }));
  };

  const setBreakdownSearch = (breakdownSearch: string) => {
    updateState((prev) => ({ ...prev, breakdownSearch, breakdownPage: 1 }));
  };

  const setBreakdownSort = (field: BreakdownSortField) => {
    updateState((prev) => {
      const breakdownOrder =
        prev.breakdownSort === field && prev.breakdownOrder === "asc" ? "desc" : "asc";
      return {
        ...prev,
        breakdownSort: field,
        breakdownOrder,
        breakdownPage: 1,
      };
    });
  };

  const setBreakdownPage = (page: number) => {
    updateState((prev) => ({ ...prev, breakdownPage: Math.max(1, page) }));
  };

  return {
    ...state,
    timeRange: getTimeRangeForPreset(state.rangePreset),
    setRangePreset,
    setDimensionFilter,
    addDimensionFilterValue,
    clearAllFilters,
    setMetric,
    setGroupBy,
    setBreakdownDim,
    setBreakdownSearch,
    setBreakdownSort,
    setBreakdownPage,
  };
}
