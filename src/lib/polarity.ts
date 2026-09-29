import { METRIC_META, type MetricKey } from "../types";

export type TrendSentiment = "good" | "bad" | "neutral";
export type ArrowDirection = "up" | "down" | "flat";

export interface MetricDelta {
  diff: number;
  pctChange: number;
  direction: ArrowDirection;
  sentiment: TrendSentiment;
  /** Human-readable text label paired with color, e.g. "Improved", "Regressed", "Unchanged" */
  sentimentLabel: string;
  /** Formatted string with sign and one decimal, e.g. "▲ 6.3%" or "▼ 6.6%" */
  formattedChange: string;
  arrowChar: string;
}

export function isHigherBetter(metric: MetricKey): boolean {
  return !METRIC_META[metric].invertedLogic;
}

/**
 * Computes period-over-period delta with polarity-aware sentiment.
 * Higher is better: plays, uniqueViewers, avgBitrateKbps
 * Lower is better (inverted): rebufferRatio, startupTimeMs, errorRate
 */
export function computeMetricDelta(present: number, past: number, metric: MetricKey): MetricDelta {
  const diff = present - past;
  const higherBetter = isHigherBetter(metric);

  // If past is 0 or very close to 0
  let pctChange = 0;
  if (past !== 0) {
    pctChange = (diff / Math.abs(past)) * 100;
  } else if (present !== 0) {
    pctChange = present > 0 ? 100 : -100;
  }

  // Rounded to one decimal for comparison
  const roundedPct = Math.round(pctChange * 10) / 10;

  if (Math.abs(roundedPct) < 0.05) {
    return {
      diff: 0,
      pctChange: 0,
      direction: "flat",
      sentiment: "neutral",
      sentimentLabel: "No change",
      formattedChange: "0.0%",
      arrowChar: "—",
    };
  }

  const isUp = pctChange > 0;
  const direction: ArrowDirection = isUp ? "up" : "down";
  const arrowChar = isUp ? "▲" : "▼";
  const absPctStr = Math.abs(pctChange).toFixed(1);
  const formattedChange = `${arrowChar} ${absPctStr}%`;

  // Determine sentiment
  let sentiment: TrendSentiment;
  if (higherBetter) {
    sentiment = isUp ? "good" : "bad";
  } else {
    sentiment = isUp ? "bad" : "good";
  }

  const sentimentLabel = sentiment === "good" ? "Improved" : "Regressed";

  return {
    diff,
    pctChange,
    direction,
    sentiment,
    sentimentLabel,
    formattedChange,
    arrowChar,
  };
}
