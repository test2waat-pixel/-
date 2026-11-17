import React from 'react';
import { Settings, BookOpen } from 'lucide-react';
import { TranslationStrings } from '../i18n';

interface HeaderProps {
  t: TranslationStrings;
  storeLogo: string | null;
  storeName: string;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  storeLogo,
  storeName,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Start slot (Right in RTL): Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t.settings}
          title={t.settings}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Center slot: App Title & Designer credit */}
        <div className="flex flex-col items-center justify-center min-w-0 text-center">
          <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white truncate max-w-[210px] sm:max-w-xs">
            {t.appName}
          </h1>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[210px] sm:max-w-xs leading-tight">
            {t.designedBy}
          </p>
        </div>

        {/* End slot (Left in RTL): Circular Custom Store Logo */}
        <div className="min-w-[44px] flex items-center justify-end">
          {storeLogo ? (
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label={storeName || t.appName}
              className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <img
                src={storeLogo}
                alt={storeName || t.appName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label={t.storeLogoSection}
              title={t.storeLogoSection}
              className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
