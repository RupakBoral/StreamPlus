import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import { type DimensionKey } from "../../../types";

interface BreakdownHeaderProps {
  dimension: DimensionKey;
  onDimensionChange: (dim: DimensionKey) => void;
  currentDimLabel: string;
}

const dimensionOptions: { label: string; value: DimensionKey }[] = [
  { label: "Device", value: "device" },
  { label: "Country", value: "country" },
  { label: "CDN", value: "cdn" },
];

export const BreakdownHeader = ({
  dimension,
  onDimensionChange,
  currentDimLabel,
}: BreakdownHeaderProps) => {
  const [isDimOpen, setIsDimOpen] = useState(false);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dimRef.current && !dimRef.current.contains(event.target as Node)) {
        setIsDimOpen(false);
      }
    }
    if (isDimOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDimOpen]);

  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Breakdown
      </h3>

      <div className="relative inline-block text-left" ref={dimRef}>
        <button
          type="button"
          onClick={() => setIsDimOpen(!isDimOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {currentDimLabel}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isDimOpen && (
          <div className="absolute right-0 z-40 mt-1.5 w-36 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-1 animate-in fade-in zoom-in-95 duration-100">
            {dimensionOptions.map((opt) => {
              const isSelected = opt.value === dimension;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onDimensionChange(opt.value);
                    setIsDimOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
