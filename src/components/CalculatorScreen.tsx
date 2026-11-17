import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Delete,
  Check,
  Undo2,
  Calendar,
} from 'lucide-react';
import { Language, TransactionType } from '../types';
import { isUndoKeyword, TranslationStrings } from '../i18n';
import {
  evaluateMathExpression,
  formatCurrency,
  toLocalDateTimeInputValue,
} from '../utils/format';

interface CalculatorScreenProps {
  customerName: string;
  initialType: TransactionType;
  hasPreviousTransactions: boolean;
  lang: Language;
  isRtl: boolean;
  t: TranslationStrings;
  onBack: () => void;
  onConfirmTransaction: (data: {
    type: TransactionType;
    amount: number;
    note: string;
    date: string;
  }) => void;
  onUndoLastTransaction: () => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  customerName,
  initialType,
  hasPreviousTransactions,
  lang,
  isRtl,
  t,
  onBack,
  onConfirmTransaction,
  onUndoLastTransaction,
}) => {
  const [txType, setTxType] = useState<TransactionType>(initialType);
  const [expression, setExpression] = useState('');
  const [note, setNote] = useState('');
  const [dateTime, setDateTime] = useState(() => toLocalDateTimeInputValue());
  const [error, setError] = useState('');

  const undoTriggeredByNote = isUndoKeyword(note);
  const evaluated = evaluateMathExpression(expression);

  const appendToken = useCallback(
    (token: string) => {
      setError('');
      setExpression((prev) => {
        const operators = ['+', '−', '×', '÷'];
        const lastChar = prev.slice(-1);

        if (operators.includes(token)) {
          if (!prev) return prev;
          if (operators.includes(lastChar)) {
            return prev.slice(0, -1) + token;
          }
          return prev + token;
        }

        if (token === '.') {
          const segments = prev.split(/[+−×÷]/);
          const currentSegment = segments[segments.length - 1] ?? '';
          if (currentSegment.includes('.')) return prev;
          return prev ? prev + '.' : '0.';
        }

        return prev === '0' ? token : prev + token;
      });
    },
    []
  );

  const handleEquals = useCallback(() => {
    const val = evaluateMathExpression(expression);
    if (val !== null && val >= 0) {
      setExpression(String(val));
    }
  }, [expression]);

  const handleBackspace = useCallback(() => {
    setError('');
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setError('');
    setExpression('');
  }, []);

  // Keyboard support for desktop convenience
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        appendToken(e.key);
      } else if (e.key === '.') {
        appendToken('.');
      } else if (e.key === '+') {
        appendToken('+');
      } else if (e.key === '-') {
        appendToken('−');
      } else if (e.key === '*') {
        appendToken('×');
      } else if (e.key === '/') {
        e.preventDefault();
        appendToken('÷');
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [appendToken, handleBackspace, handleClear, handleEquals]);

  const handleConfirm = () => {
    if (undoTriggeredByNote) {
      onUndoLastTransaction();
      return;
    }

    const finalAmount = evaluateMathExpression(expression);
    if (finalAmount === null || finalAmount <= 0) {
      setError(t.invalidAmountError);
      return;
    }

    const parsedDate = new Date(dateTime);
    const isoDate = Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();

    onConfirmTransaction({
      type: txType,
      amount: finalAmount,
      note: note.trim(),
      date: isoDate,
    });
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const isGiven = txType === 'given';

  const keypadRows = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '−'],
    ['.', '0', '=', '+'],
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-3xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={t.back}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <BackIcon className="w-5 h-5" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {customerName}
            </h1>
            <p
              className={`text-xs font-bold truncate ${
                isGiven
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isGiven ? t.calcTitleGiven : t.calcTitleTaken}
            </p>
          </div>

          <div className="w-11" />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-4 pb-8 flex flex-col gap-4">
        {/* Type Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setTxType('given')}
            className={`min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isGiven
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.giveButton}
          </button>
          <button
            type="button"
            onClick={() => setTxType('taken')}
            className={`min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              !isGiven
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.takeButton}
          </button>
        </div>

        {/* Calculator Display */}
        <div className="rounded-3xl bg-slate-900 dark:bg-slate-900/95 text-white p-5 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 min-h-[24px]">
            <span
              className="text-sm font-num text-slate-400 truncate"
              dir="ltr"
            >
              {expression || t.expressionPlaceholder}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleClear}
                className="min-h-[36px] px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-200 cursor-pointer"
              >
                C
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                aria-label={t.delete}
                className="min-h-[36px] min-w-[40px] px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 flex items-center justify-center cursor-pointer"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className={`text-4xl sm:text-5xl font-extrabold font-num tabular-nums text-end ${
              isGiven ? 'text-rose-400' : 'text-emerald-400'
            }`}
            dir="ltr"
          >
            {evaluated !== null ? formatCurrency(evaluated, lang) : '0'}
          </div>
          {error && (
            <p className="text-xs font-semibold text-rose-400 text-end">
              {error}
            </p>
          )}
        </div>

        {/* Notes & Date/Time Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tx-note-input"
              className="text-xs font-bold text-slate-600 dark:text-slate-400"
            >
              {t.noteLabel}
            </label>
            <input
              id="tx-note-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholder}
              className="w-full h-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="tx-datetime-input"
              className="text-xs font-bold text-slate-600 dark:text-slate-400"
            >
              {t.dateTimeLabel}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                id="tx-datetime-input"
                type="datetime-local"
                dir="ltr"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full h-12 ps-10 pe-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-num text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Smart Undo Alert Banner when typing "حذف" */}
        {undoTriggeredByNote && (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
              <Undo2 className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="text-xs sm:text-sm font-bold">
                {hasPreviousTransactions ? t.smartUndoDetected : t.smartUndoEmpty}
              </span>
            </div>
            {hasPreviousTransactions && (
              <button
                type="button"
                onClick={onUndoLastTransaction}
                className="min-h-[44px] px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer active:scale-95 transition-all"
              >
                {t.smartUndoButton}
              </button>
            )}
          </div>
        )}

        {/* Full Calculator Keypad */}
        <div
          className="grid grid-cols-4 gap-2.5 select-none"
          dir="ltr"
        >
          {keypadRows.flat().map((key) => {
            const isOp = ['÷', '×', '−', '+', '='].includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => (key === '=' ? handleEquals() : appendToken(key))}
                className={`min-h-[56px] sm:min-h-[60px] rounded-2xl text-xl font-bold font-num transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  key === '='
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500'
                    : isOp
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-emerald-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className={`w-full min-h-[56px] rounded-2xl font-extrabold text-sm sm:text-base text-white flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer mt-1 ${
            undoTriggeredByNote && hasPreviousTransactions
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              : isGiven
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
          }`}
        >
          {undoTriggeredByNote && hasPreviousTransactions ? (
            <>
              <Undo2 className="w-5 h-5" />
              <span>{t.smartUndoButton}</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>{t.confirmTransaction}</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
};
