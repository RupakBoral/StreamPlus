import { PlusCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { formatCompactNumber, formatMetricValue, formatPercentShare } from "../../../lib/format";
import { type DimensionKey, type MetricKey } from "../../../types";

interface BreakdownRowData {
  key: string;
  value: number;
  plays: number;
  share: number;
}

interface BreakdownTableRowProps {
  row: BreakdownRowData;
  dimension: DimensionKey;
  metric: MetricKey;
  currentDimLabel: string;
  isFiltered: boolean;
  onRowClick: (dimension: DimensionKey, value: string) => void;
}

export const BreakdownTableRow = ({
  row,
  dimension,
  metric,
  currentDimLabel,
  isFiltered,
  onRowClick,
}: BreakdownTableRowProps) => {
  const formattedValue = formatMetricValue(row.value, metric);
  const formattedPlays = formatCompactNumber(row.plays, 1);
  const percentShare = formatPercentShare(row.share);
  const sharePctNum = Math.min(100, Math.max(0, row.share * 100));

  return (
    <tr
      onClick={() => onRowClick(dimension, row.key)}
      title={`Click to filter by ${currentDimLabel}: ${row.key}`}
      className={cn(
        "group cursor-pointer transition-colors duration-150",
        isFiltered
          ? "bg-indigo-50/70 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/50"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-700/40"
      )}
    >
      <td className="py-2.5 pr-2 font-semibold text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-1.5">
          <span>{row.key}</span>
          {isFiltered && (
            <span className="text-[10px] font-normal text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1 rounded">
              active
            </span>
          )}
          <PlusCircle className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-500 transition-opacity ml-auto" />
        </div>
      </td>

      <td className="py-2.5 px-2 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
        {formattedValue}
      </td>

      <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {formattedPlays}
      </td>

      <td className="py-2.5 pl-2 text-right">
        <div className="inline-flex items-center justify-end gap-2 w-full max-w-[120px]">
          <div className="w-14 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${sharePctNum}%` }}
            />
          </div>
          <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium w-10 text-right">
            {percentShare}
          </span>
        </div>
      </td>
    </tr>
  );
};
