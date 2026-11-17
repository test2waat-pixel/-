import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, ShieldAlert, X } from 'lucide-react';
import {
  ActiveView,
  AppSettings,
  BackupPayload,
  Customer,
  CustomerSummary,
  FilterState,
  Transaction,
  TransactionType,
} from './types';
import { translations } from './i18n';
import {
  createBackupPayload,
  downloadBackupFile,
  loadCustomers,
  loadSettings,
  loadTransactions,
  saveCustomers,
  saveSettings,
  saveTransactions,
  shareBackupFile,
  TWELVE_HOURS_MS,
} from './utils/storage';
import { Header } from './components/Header';
import { TotalsCard } from './components/TotalsCard';
import { FilterPanel } from './components/FilterPanel';
import { CustomerCard } from './components/CustomerCard';
import { CustomerModal } from './components/CustomerModal';
import { CustomerProfile } from './components/CustomerProfile';
import { CalculatorScreen } from './components/CalculatorScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ConfirmDialog } from './components/ConfirmDialog';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>(() => loadCustomers());
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadTransactions()
  );
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [calcInitialType, setCalcInitialType] =
    useState<TransactionType>('given');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    accountType: 'all',
    timeRange: 'newest',
    overdueOnly: false,
  });

  // Modals & Confirmations
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [deleteCustomerConfirmOpen, setDeleteCustomerConfirmOpen] =
    useState(false);
  const [pendingRestore, setPendingRestore] = useState<BackupPayload | null>(
    null
  );

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const t = translations[settings.language];
  const isRtl = settings.language === 'ar';

  // Sync HTML dir, lang, title, and dark class
  useEffect(() => {
    const root = document.documentElement;
    root.lang = settings.language;
    root.dir = isRtl ? 'rtl' : 'ltr';
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    document.title = `${t.appName} — ${t.designedBy}`;
  }, [settings.language, settings.darkMode, isRtl, t.appName, t.designedBy]);

  // Persist data to LocalStorage
  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Periodic tick every 60s for relative times & 12-hour backup reminder
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowTick(Date.now());
    }, 60000);
    return () => window.clearInterval(interval);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // Compute Customer Summaries & Global Totals
  const { customerSummaries, totalGiven, totalTaken, netBalance } =
    useMemo(() => {
      const txByCustomer = new Map<string, Transaction[]>();
      let globalGiven = 0;
      let globalTaken = 0;

      for (const tx of transactions) {
        if (tx.type === 'given') {
          globalGiven += tx.amount;
        } else {
          globalTaken += tx.amount;
        }
        const list = txByCustomer.get(tx.customerId);
        if (list) {
          list.push(tx);
        } else {
          txByCustomer.set(tx.customerId, [tx]);
        }
      }

      const overdueThresholdMs = (settings.overdueDays || 7) * 86400000;

      const summaries: CustomerSummary[] = customers.map((customer) => {
        const custTxs = txByCustomer.get(customer.id) ?? [];
        let custGiven = 0;
        let custTaken = 0;
        let lastTxTime = 0;

        for (const tx of custTxs) {
          if (tx.type === 'given') custGiven += tx.amount;
          else custTaken += tx.amount;
          const time = new Date(tx.date).getTime();
          if (time > lastTxTime) lastTxTime = time;
        }

        const balance = Math.round((custGiven - custTaken) * 100) / 100;
        const isOverdue =
          balance > 0 &&
          lastTxTime > 0 &&
          nowTick - lastTxTime >= overdueThresholdMs;

        return {
          ...customer,
          totalGiven: Math.round(custGiven * 100) / 100,
          totalTaken: Math.round(custTaken * 100) / 100,
          balance,
          lastTransactionAt: lastTxTime,
          transactionCount: custTxs.length,
          isOverdue,
        };
      });

      return {
        customerSummaries: summaries,
        totalGiven: Math.round(globalGiven * 100) / 100,
        totalTaken: Math.round(globalTaken * 100) / 100,
        netBalance: Math.round((globalGiven - globalTaken) * 100) / 100,
      };
    }, [customers, transactions, settings.overdueDays, nowTick]);

  // Filtered & sorted customer list
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = customerSummaries.filter((c) => {
      if (query) {
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesPhone = c.phone.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone) return false;
      }

      if (filters.accountType === 'owes_me' && c.balance <= 0) return false;
      if (filters.accountType === 'i_owe' && c.balance >= 0) return false;

      if (filters.overdueOnly && !c.isOverdue) return false;

      const refTime = c.lastTransactionAt || c.createdAt;
      if (filters.timeRange === 'last_24h') {
        if (nowTick - refTime > 86400000) return false;
      } else if (filters.timeRange === 'last_week') {
        if (nowTick - refTime > 7 * 86400000) return false;
      } else if (filters.timeRange === 'last_month') {
        if (nowTick - refTime > 30 * 86400000) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const timeA = a.lastTransactionAt || a.createdAt;
      const timeB = b.lastTransactionAt || b.createdAt;
      if (filters.timeRange === 'oldest') {
        return timeA - timeB;
      }
      return timeB - timeA;
    });
  }, [customerSummaries, searchQuery, filters, nowTick]);

  // 12-hour backup reminder check
  const showBackupReminder = useMemo(() => {
    if (customers.length === 0 && transactions.length === 0) return false;
    if (
      settings.reminderDismissedUntil &&
      nowTick < settings.reminderDismissedUntil
    ) {
      return false;
    }
    const oldestRecordAt = customers.reduce(
      (min, c) => (c.createdAt < min ? c.createdAt : min),
      nowTick
    );
    const baseline = settings.lastBackupAt ?? oldestRecordAt;
    return nowTick - baseline >= TWELVE_HOURS_MS;
  }, [customers, transactions, settings.lastBackupAt, settings.reminderDismissedUntil, nowTick]);

  const selectedCustomer = useMemo(
    () => customerSummaries.find((c) => c.id === selectedCustomerId) ?? null,
    [customerSummaries, selectedCustomerId]
  );

  const selectedCustomerTransactions = useMemo(
    () => transactions.filter((tx) => tx.customerId === selectedCustomerId),
    [transactions, selectedCustomerId]
  );

  // Handlers
  const handleSaveCustomer = ({
    name,
    phone,
  }: {
    name: string;
    phone: string;
  }) => {
    const now = Date.now();
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...c, name, phone, updatedAt: now } : c
        )
      );
      showToast(t.customerUpdated);
    } else {
      const newCustomer: Customer = {
        id: generateId(),
        name,
        phone,
        createdAt: now,
        updatedAt: now,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      showToast(t.customerAdded);
    }
    setCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  const handleConfirmDeleteCustomer = () => {
    if (!selectedCustomerId) return;
    setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomerId));
    setTransactions((prev) =>
      prev.filter((tx) => tx.customerId !== selectedCustomerId)
    );
    setDeleteCustomerConfirmOpen(false);
    setSelectedCustomerId(null);
    setActiveView('home');
    showToast(t.customerDeleted);
  };

  const handleAddTransaction = (data: {
    type: TransactionType;
    amount: number;
    note: string;
    date: string;
  }) => {
    if (!selectedCustomerId) return;
    const now = Date.now();
    const newTx: Transaction = {
      id: generateId(),
      customerId: selectedCustomerId,
      type: data.type,
      amount: data.amount,
      note: data.note,
      date: data.date,
      createdAt: now,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === selectedCustomerId ? { ...c, updatedAt: now } : c
      )
    );
    setActiveView('profile');
    showToast(t.transactionAdded);
  };

  const handleUndoLastTransaction = () => {
    if (!selectedCustomerId) return;
    const custTxs = transactions
      .filter((tx) => tx.customerId === selectedCustomerId)
      .sort((a, b) => b.createdAt - a.createdAt);

    if (custTxs.length === 0) {
      showToast(t.smartUndoEmpty);
      return;
    }

    const lastTx = custTxs[0];
    setTransactions((prev) => prev.filter((tx) => tx.id !== lastTx.id));
    setActiveView('profile');
    showToast(t.smartUndoDone);
  };

  const handleConfirmDeleteTransaction = () => {
    if (!txToDelete) return;
    setTransactions((prev) => prev.filter((tx) => tx.id !== txToDelete.id));
    setTxToDelete(null);
    showToast(t.transactionDeleted);
  };

  const handleExportBackup = () => {
    const payload = createBackupPayload(customers, transactions, settings);
    downloadBackupFile(payload);
    updateSettings({
      lastBackupAt: Date.now(),
      reminderDismissedUntil: null,
    });
    showToast(t.backupSuccess);
  };

  const handleShareBackup = async () => {
    const payload = createBackupPayload(customers, transactions, settings);
    try {
      await shareBackupFile(payload);
      updateSettings({
        lastBackupAt: Date.now(),
        reminderDismissedUntil: null,
      });
      showToast(t.backupSuccess);
    } catch {
      // User cancelled share sheet
    }
  };

  const handleConfirmRestore = () => {
    if (!pendingRestore) return;
    setCustomers(pendingRestore.customers);
    setTransactions(pendingRestore.transactions);
    if (pendingRestore.settings) {
      setSettings((prev) => ({
        ...prev,
        ...pendingRestore.settings,
      }));
    }
    setPendingRestore(null);
    setActiveView('home');
    showToast(t.restoreSuccess);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Screen Router */}
      {activeView === 'home' && (
        <div className="min-h-screen flex flex-col">
          <Header
            t={t}
            storeLogo={settings.storeLogo}
            storeName={settings.storeName}
            onOpenSettings={() => setActiveView('settings')}
          />

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Start Column on Desktop (Top on Mobile): Totals & 12h Reminder */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
              {showBackupReminder && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs font-extrabold text-amber-950 dark:text-amber-200">
                          {t.backupReminderBannerTitle}
                        </h3>
                        <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                          {t.backupReminderBannerDesc}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          reminderDismissedUntil: Date.now() + 2 * 60 * 60 * 1000,
                        })
                      }
                      aria-label={t.close}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-900/40 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="min-h-[40px] px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      {t.backupNowBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          reminderDismissedUntil: Date.now() + 2 * 60 * 60 * 1000,
                        })
                      }
                      className="min-h-[40px] px-3 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200/40 dark:hover:bg-amber-900/30 cursor-pointer transition-colors"
                    >
                      {t.snoozeReminderBtn}
                    </button>
                  </div>
                </div>
              )}

              <TotalsCard
                t={t}
                lang={settings.language}
                totalGiven={totalGiven}
                totalTaken={totalTaken}
                netBalance={netBalance}
                customerCount={customers.length}
              />
            </div>

            {/* Right/End Column on Desktop: Search, Filters & Customers List */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <FilterPanel
                t={t}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={filtersOpen}
                onToggleOpen={() => setFiltersOpen((prev) => !prev)}
              />

              {/* Section Header */}
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {t.customersTitle}
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-num tabular-nums">
                  {filteredCustomers.length} {t.customersCount}
                </span>
              </div>

              {/* Customers List or Empty State */}
              {customers.length === 0 ? (
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t.noCustomersTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    {t.noCustomersDesc}
                  </p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t.noResultsTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.noResultsDesc}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredCustomers.map((cust) => (
                    <CustomerCard
                      key={cust.id}
                      customer={cust}
                      lang={settings.language}
                      t={t}
                      onSelect={(id) => {
                        setSelectedCustomerId(id);
                        setActiveView('profile');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Prominent Floating Action Button (FAB) on the left */}
          <button
            type="button"
            onClick={() => {
              setEditingCustomer(null);
              setCustomerModalOpen(true);
            }}
            className="fixed bottom-5 left-5 z-30 min-h-[52px] px-5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-slate-900/25 dark:shadow-emerald-950/50 hover:bg-slate-800 dark:hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
          >
            <span>{t.addCustomerFab}</span>
            <span aria-hidden="true">👤</span>
          </button>
        </div>
      )}

      {activeView === 'profile' && selectedCustomer && (
        <CustomerProfile
          customer={selectedCustomer}
          transactions={selectedCustomerTransactions}
          settings={settings}
          lang={settings.language}
          isRtl={isRtl}
          t={t}
          onBack={() => setActiveView('home')}
          onEditCustomer={() => {
            setEditingCustomer(selectedCustomer);
            setCustomerModalOpen(true);
          }}
          onDeleteCustomer={() => setDeleteCustomerConfirmOpen(true)}
          onOpenCalculator={(type) => {
            setCalcInitialType(type);
            setActiveView('calculator');
          }}
          onRequestDeleteTransaction={(tx) => setTxToDelete(tx)}
          onNotify={showToast}
        />
      )}

      {activeView === 'calculator' && selectedCustomer && (
        <CalculatorScreen
          customerName={selectedCustomer.name}
          initialType={calcInitialType}
          hasPreviousTransactions={selectedCustomerTransactions.length > 0}
          lang={settings.language}
          isRtl={isRtl}
          t={t}
          onBack={() => setActiveView('profile')}
          onConfirmTransaction={handleAddTransaction}
          onUndoLastTransaction={handleUndoLastTransaction}
        />
      )}

      {activeView === 'settings' && (
        <SettingsScreen
          settings={settings}
          isRtl={isRtl}
          t={t}
          onBack={() => setActiveView('home')}
          onUpdateSettings={updateSettings}
          onExportBackup={handleExportBackup}
          onShareBackup={handleShareBackup}
          onRequestRestore={(payload) => setPendingRestore(payload)}
          onNotify={showToast}
        />
      )}

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        open={customerModalOpen}
        editingCustomer={editingCustomer}
        defaultCountryCode={settings.defaultCountryCode}
        t={t}
        onClose={() => {
          setCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
      />

      {/* Delete Transaction Confirmation */}
      <ConfirmDialog
        open={Boolean(txToDelete)}
        title={t.deleteTransactionTitle}
        description={t.deleteTransactionConfirm}
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        onConfirm={handleConfirmDeleteTransaction}
        onCancel={() => setTxToDelete(null)}
      />

      {/* Delete Customer Confirmation */}
      <ConfirmDialog
        open={deleteCustomerConfirmOpen}
        title={t.deleteCustomerTitle}
        description={t.deleteCustomerConfirm}
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        onConfirm={handleConfirmDeleteCustomer}
        onCancel={() => setDeleteCustomerConfirmOpen(false)}
      />

      {/* Restore Backup Confirmation */}
      <ConfirmDialog
        open={Boolean(pendingRestore)}
        title={t.restoreConfirmTitle}
        description={t.restoreConfirmDesc}
        confirmLabel={t.confirm}
        cancelLabel={t.cancel}
        destructive={false}
        onConfirm={handleConfirmRestore}
        onCancel={() => setPendingRestore(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xl border border-white/10 whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
