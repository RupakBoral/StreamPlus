import { formatTimestamp, formatMetricValue } from "../../../lib/format";
import { type DimensionKey, type MetricKey } from "../../../types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  groupBy: DimensionKey | null;
  metric: MetricKey;
}

export const CustomTooltip = ({ active, payload, label, groupBy, metric }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const ts = Number(label);
  return (
    <div className="rounded-xl bg-slate-900/95 text-white p-3 shadow-xl backdrop-blur-sm border border-slate-700/80 text-xs min-w-[150px]">
      <div className="font-semibold text-slate-300 pb-1.5 mb-1.5 border-b border-slate-800">
        {formatTimestamp(ts, true)}
      </div>
      <div className="space-y-1">
        {payload.map((entry, idx) => {
          const val = Number(entry.value);
          const name =
            !groupBy && entry.name === "All"
              ? "All traffic"
              : String(entry.name);
          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300 font-medium">
                  {name}
                </span>
              </div>
              <span className="font-bold text-white">
                {formatMetricValue(val, metric)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
