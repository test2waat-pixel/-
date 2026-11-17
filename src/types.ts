export type Language = 'ar' | 'en' | 'fr' | 'tr';

export type TransactionType = 'given' | 'taken';

export interface Transaction {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  note: string;
  date: string; // ISO string
  createdAt: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  createdAt: number;
  updatedAt: number;
}

export interface CustomerSummary extends Customer {
  totalGiven: number;
  totalTaken: number;
  balance: number; // totalGiven - totalTaken (>0: owes you / لك عليه, <0: you owe / له عليك)
  lastTransactionAt: number;
  transactionCount: number;
  isOverdue: boolean;
}

export interface AppSettings {
  language: Language;
  darkMode: boolean;
  storeName: string;
  storeLogo: string | null; // Base64 Data URL
  defaultCountryCode: string;
  reminderTemplate: string;
  overdueDays: number;
  lastBackupAt: number | null;
  reminderDismissedUntil: number | null;
  backupEmail: string;
}

export type AccountTypeFilter = 'all' | 'owes_me' | 'i_owe';
export type TimeFilter = 'newest' | 'oldest' | 'last_24h' | 'last_week' | 'last_month';

export interface FilterState {
  accountType: AccountTypeFilter;
  timeRange: TimeFilter;
  overdueOnly: boolean;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  customers: Customer[];
  transactions: Transaction[];
  settings: Partial<AppSettings>;
}

export type ActiveView = 'home' | 'profile' | 'calculator' | 'settings';
