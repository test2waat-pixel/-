import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  Moon,
  Sun,
  Download,
  Share2,
  FolderUp,
  Store,
  Globe,
  Phone,
  MessageSquareText,
  Mail,
} from 'lucide-react';
import { AppSettings, BackupPayload, Language } from '../types';
import { defaultReminderTemplates, TranslationStrings } from '../i18n';
import {
  buildGmailComposeHref,
  buildReminderMessage,
  compressLogoImage,
  formatDateTimeDisplay,
} from '../utils/format';
import { parseBackupFile } from '../utils/storage';

interface SettingsScreenProps {
  settings: AppSettings;
  isRtl: boolean;
  t: TranslationStrings;
  onBack: () => void;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onExportBackup: () => void;
  onShareBackup: () => void;
  onRequestRestore: (payload: BackupPayload) => void;
  onNotify: (msg: string) => void;
}

const COUNTRY_CODES = [
  { code: '+90', label: '🇹🇷 +90' },
  { code: '+963', label: '🇸🇾 +963' },
  { code: '+966', label: '🇸🇦 +966' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+962', label: '🇯🇴 +962' },
  { code: '+961', label: '🇱🇧 +961' },
  { code: '+964', label: '🇮🇶 +964' },
  { code: '+20', label: '🇪🇬 +20' },
  { code: '+212', label: '🇲🇦 +212' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+1', label: '🇺🇸 +1' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  isRtl,
  t,
  onBack,
  onUpdateSettings,
  onExportBackup,
  onShareBackup,
  onRequestRestore,
  onNotify,
}) => {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const restoreInputRef = useRef<HTMLInputElement | null>(null);
  const [customCode, setCustomCode] = useState(settings.defaultCountryCode);

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressLogoImage(file, 256);
      onUpdateSettings({ storeLogo: dataUrl });
      onNotify(t.settingsSaved);
    } catch {
      onNotify(t.restoreInvalidError);
    }
    e.target.value = '';
  };

  const handleLanguageChange = (newLang: Language) => {
    const currentDefault = defaultReminderTemplates[settings.language];
    const shouldSwapTemplate =
      !settings.reminderTemplate.trim() ||
      settings.reminderTemplate.trim() === currentDefault.trim();

    onUpdateSettings({
      language: newLang,
      ...(shouldSwapTemplate
        ? { reminderTemplate: defaultReminderTemplates[newLang] }
        : {}),
    });
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const payload = parseBackupFile(String(reader.result ?? ''));
      if (!payload) {
        onNotify(t.restoreInvalidError);
        return;
      }
      onRequestRestore(payload);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const insertVariable = (variable: '{name}' | '{balance}') => {
    const current = settings.reminderTemplate;
    const spacer = current && !current.endsWith(' ') ? ' ' : '';
    onUpdateSettings({ reminderTemplate: `${current}${spacer}${variable}` });
  };

  const previewText = buildReminderMessage({
    template: settings.reminderTemplate,
    storeName: settings.storeName,
    customerName: settings.language === 'ar' ? 'أحمد محمد' : 'Ahmad',
    balance: 1250,
    lang: settings.language,
  });

  const languages: { id: Language; label: string; native: string }[] = [
    { id: 'ar', label: 'العربية', native: 'RTL' },
    { id: 'en', label: 'English', native: 'LTR' },
    { id: 'fr', label: 'Français', native: 'LTR' },
    { id: 'tr', label: 'Türkçe', native: 'LTR' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={t.back}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <BackIcon className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {t.settingsTitle}
          </h1>

          <div className="w-11" />
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 pb-14 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Store Logo & Store Name */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.storeLogoSection}</span>
            </h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                {settings.storeLogo ? (
                  <img
                    src={settings.storeLogo}
                    alt={settings.storeName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-7 h-7 text-slate-400" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="min-h-[44px] px-4 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-emerald-500 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>{settings.storeLogo ? t.changeLogo : t.uploadLogo}</span>
                </button>

                {settings.storeLogo && (
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ storeLogo: null })}
                    className="min-h-[44px] px-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/60 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.removeLogo}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Store Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="store-name-input"
              className="text-sm font-extrabold text-slate-900 dark:text-white"
            >
              {t.storeNameSection}
            </label>
            <input
              id="store-name-input"
              type="text"
              value={settings.storeName}
              onChange={(e) => onUpdateSettings({ storeName: e.target.value })}
              placeholder={t.storeNamePlaceholder}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
          </div>
        </section>

        {/* Language & Dark Mode */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-5">
          {/* Language Selector */}
          <div className="flex flex-col gap-2.5">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.languageSection}</span>
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((item) => {
                const active = settings.language === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleLanguageChange(item.id)}
                    className={`min-h-[48px] px-3.5 rounded-2xl border flex items-center justify-between gap-2 text-sm font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[11px] opacity-70">{item.native}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Dark Mode Toggle */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t.appearanceSection}
            </h2>
            <button
              type="button"
              role="switch"
              aria-checked={settings.darkMode}
              onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
              className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {settings.darkMode ? (
                  <Moon className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {t.darkModeLabel}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {t.darkModeDesc}
                  </div>
                </div>
              </div>
              <span
                aria-hidden="true"
                className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center ${
                  settings.darkMode
                    ? 'bg-emerald-600 justify-end'
                    : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </span>
            </button>
          </div>
        </section>

        {/* Country Code & Reminder Template */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-5">
          {/* Default Country Code */}
          <div className="flex flex-col gap-2.5">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.countryCodeSection}</span>
            </h2>

            <div className="flex flex-wrap gap-1.5" dir="ltr">
              {COUNTRY_CODES.map((c) => {
                const active = settings.defaultCountryCode === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCustomCode(c.code);
                      onUpdateSettings({ defaultCountryCode: c.code });
                    }}
                    className={`min-h-[38px] px-2.5 rounded-xl text-xs font-num font-bold border transition-all cursor-pointer ${
                      active
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              dir="ltr"
              value={customCode}
              onChange={(e) => {
                const val = e.target.value;
                setCustomCode(val);
                if (/^\+?\d{1,4}$/.test(val.trim())) {
                  const normalized = val.trim().startsWith('+')
                    ? val.trim()
                    : `+${val.trim()}`;
                  onUpdateSettings({ defaultCountryCode: normalized });
                }
              }}
              placeholder={t.countryCodeCustom}
              className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-num text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Overdue Reminder Template */}
          <div className="flex flex-col gap-2.5">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.reminderTemplateSection}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.reminderTemplateHelp}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => insertVariable('{name}')}
                className="min-h-[38px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {t.insertVarName}
              </button>
              <button
                type="button"
                onClick={() => insertVariable('{balance}')}
                className="min-h-[38px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {t.insertVarBalance}
              </button>
            </div>

            <textarea
              rows={3}
              value={settings.reminderTemplate}
              onChange={(e) =>
                onUpdateSettings({ reminderTemplate: e.target.value })
              }
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />

            <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-950/70 p-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="font-bold mb-1 text-slate-500 dark:text-slate-400">
                {t.templatePreview}
              </div>
              <p className="whitespace-pre-line leading-relaxed">{previewText}</p>
            </div>
          </div>
        </section>

        {/* Backup & Restore */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t.backupSection}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.lastBackupLabel}{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {settings.lastBackupAt
                  ? formatDateTimeDisplay(settings.lastBackupAt, settings.language)
                  : t.neverBackedUp}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onExportBackup}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-emerald-500 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportBackup}</span>
            </button>

            <button
              type="button"
              onClick={onShareBackup}
              className="w-full min-h-[48px] px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareBackup}</span>
            </button>

            {/* Send Backup to Gmail */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col gap-2.5">
              <label
                htmlFor="gmail-recipient-input"
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {t.gmailRecipientLabel}
              </label>
              <input
                id="gmail-recipient-input"
                type="email"
                dir="ltr"
                value={settings.backupEmail}
                onChange={(e) =>
                  onUpdateSettings({ backupEmail: e.target.value })
                }
                placeholder={t.gmailRecipientPlaceholder}
                className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-num text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
              <a
                href={buildGmailComposeHref({
                  to: settings.backupEmail,
                  subject: `${t.appName} - ${settings.storeName || t.appName} (${new Date().toISOString().slice(0, 10)})`,
                  body: `${t.appName} (${settings.storeName || t.appName})\n${t.lastBackupLabel} ${new Date().toLocaleString()}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onExportBackup}
                className="w-full min-h-[46px] px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>{t.sendBackupToGmail}</span>
              </a>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.gmailBackupReadyHint}
              </p>
            </div>

            <input
              ref={restoreInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleRestoreFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => restoreInputRef.current?.click()}
              className="w-full min-h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <FolderUp className="w-4 h-4" />
              <span>{t.restoreBackup}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
