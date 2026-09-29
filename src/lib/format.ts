import { type MetricKey } from "../types";

/**
 * Format numbers for better readability:
 * >= 1,000,000 -> 2.05M
 * >= 1,000 -> 633.1K
 * < 1,000 -> 85 (en-US)
 */
export function formatCompactNumber(num: number, decimals: number = 2): string {
  if (isNaN(num) || num === null || num === undefined) return "0";
  const abs = Math.abs(num);

  if (abs >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(decimals)}M`;
  }
  if (abs >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

/**
 * Formats a metric value according to its unit and domain representation.
 * - plays: "2.05M"
 * - uniqueViewers: "1.35K"
 * - avgBitrateKbps: "4.10 Mbps" or "850 kbps"
 * - rebufferRatio: "1.18%"
 * - startupTimeMs: "1.85s"
 * - errorRate: "0.56%"
 */
export function formatMetricValue(value: number, metric: MetricKey): string {
  if (isNaN(value) || value === null || value === undefined) return "—";

  switch (metric) {
    case "plays":
    case "uniqueViewers":
      return formatCompactNumber(value, 2);

    case "avgBitrateKbps": {
      if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} Mbps`;
      }
      return `${Math.round(value)} kbps`;
    }

    case "rebufferRatio":
      return `${value.toFixed(2)}%`;

    case "startupTimeMs":
      return `${(value / 1000).toFixed(2)}s`;

    case "errorRate":
      return `${value.toFixed(2)}%`;

    default:
      return value.toLocaleString();
  }
}

/**
 * Formats a value for chart Y-axis ticks (shorter representation).
 */
export function formatAxisTick(value: number, metric: MetricKey): string {
  if (isNaN(value)) return "";

  switch (metric) {
    case "plays":
    case "uniqueViewers":
      return formatCompactNumber(value, 1);
    case "avgBitrateKbps":
      return value >= 1000 ? `${(value / 1000).toFixed(1)}Mbps` : `${Math.round(value)}kbps`;
    case "rebufferRatio":
    case "errorRate":
      return `${value.toFixed(1)}%`;
    case "startupTimeMs":
      return `${(value / 1000).toFixed(1)}s`;
    default:
      return `${value}`;
  }
}

/**
 * Formats unix timestamp (seconds) into date string for chart ticks/tooltips.
 */
export function formatTimestamp(ts: number, includeYear: boolean = false): string {
  const d = new Date(ts * 1000);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  if (includeYear) {
    const year = d.getFullYear();
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  }
  return `${month} ${day} ${hours}:${minutes}`;
}

/**
 * Formats date range span for chart subtitles, e.g. "Sep 15 - Sep 22".
 */
export function formatDateRangeSpan(from: number, to: number): string {
  const dFrom = new Date(from * 1000);
  const dTo = new Date(to * 1000);

  const mFrom = dFrom.toLocaleDateString("en-US", { month: "short" });
  const mTo = dTo.toLocaleDateString("en-US", { month: "short" });
  const dayFrom = dFrom.getDate();
  const dayTo = dTo.getDate();

  if (mFrom === mTo) {
    return `${mFrom} ${dayFrom} – ${dayTo}`;
  }
  return `${mFrom} ${dayFrom} – ${mTo} ${dayTo}`;
}

/**
 * Formats granularity in seconds to readable copy, e.g. "3-hour buckets", "1-hour buckets", "Daily buckets".
 */
export function formatGranularity(granularitySec: number): string {
  const hours = Math.round(granularitySec / 3600);
  if (hours < 24) return `${hours}-hour buckets`;
  return "Daily buckets";
}

/**
 * Formats a share ratio (0..1) into a percentage string, e.g. "30.9%".
 */
export function formatPercentShare(share: number): string {
  return `${(share * 100).toFixed(1)}%`;
}
