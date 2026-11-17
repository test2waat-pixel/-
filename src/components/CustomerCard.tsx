import React from 'react';
import { CustomerSummary, Language } from '../types';
import { TranslationStrings } from '../i18n';
import { formatCurrency, formatRelativeTime } from '../utils/format';

interface CustomerCardProps {
  customer: CustomerSummary;
  lang: Language;
  t: TranslationStrings;
  onSelect: (customerId: string) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  lang,
  t,
  onSelect,
}) => {
  const isGiven = customer.balance > 0;
  const isTaken = customer.balance < 0;

  const statusLabel = isGiven
    ? `${t.givenTag} · ${t.owesYouShort}`
    : isTaken
    ? `${t.takenTag} · ${t.youOweShort}`
    : t.settledTag;

  const relativeTime = formatRelativeTime(customer.lastTransactionAt, t);

  return (
    <button
      type="button"
      onClick={() => onSelect(customer.id)}
      className="w-full min-h-[72px] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99] transition-all flex items-center justify-between gap-3 text-start cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
    >
      {/* Customer Name flush to start edge (right in RTL) & elapsed time */}
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
            {customer.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          <span>{relativeTime}</span>
          {customer.isOverdue && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {t.overdueBadge}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Remaining balance & classification (Given/Taken) */}
      <div className="shrink-0 flex flex-col items-end gap-0.5">
        <span
          className={`text-base sm:text-lg font-extrabold font-num tabular-nums ${
            isGiven
              ? 'text-rose-600 dark:text-rose-400'
              : isTaken
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          dir="ltr"
        >
          {formatCurrency(customer.balance, lang)}
        </span>
        <span
          className={`text-xs font-semibold ${
            isGiven
              ? 'text-rose-600/90 dark:text-rose-400/90'
              : isTaken
              ? 'text-emerald-600/90 dark:text-emerald-400/90'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {statusLabel}
        </span>
      </div>
    </button>
  );
};
