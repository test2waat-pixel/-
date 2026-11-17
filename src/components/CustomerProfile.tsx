import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Pencil,
  Trash2,
  MessageCircle,
  Copy,
  BellRing,
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
} from 'lucide-react';
import {
  AppSettings,
  CustomerSummary,
  Language,
  Transaction,
  TransactionType,
} from '../types';
import { TranslationStrings } from '../i18n';
import {
  buildReminderMessage,
  buildStatementMessage,
  buildWhatsAppHref,
  formatCurrency,
  formatDateTimeDisplay,
} from '../utils/format';

interface CustomerProfileProps {
  customer: CustomerSummary;
  transactions: Transaction[];
  settings: AppSettings;
  lang: Language;
  isRtl: boolean;
  t: TranslationStrings;
  onBack: () => void;
  onEditCustomer: () => void;
  onDeleteCustomer: () => void;
  onOpenCalculator: (type: TransactionType) => void;
  onRequestDeleteTransaction: (tx: Transaction) => void;
  onNotify: (msg: string) => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  customer,
  transactions,
  settings,
  lang,
  isRtl,
  t,
  onBack,
  onEditCustomer,
  onDeleteCustomer,
  onOpenCalculator,
  onRequestDeleteTransaction,
  onNotify,
}) => {
  const [pressingId, setPressingId] = useState<string | null>(null);
  const pressTimerRef = useRef<number | null>(null);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const isGivenBalance = customer.balance > 0;
  const isTakenBalance = customer.balance < 0;

  const balanceStatusText = isGivenBalance
    ? t.owesYouStatus
    : isTakenBalance
    ? t.youOweStatus
    : t.settledStatus;

  const statementMsg = buildStatementMessage({
    storeName: settings.storeName,
    customerName: customer.name,
    balance: customer.balance,
    transactions: sortedTransactions,
    lang,
    t,
  });

  const statementHref = buildWhatsAppHref(customer.phone, statementMsg);

  const reminderMsg = buildReminderMessage({
    template: settings.reminderTemplate,
    storeName: settings.storeName,
    customerName: customer.name,
    balance: customer.balance,
    lang,
  });

  const reminderHref = buildWhatsAppHref(customer.phone, reminderMsg);

  const handleCopyStatement = async () => {
    try {
      await navigator.clipboard.writeText(statementMsg);
      onNotify(t.statementCopied);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const startLongPress = (tx: Transaction) => {
    clearLongPress();
    setPressingId(tx.id);
    pressTimerRef.current = window.setTimeout(() => {
      setPressingId(null);
      if (navigator.vibrate) {
        navigator.vibrate(25);
      }
      onRequestDeleteTransaction(tx);
    }, 550);
  };

  const clearLongPress = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressingId(null);
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={t.back}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <BackIcon className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
              {customer.name}
            </h1>
            {customer.phone && (
              <p
                className="text-xs font-num text-slate-500 dark:text-slate-400 truncate flex items-center justify-center gap-1"
                dir="ltr"
              >
                <Phone className="w-3 h-3 shrink-0" />
                <span>{customer.phone}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onEditCustomer}
              aria-label={t.edit}
              title={t.edit}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDeleteCustomer}
              aria-label={t.delete}
              title={t.delete}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Top Column: Balance Card, WhatsApp & Action Buttons */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
          {/* Customer Balance Card */}
          <section className="rounded-3xl bg-slate-900 dark:bg-slate-900/95 text-white p-6 border border-slate-800 shadow-lg flex flex-col items-center text-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              {t.currentBalance}
            </span>
            <div
              className={`text-4xl font-extrabold font-num tabular-nums ${
                isGivenBalance
                  ? 'text-rose-400'
                  : isTakenBalance
                  ? 'text-emerald-400'
                  : 'text-white'
              }`}
              dir="ltr"
            >
              {formatCurrency(customer.balance, lang)}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span
                className={
                  isGivenBalance
                    ? 'text-rose-300'
                    : isTakenBalance
                    ? 'text-emerald-300'
                    : 'text-slate-300'
                }
              >
                {balanceStatusText}
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-slate-400 font-num tabular-nums">
                {sortedTransactions.length}
              </span>
            </div>

            {/* Given vs Taken Mini Totals */}
            <div className="w-full grid grid-cols-2 gap-3 pt-4 mt-2 border-t border-white/10">
              <div className="text-center">
                <div className="text-[11px] text-rose-300 font-semibold">
                  {t.givenTag}
                </div>
                <div className="text-base font-bold font-num text-rose-400 tabular-nums" dir="ltr">
                  {formatCurrency(customer.totalGiven, lang)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-emerald-300 font-semibold">
                  {t.takenTag}
                </div>
                <div className="text-base font-bold font-num text-emerald-400 tabular-nums" dir="ltr">
                  {formatCurrency(customer.totalTaken, lang)}
                </div>
              </div>
            </div>
          </section>

          {/* Two Large Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOpenCalculator('given')}
              className="min-h-[56px] px-3 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-5 h-5 shrink-0" />
              <span className="truncate">{t.giveButton}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenCalculator('taken')}
              className="min-h-[56px] px-3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <ArrowDownLeft className="w-5 h-5 shrink-0" />
              <span className="truncate">{t.takeButton}</span>
            </button>
          </div>

          {/* WhatsApp Actions */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <a
                href={statementHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[48px] px-4 rounded-2xl bg-[#128C7E] hover:bg-[#0f766a] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.sendWhatsAppStatement}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyStatement}
                aria-label={t.copyStatement}
                title={t.copyStatement}
                className="min-h-[48px] min-w-[48px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {isGivenBalance && (
              <a
                href={reminderHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors"
              >
                <BellRing className="w-4 h-4 shrink-0" />
                <span>{t.sendWhatsAppReminder}</span>
              </a>
            )}

            {!customer.phone && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                {t.noPhoneWarning}
              </p>
            )}
          </div>
        </div>

        {/* Right/Bottom Column: Shaded Transaction History with Long-Press Delete */}
        <section className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t.transactionsHistory}
            </h2>
            {sortedTransactions.length > 0 && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {t.longPressHint}
              </span>
            )}
          </div>

          {sortedTransactions.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t.emptyTransactions}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {sortedTransactions.map((tx) => {
                const isGiven = tx.type === 'given';
                const isPressing = pressingId === tx.id;
                return (
                  <div
                    key={tx.id}
                    onMouseDown={() => startLongPress(tx)}
                    onMouseUp={clearLongPress}
                    onMouseLeave={clearLongPress}
                    onTouchStart={() => startLongPress(tx)}
                    onTouchEnd={clearLongPress}
                    onTouchMove={clearLongPress}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onRequestDeleteTransaction(tx);
                    }}
                    className={`select-none rounded-2xl p-4 border transition-all shadow-xs ${
                      isPressing ? 'scale-[0.98] opacity-80' : ''
                    } ${
                      isGiven
                        ? 'bg-rose-50/75 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-900/60'
                        : 'bg-emerald-50/75 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-extrabold ${
                              isGiven
                                ? 'text-rose-700 dark:text-rose-300'
                                : 'text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {isGiven ? t.givenTag : t.takenTag}
                          </span>
                          <span aria-hidden="true" className="text-slate-400">
                            ·
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDateTimeDisplay(tx.date, lang)}
                          </span>
                        </div>
                        {tx.note && (
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 break-words">
                            {tx.note}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-lg font-extrabold font-num tabular-nums ${
                            isGiven
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                          dir="ltr"
                        >
                          {isGiven ? '+' : '-'}
                          {formatCurrency(tx.amount, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
