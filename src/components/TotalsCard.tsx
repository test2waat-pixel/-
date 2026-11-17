import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';
import { TranslationStrings } from '../i18n';
import { formatCurrency } from '../utils/format';

interface TotalsCardProps {
  t: TranslationStrings;
  lang: Language;
  totalGiven: number;
  totalTaken: number;
  netBalance: number;
  customerCount: number;
}

export const TotalsCard: React.FC<TotalsCardProps> = ({
  t,
  lang,
  totalGiven,
  totalTaken,
  netBalance,
  customerCount,
}) => {
  const netStateText =
    netBalance > 0
      ? t.netInYourFavor
      : netBalance < 0
      ? t.netYouOwe
      : t.netSettled;

  return (
    <section
      aria-label={t.netBalance}
      className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-900/95 text-white p-5 sm:p-6 border border-slate-800 dark:border-slate-800 shadow-lg shadow-slate-900/10 dark:shadow-black/30"
    >
      {/* Subtle geometric surface glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -end-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -start-16 w-56 h-56 rounded-full bg-rose-500/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Net Balance Header */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>{t.netBalance}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {customerCount} {t.customersCount}
            </span>
          </div>

          <div
            className={`text-3xl sm:text-4xl font-extrabold font-num tracking-tight tabular-nums ${
              netBalance > 0
                ? 'text-rose-400'
                : netBalance < 0
                ? 'text-emerald-400'
                : 'text-white'
            }`}
            dir="ltr"
          >
            {netBalance < 0 ? '-' : netBalance > 0 ? '+' : ''}
            {formatCurrency(netBalance, lang)}
          </div>

          <p className="text-xs font-medium text-slate-300">{netStateText}</p>
        </div>

        {/* Hairline Divider */}
        <div className="h-px bg-white/10" />

        {/* Given vs Taken Breakdown */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Total Given (Red) */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
              <ArrowUpRight className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.totalGiven}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-num text-rose-400 tabular-nums" dir="ltr">
              {formatCurrency(totalGiven, lang)}
            </div>
          </div>

          {/* Total Taken (Green) */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <ArrowDownLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.totalTaken}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-num text-emerald-400 tabular-nums" dir="ltr">
              {formatCurrency(totalTaken, lang)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
