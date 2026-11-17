import { AppSettings, BackupPayload, Customer, Transaction } from '../types';
import { defaultReminderTemplates } from '../i18n';

const KEYS = {
  CUSTOMERS: 'daftar_hisabat_customers_v1',
  TRANSACTIONS: 'daftar_hisabat_transactions_v1',
  SETTINGS: 'daftar_hisabat_settings_v1',
};

export const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export const defaultSettings: AppSettings = {
  language: 'ar',
  darkMode: false,
  storeName: 'دفتر الحسابات',
  storeLogo: null,
  defaultCountryCode: '+90',
  reminderTemplate: defaultReminderTemplates.ar,
  overdueDays: 7,
  lastBackupAt: null,
  reminderDismissedUntil: null,
  backupEmail: '',
};

export function loadCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOMERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomers(customers: Customer[]): void {
  try {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function createBackupPayload(
  customers: Customer[],
  transactions: Transaction[],
  settings: AppSettings
): BackupPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    customers,
    transactions,
    settings,
  };
}

export function downloadBackupFile(payload: BackupPayload): void {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `daftar-hisabat-backup-${dateStamp}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function shareBackupFile(payload: BackupPayload): Promise<boolean> {
  const json = JSON.stringify(payload, null, 2);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `daftar-hisabat-backup-${dateStamp}.json`;
  const file = new File([json], fileName, { type: 'application/json' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: 'Daftar Hisabat Backup',
    });
    return true;
  }
  downloadBackupFile(payload);
  return false;
}

export function parseBackupFile(rawJson: string): BackupPayload | null {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.customers) || !Array.isArray(parsed.transactions)) {
      return null;
    }

    const validCustomers: Customer[] = parsed.customers.filter(
      (c: unknown): c is Customer =>
        Boolean(c && typeof c === 'object' && typeof (c as Customer).id === 'string' && typeof (c as Customer).name === 'string')
    );

    const validTransactions: Transaction[] = parsed.transactions.filter(
      (tx: unknown): tx is Transaction =>
        Boolean(
          tx &&
            typeof tx === 'object' &&
            typeof (tx as Transaction).id === 'string' &&
            typeof (tx as Transaction).customerId === 'string' &&
            ((tx as Transaction).type === 'given' || (tx as Transaction).type === 'taken') &&
            typeof (tx as Transaction).amount === 'number'
        )
    );

    return {
      version: typeof parsed.version === 'number' ? parsed.version : 1,
      exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
      customers: validCustomers,
      transactions: validTransactions,
      settings: parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {},
    };
  } catch {
    return null;
  }
}

export function isBackupDue(settings: AppSettings, hasData: boolean): boolean {
  if (!hasData) return false;
  const now = Date.now();
  if (settings.reminderDismissedUntil && now < settings.reminderDismissedUntil) {
    return false;
  }
  if (!settings.lastBackupAt) {
    return false; // Only start 12-hour countdown once user has used the app or set a baseline
  }
  return now - settings.lastBackupAt >= TWELVE_HOURS_MS;
}
