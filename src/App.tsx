import { FC, useState, useEffect } from "react";
import { FilterBar } from "./features/filters/FilterBar";
import { MetricCardGrid } from "./features/metric-cards/MetricCardGrid";
import { TimeSeriesChart } from "./features/time-series/TimeSeriesChart";
import { BreakdownTable } from "./features/breakdown/BreakdownTable";
import { useUrlState } from "./hooks/useUrlState";

export const App: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("streampulse_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("streampulse_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("streampulse_theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const {
    rangePreset,
    timeRange,
    filters,
    metric,
    groupBy,
    breakdownDim,
    breakdownSearch,
    breakdownSort,
    breakdownOrder,
    breakdownPage,
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
  } = useUrlState();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <div className="max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 flex-1 flex flex-col space-y-4 sm:space-y-5">
        {/* Top Header & Global Filter Bar */}
        <FilterBar
          rangePreset={rangePreset}
          filters={filters}
          onRangeChange={setRangePreset}
          onFilterChange={setDimensionFilter}
          onClearFilters={clearAllFilters}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        {/* 6 Metric Cards Row */}
        <section aria-label="Key Performance Metrics">
          <MetricCardGrid
            timeRange={timeRange}
            filters={filters}
            selectedMetric={metric}
            onSelectMetric={setMetric}
            onClearFilters={clearAllFilters}
          />
        </section>

        {/* Lower Workspace: Time-Series Chart + Breakdown Table */}
        <section
          aria-label="Analytics Panels"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 flex-1 items-stretch"
        >
          {/* Left Panel: Time-series Chart */}
          <div className="lg:col-span-7 flex flex-col">
            <TimeSeriesChart
              timeRange={timeRange}
              metric={metric}
              groupBy={groupBy}
              onGroupByChange={setGroupBy}
              filters={filters}
              onClearFilters={clearAllFilters}
            />
          </div>

          {/* Right Panel: Breakdown Table */}
          <div className="lg:col-span-5 flex flex-col">
            <BreakdownTable
              timeRange={timeRange}
              metric={metric}
              dimension={breakdownDim}
              onDimensionChange={setBreakdownDim}
              filters={filters}
              search={breakdownSearch}
              onSearchChange={setBreakdownSearch}
              sortBy={breakdownSort}
              sortOrder={breakdownOrder}
              onSortChange={setBreakdownSort}
              page={breakdownPage}
              onPageChange={setBreakdownPage}
              onRowClick={addDimensionFilterValue}
              onClearFilters={clearAllFilters}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
