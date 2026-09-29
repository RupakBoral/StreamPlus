import { type DimensionKey } from "../../../types";
import { SERIES_COLORS } from "../constants";

interface ChartLegendProps {
  seriesNames: string[];
  groupBy: DimensionKey | null;
  isLoading: boolean;
  isError: boolean;
}

export const ChartLegend = ({ seriesNames, groupBy, isLoading, isError }: ChartLegendProps) => {
  if (isLoading || isError || seriesNames.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3.5 py-2 mb-2">
      {seriesNames.map((name, index) => {
        const color = SERIES_COLORS[index % SERIES_COLORS.length];
        const displayName = !groupBy && name === "All" ? "All traffic" : name;
        return (
          <div key={name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="font-medium">{displayName}</span>
          </div>
        );
      })}
    </div>
  );
};
