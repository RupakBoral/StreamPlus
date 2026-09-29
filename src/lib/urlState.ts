import {
    type DatePreset,
    type DimensionKey,
    type MetricKey,
    type SortOrder,
    type BreakdownSortField,
    type Filters,
    type TimeRange,
    DIMENSIONS,
    DEFAULT_PRESET,
    DEFAULT_METRIC,
    DEFAULT_BREAKDOWN_DIM,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
    DEFAULT_PAGE,
    DATE_PRESETS,
    METRIC_KEYS,
    ParsedUrlParamsState,
    DEVICES,
    Device,
    Country,
    COUNTRIES,
    CDNS,
    Cdn,
} from "../types";
import { datasetEnd } from "../api/mock-data";

export function getTimeRangeForPreset(preset: DatePreset): TimeRange {
    const matched = DATE_PRESETS.find((p) => p.key === preset) ?? DATE_PRESETS[1];
    const to = datasetEnd;
    const from = to - matched.durationSec;
    return { from, to };
}

export function isAllowedFilter(value: string): boolean {
    return (
        DEVICES.includes(value as Device) ||
        COUNTRIES.includes(value as Country) ||
        CDNS.includes(value as Cdn)
    );
}

export function parseUrlParams(): ParsedUrlParamsState {
    const searchParams = new URLSearchParams(window.location.search);

    // Range
    const rangeParam = searchParams.get("range");
    const rangePreset: DatePreset =
        rangeParam === "last-24-hours" || rangeParam === "last-7-days" || rangeParam === "last-30-days"
            ? rangeParam
            : DEFAULT_PRESET;

    // Filters (device, country, cdn)
    const filters: Filters = {};
    for (const dim of DIMENSIONS) {
        const raw = searchParams.get(dim);

        if (raw) {
            const items = raw
                .split(",")
                .map((s) => s.trim())
                .filter(isAllowedFilter);
            if (items.length > 0) {
                filters[dim] = items;
            }
        }
    }

    // Active Metric
    const rawMetric = searchParams.get("metric");
    const metric: MetricKey =
        rawMetric && (METRIC_KEYS as readonly string[]).includes(rawMetric)
            ? (rawMetric as MetricKey)
            : DEFAULT_METRIC;

    // Group By
    const rawGroupBy = searchParams.get("groupBy");
    const groupBy: DimensionKey | null =
        rawGroupBy && (DIMENSIONS as readonly string[]).includes(rawGroupBy)
            ? (rawGroupBy as DimensionKey)
            : null;

    // Breakdown dimension
    const rawBreakdownDim = searchParams.get("breakdownDim");
    const breakdownDim: DimensionKey =
        rawBreakdownDim && (DIMENSIONS as readonly string[]).includes(rawBreakdownDim)
            ? (rawBreakdownDim as DimensionKey)
            : DEFAULT_BREAKDOWN_DIM;

    // Breakdown search
    const breakdownSearch = searchParams.get("search") ?? "";

    // Breakdown sort
    const rawSort = searchParams.get("sort");
    const breakdownSort: BreakdownSortField =
        rawSort === "key" || rawSort === "value" || rawSort === "plays" ? rawSort : DEFAULT_SORT_BY;

    const rawOrder = searchParams.get("order");
    const breakdownOrder: SortOrder =
        rawOrder === "asc" || rawOrder === "desc" ? rawOrder : DEFAULT_SORT_ORDER;

    // Breakdown page
    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const breakdownPage = !isNaN(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;

    return {
        rangePreset,
        filters,
        metric,
        groupBy,
        breakdownDim,
        breakdownSearch,
        breakdownSort,
        breakdownOrder,
        breakdownPage,
    };
}

export function serializeUrlParams(state: ParsedUrlParamsState): string {
    const searchParams = new URLSearchParams();

    if (state.rangePreset !== DEFAULT_PRESET) {
        searchParams.set("range", state.rangePreset);
    }

    for (const dim of DIMENSIONS) {
        const values = state.filters[dim];
        if (values && values.length > 0) {
            searchParams.set(dim, values.join(","));
        }
    }

    if (state.metric !== DEFAULT_METRIC) {
        searchParams.set("metric", state.metric);
    }

    if (state.groupBy) {
        searchParams.set("groupBy", state.groupBy);
    }

    if (state.breakdownDim !== DEFAULT_BREAKDOWN_DIM) {
        searchParams.set("breakdownDim", state.breakdownDim);
    }

    if (state.breakdownSearch) {
        searchParams.set("search", state.breakdownSearch);
    }

    if (state.breakdownSort !== DEFAULT_SORT_BY) {
        searchParams.set("sort", state.breakdownSort);
    }

    if (state.breakdownOrder !== DEFAULT_SORT_ORDER) {
        searchParams.set("order", state.breakdownOrder);
    }

    if (state.breakdownPage !== DEFAULT_PAGE) {
        searchParams.set("page", String(state.breakdownPage));
    }

    return searchParams.toString();
}