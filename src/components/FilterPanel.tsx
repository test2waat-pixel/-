import React from 'react';
import { Search, Dices, X, RotateCcw, Clock } from 'lucide-react';
import { AccountTypeFilter, FilterState, TimeFilter } from '../types';
import { TranslationStrings } from '../i18n';

interface FilterPanelProps {
  t: TranslationStrings;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: FilterState;
  onFiltersChange: (next: FilterState) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  t,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  isOpen,
  onToggleOpen,
}) => {
  const activeFilterCount =
    (filters.accountType !== 'all' ? 1 : 0) +
    (filters.timeRange !== 'newest' ? 1 : 0) +
    (filters.overdueOnly ? 1 : 0);

  const accountTypes: { value: AccountTypeFilter; label: string }[] = [
    { value: 'all', label: t.filterAll },
    { value: 'owes_me', label: t.filterOwesMe },
    { value: 'i_owe', label: t.filterIOwe },
  ];

  const timeRanges: { value: TimeFilter; label: string }[] = [
    { value: 'newest', label: t.sortNewest },
    { value: 'oldest', label: t.sortOldest },
    { value: 'last_24h', label: t.last24Hours },
    { value: 'last_week', label: t.lastWeek },
    { value: 'last_month', label: t.lastMonth },
  ];

  const handleReset = () => {
    onFiltersChange({
      accountType: 'all',
      timeRange: 'newest',
      overdueOnly: false,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search Bar + Dice Filter Button */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full h-12 ps-10 pe-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 dark:focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label={t.close}
              className="absolute top-1/2 -translate-y-1/2 end-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dice Button (🎲) */}
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-label={t.filtersTitle}
          title={t.filtersTitle}
          className={`relative min-h-[48px] min-w-[48px] px-3.5 rounded-2xl border flex items-center justify-center gap-1.5 font-semibold text-sm transition-all cursor-pointer active:scale-95 ${
            isOpen || activeFilterCount > 0
              ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span aria-hidden="true" className="text-lg leading-none">
            🎲
          </span>
          <Dices className="w-4 h-4 sr-only" />
          {activeFilterCount > 0 && (
            <span className="text-xs font-num tabular-nums font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible Filter Dropdown Panel */}
      {isOpen && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-md shadow-slate-900/5 dark:shadow-black/30 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.filtersTitle}
            </h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[36px] px-2.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetFilters}</span>
              </button>
            )}
          </div>

          {/* Account Type Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.accountTypeLabel}
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/70">
              {accountTypes.map((item) => {
                const active = filters.accountType === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      onFiltersChange({ ...filters, accountType: item.value })
                    }
                    className={`min-h-[40px] px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Range & Sort Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.timeRangeLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {timeRanges.map((item) => {
                const active = filters.timeRange === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      onFiltersChange({ ...filters, timeRange: item.value })
                    }
                    className={`min-h-[40px] px-3 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overdue Customers Filter integrated inside the panel */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  overdueOnly: !filters.overdueOnly,
                })
              }
              aria-pressed={filters.overdueOnly}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-start transition-all cursor-pointer ${
                filters.overdueOnly
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/70 text-amber-900 dark:text-amber-200'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Clock
                  className={`w-4 h-4 shrink-0 ${
                    filters.overdueOnly
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">
                    {t.overdueLabel}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {t.overdueHint}
                  </div>
                </div>
              </div>
              <span
                aria-hidden="true"
                className={`w-10 h-6 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                  filters.overdueOnly
                    ? 'bg-amber-500 justify-end'
                    : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
