import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface BreakdownSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
  currentDimLabel: string;
}

export const BreakdownSearch = ({
  search,
  onSearchChange,
  currentDimLabel,
}: BreakdownSearchProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      onSearchChange(val);
    }, 300);
  };

  return (
    <div className="relative mb-3">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <input
        type="text"
        value={localSearch}
        onChange={handleInputChange}
        placeholder={`Search ${currentDimLabel.toLowerCase()}...`}
        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
      />
    </div>
  );
};
