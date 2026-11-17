import { Language } from './types';

export interface TranslationStrings {
  appName: string;
  designedBy: string;
  settings: string;
  back: string;
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  close: string;

  // Totals Card
  netBalance: string;
  netInYourFavor: string;
  netYouOwe: string;
  netSettled: string;
  totalGiven: string;
  totalTaken: string;

  // Search & Filters
  searchPlaceholder: string;
  filtersTitle: string;
  resetFilters: string;
  accountTypeLabel: string;
  filterAll: string;
  filterOwesMe: string;
  filterIOwe: string;
  timeRangeLabel: string;
  sortNewest: string;
  sortOldest: string;
  last24Hours: string;
  lastWeek: string;
  lastMonth: string;
  overdueLabel: string;
  overdueHint: string;
  activeFiltersCount: string;

  // Customers List
  customersTitle: string;
  customersCount: string;
  addCustomerFab: string;
  noCustomersTitle: string;
  noCustomersDesc: string;
  noResultsTitle: string;
  noResultsDesc: string;
  givenTag: string;
  takenTag: string;
  settledTag: string;
  owesYouShort: string;
  youOweShort: string;
  noTransactionsYet: string;
  overdueBadge: string;

  // Add/Edit Customer Modal
  addCustomerTitle: string;
  editCustomerTitle: string;
  customerNameLabel: string;
  customerNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  pickFromContacts: string;
  importVcfContact: string;
  contactsUnsupportedHint: string;
  contactNoPhoneError: string;
  countryCodeHint: string;
  nameRequiredError: string;
  customerAdded: string;
  customerUpdated: string;
  customerDeleted: string;

  // Customer Profile
  currentBalance: string;
  owesYouStatus: string;
  youOweStatus: string;
  settledStatus: string;
  sendWhatsAppStatement: string;
  sendWhatsAppReminder: string;
  copyStatement: string;
  statementCopied: string;
  noPhoneWarning: string;
  giveButton: string;
  takeButton: string;
  transactionsHistory: string;
  longPressHint: string;
  emptyTransactions: string;
  deleteTransactionTitle: string;
  deleteTransactionConfirm: string;
  deleteCustomerTitle: string;
  deleteCustomerConfirm: string;
  transactionDeleted: string;

  // Calculator Screen
  calcTitleGiven: string;
  calcTitleTaken: string;
  noteLabel: string;
  notePlaceholder: string;
  dateTimeLabel: string;
  smartUndoDetected: string;
  smartUndoButton: string;
  smartUndoDone: string;
  smartUndoEmpty: string;
  confirmTransaction: string;
  invalidAmountError: string;
  transactionAdded: string;
  expressionPlaceholder: string;

  // Settings Screen
  settingsTitle: string;
  storeLogoSection: string;
  uploadLogo: string;
  changeLogo: string;
  removeLogo: string;
  languageSection: string;
  storeNameSection: string;
  storeNamePlaceholder: string;
  countryCodeSection: string;
  countryCodeCustom: string;
  reminderTemplateSection: string;
  reminderTemplateHelp: string;
  insertVarName: string;
  insertVarBalance: string;
  templatePreview: string;
  appearanceSection: string;
  darkModeLabel: string;
  darkModeDesc: string;
  backupSection: string;
  exportBackup: string;
  shareBackup: string;
  sendBackupToGmail: string;
  gmailRecipientLabel: string;
  gmailRecipientPlaceholder: string;
  gmailBackupReadyHint: string;
  restoreBackup: string;
  lastBackupLabel: string;
  neverBackedUp: string;
  backupSuccess: string;
  restoreConfirmTitle: string;
  restoreConfirmDesc: string;
  restoreSuccess: string;
  restoreInvalidError: string;
  backupReminderBannerTitle: string;
  backupReminderBannerDesc: string;
  backupNowBtn: string;
  snoozeReminderBtn: string;
  settingsSaved: string;

  // WhatsApp Statement Template pieces
  waStatementTitle: string;
  waCustomerLabel: string;
  waStatusLabel: string;
  waBalanceLabel: string;
  waRecentOps: string;
  waDateLabel: string;

  // Relative time
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  monthsAgo: string;
}

export const defaultReminderTemplates: Record<Language, string> = {
  ar: 'مرحباً {name}، نود تذكيركم بلطف بأن الرصيد المستحق عليكم هو {balance}. شاكرين تعاونكم.',
  en: 'Hello {name}, a friendly reminder that your current due balance is {balance}. Thank you.',
  fr: 'Bonjour {name}, petit rappel : votre solde dû est de {balance}. Merci pour votre confiance.',
  tr: 'Merhaba {name}, güncel borç bakiyenizin {balance} olduğunu nazikçe hatırlatmak isteriz. Teşekkürler.',
};

export const translations: Record<Language, TranslationStrings> = {
  ar: {
    appName: 'دفتر الحسابات',
    designedBy: 'تصميم فراس المحمود',
    settings: 'الإعدادات',
    back: 'رجوع',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',

    netBalance: 'صافي الحساب المتبقي',
    netInYourFavor: 'صافي لك في السوق',
    netYouOwe: 'صافي مطلوب منك',
    netSettled: 'الحسابات متوازنة',
    totalGiven: 'إجمالي ما أعطيت',
    totalTaken: 'إجمالي ما أخذت',

    searchPlaceholder: 'ابحث باسم العميل أو الرقم...',
    filtersTitle: 'خيارات الفلترة والترتيب',
    resetFilters: 'إعادة ضبط',
    accountTypeLabel: 'نوع الحساب',
    filterAll: 'الكل',
    filterOwesMe: 'لك عليه',
    filterIOwe: 'له عليك',
    timeRangeLabel: 'الوقت والترتيب',
    sortNewest: 'الأحدث',
    sortOldest: 'الأقدم',
    last24Hours: 'آخر 24 ساعة',
    lastWeek: 'آخر أسبوع',
    lastMonth: 'آخر شهر',
    overdueLabel: 'المتأخرين عن السداد',
    overdueHint: 'عملاء لديهم دين مستحق مضى عليه أكثر من 7 أيام',
    activeFiltersCount: 'فلتر نشط',

    customersTitle: 'قائمة العملاء',
    customersCount: 'عميل',
    addCustomerFab: '+ إضافة عميل',
    noCustomersTitle: 'دفترك فارغ حالياً',
    noCustomersDesc: 'ابدأ بإضافة أول عميل لتسجيل الديون والدفعات ومتابعتها بسهولة.',
    noResultsTitle: 'لا توجد نتائج مطابقة',
    noResultsDesc: 'جرّب تغيير كلمات البحث أو إعادة ضبط الفلاتر.',
    givenTag: 'أعطيت',
    takenTag: 'أخذت',
    settledTag: 'مصفر',
    owesYouShort: 'لك عليه',
    youOweShort: 'له عليك',
    noTransactionsYet: 'لا توجد عمليات بعد',
    overdueBadge: 'متأخر بالسداد',

    addCustomerTitle: 'إضافة عميل جديد',
    editCustomerTitle: 'تعديل بيانات العميل',
    customerNameLabel: 'اسم العميل',
    customerNamePlaceholder: 'مثال: أحمد محمد',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: 'مثال: 5312345678',
    pickFromContacts: 'جلب من سجل الهاتف',
    importVcfContact: 'استيراد جهة اتصال (.vcf)',
    contactsUnsupportedHint: 'متصفحك الحالي لا يدعم الوصول المباشر لسجل الهاتف؛ يمكنك استيراد بطاقة جهة اتصال (.vcf) أو إدخال الرقم يدوياً.',
    contactNoPhoneError: 'لم يتم العثور على رقم هاتف في جهة الاتصال المختارة',
    countryCodeHint: 'يُضاف رمز الدولة تلقائياً:',
    nameRequiredError: 'يرجى إدخال اسم العميل',
    customerAdded: 'تمت إضافة العميل بنجاح',
    customerUpdated: 'تم تحديث بيانات العميل',
    customerDeleted: 'تم حذف العميل وعملياته',

    currentBalance: 'الرصيد الحالي',
    owesYouStatus: 'لك عليه',
    youOweStatus: 'له عليك',
    settledStatus: 'مصفر',
    sendWhatsAppStatement: 'إرسال كشف عبر واتساب',
    sendWhatsAppReminder: 'تذكير بالسداد عبر واتساب',
    copyStatement: 'نسخ الكشف',
    statementCopied: 'تم نسخ كشف الحساب',
    noPhoneWarning: 'أضف رقم هاتف للعميل لإرسال الرسالة مباشرة عبر واتساب',
    giveButton: 'أعطيت (لك عليه)',
    takeButton: 'أخذت (له عليك)',
    transactionsHistory: 'سجل العمليات المالية',
    longPressHint: 'اضغط مطولاً على أي عملية لحذفها',
    emptyTransactions: 'لا توجد عمليات مسجلة لهذا العميل حتى الآن',
    deleteTransactionTitle: 'حذف العملية',
    deleteTransactionConfirm: 'هل أنت متأكد من حذف هذه العملية؟ سيتم تحديث رصيد العميل فوراً.',
    deleteCustomerTitle: 'حذف العميل',
    deleteCustomerConfirm: 'هل تريد حذف هذا العميل وكافة عملياته المالية نهائياً؟',
    transactionDeleted: 'تم حذف العملية وتحديث الرصيد',

    calcTitleGiven: 'تسجيل عملية: أعطيت (لك عليه)',
    calcTitleTaken: 'تسجيل عملية: أخذت (له عليك)',
    noteLabel: 'الملاحظات',
    notePlaceholder: 'اكتب بياناً أو كلمة "حذف" للتراجع عن آخر عملية...',
    dateTimeLabel: 'التاريخ والوقت',
    smartUndoDetected: 'تم تفعيل التراجع الذكي: حذف العملية الأخيرة فوراً',
    smartUndoButton: 'حذف العملية الأخيرة الآن',
    smartUndoDone: 'تم التراجع وحذف العملية الأخيرة بنجاح',
    smartUndoEmpty: 'لا توجد عمليات سابقة لحذفها لهذا العميل',
    confirmTransaction: 'تأكيد وإضافة العملية',
    invalidAmountError: 'يرجى إدخال مبلغ صحيح أكبر من صفر',
    transactionAdded: 'تم تسجيل العملية وتحديث الرصيد',
    expressionPlaceholder: '0',

    settingsTitle: 'إعدادات التطبيق',
    storeLogoSection: 'شعار المحل',
    uploadLogo: 'رفع شعار المحل',
    changeLogo: 'تغيير الشعار',
    removeLogo: 'حذف الشعار',
    languageSection: 'لغة التطبيق',
    storeNameSection: 'اسم المحل / النشاط التجاري',
    storeNamePlaceholder: 'مثال: متجر البركة',
    countryCodeSection: 'رمز الدولة الافتراضي',
    countryCodeCustom: 'رمز مخصص (مثل +90)',
    reminderTemplateSection: 'قالب رسالة التذكير للمتأخرين',
    reminderTemplateHelp: 'استخدم المتغيرات التلقائية ليتم استبدالها باسم العميل والمبلغ عند الإرسال:',
    insertVarName: 'إدراج {name}',
    insertVarBalance: 'إدراج {balance}',
    templatePreview: 'معاينة الرسالة:',
    appearanceSection: 'المظهر',
    darkModeLabel: 'الوضع الليلي (Dark Mode)',
    darkModeDesc: 'تبديل مظهر التطبيق بين الوضع النهاري والليلي',
    backupSection: 'النسخ الاحتياطي والاستعادة',
    exportBackup: 'حفظ نسخة احتياطية (JSON)',
    shareBackup: 'مشاركة النسخة الاحتياطية',
    sendBackupToGmail: 'إرسال النسخة الاحتياطية إلى Gmail',
    gmailRecipientLabel: 'بريد Gmail المستلم (اختياري)',
    gmailRecipientPlaceholder: 'example@gmail.com',
    gmailBackupReadyHint: 'يتم تنزيل ملف النسخة الاحتياطية (.json) وفتح Gmail لإرساله كمرفق، أو مشاركته مباشرة مع تطبيق Gmail على الهاتف.',
    restoreBackup: 'استعادة من ملف سابق',
    lastBackupLabel: 'آخر نسخة احتياطية:',
    neverBackedUp: 'لم يتم أخذ نسخة احتياطية بعد',
    backupSuccess: 'تم حفظ النسخة الاحتياطية بنجاح',
    restoreConfirmTitle: 'استعادة النسخة الاحتياطية',
    restoreConfirmDesc: 'سيتم استبدال البيانات الحالية بالبيانات الموجودة في الملف. هل تريد المتابعة؟',
    restoreSuccess: 'تمت استعادة البيانات بنجاح',
    restoreInvalidError: 'الملف المختار غير صالح أو تالف',
    backupReminderBannerTitle: 'تذكير النسخ الاحتياطي (12 ساعة)',
    backupReminderBannerDesc: 'مضى أكثر من 12 ساعة على آخر نسخة احتياطية لحساباتك.',
    backupNowBtn: 'نسخ احتياطي الآن',
    snoozeReminderBtn: 'تأجيل',
    settingsSaved: 'تم حفظ الإعدادات',

    waStatementTitle: 'كشف حساب تفصيلي',
    waCustomerLabel: 'العميل',
    waStatusLabel: 'حالة الحساب',
    waBalanceLabel: 'الرصيد المتبقي',
    waRecentOps: 'آخر العمليات',
    waDateLabel: 'التاريخ',

    justNow: 'الآن',
    minutesAgo: 'منذ {n} د',
    hoursAgo: 'منذ {n} س',
    daysAgo: 'منذ {n} ي',
    monthsAgo: 'منذ {n} ش',
  },
  en: {
    appName: 'Accounts Ledger',
    designedBy: 'Designed by Firas Al-Mahmoud',
    settings: 'Settings',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',

    netBalance: 'Net Remaining Balance',
    netInYourFavor: 'Net owed to you',
    netYouOwe: 'Net you owe',
    netSettled: 'All accounts settled',
    totalGiven: 'Total Given',
    totalTaken: 'Total Taken',

    searchPlaceholder: 'Search customer name or phone...',
    filtersTitle: 'Filters & Sorting',
    resetFilters: 'Reset',
    accountTypeLabel: 'Account Type',
    filterAll: 'All',
    filterOwesMe: 'Owes You',
    filterIOwe: 'You Owe',
    timeRangeLabel: 'Time & Sort',
    sortNewest: 'Newest',
    sortOldest: 'Oldest',
    last24Hours: 'Last 24 Hours',
    lastWeek: 'Last Week',
    lastMonth: 'Last Month',
    overdueLabel: 'Overdue Payments',
    overdueHint: 'Customers owing money for more than 7 days',
    activeFiltersCount: 'active',

    customersTitle: 'Customers',
    customersCount: 'customers',
    addCustomerFab: '+ Add Customer',
    noCustomersTitle: 'Your ledger is empty',
    noCustomersDesc: 'Add your first customer to start tracking debts and payments effortlessly.',
    noResultsTitle: 'No matching customers',
    noResultsDesc: 'Try adjusting your search query or resetting active filters.',
    givenTag: 'Given',
    takenTag: 'Taken',
    settledTag: 'Settled',
    owesYouShort: 'Owes You',
    youOweShort: 'You Owe',
    noTransactionsYet: 'No transactions yet',
    overdueBadge: 'Overdue',

    addCustomerTitle: 'Add New Customer',
    editCustomerTitle: 'Edit Customer',
    customerNameLabel: 'Customer Name',
    customerNamePlaceholder: 'e.g., Ahmad Mohammad',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'e.g., 5312345678',
    pickFromContacts: 'Pick from Phone Contacts',
    importVcfContact: 'Import Contact (.vcf)',
    contactsUnsupportedHint: 'Direct contact picker is unavailable in this browser; you can import a .vcf contact card or enter the number manually.',
    contactNoPhoneError: 'No phone number found in the selected contact',
    countryCodeHint: 'Default country code applied:',
    nameRequiredError: 'Please enter the customer name',
    customerAdded: 'Customer added successfully',
    customerUpdated: 'Customer details updated',
    customerDeleted: 'Customer and transactions deleted',

    currentBalance: 'Current Balance',
    owesYouStatus: 'Owes You',
    youOweStatus: 'You Owe',
    settledStatus: 'Settled',
    sendWhatsAppStatement: 'Send Statement via WhatsApp',
    sendWhatsAppReminder: 'Send Payment Reminder',
    copyStatement: 'Copy Statement',
    statementCopied: 'Statement copied to clipboard',
    noPhoneWarning: 'Add a phone number to send directly via WhatsApp',
    giveButton: 'Gave (Owes You)',
    takeButton: 'Took (You Owe)',
    transactionsHistory: 'Transaction History',
    longPressHint: 'Long-press any transaction card to delete it',
    emptyTransactions: 'No transactions recorded for this customer yet',
    deleteTransactionTitle: 'Delete Transaction',
    deleteTransactionConfirm: 'Delete this transaction? The customer balance will update immediately.',
    deleteCustomerTitle: 'Delete Customer',
    deleteCustomerConfirm: 'Permanently delete this customer and all their transactions?',
    transactionDeleted: 'Transaction deleted and balance updated',

    calcTitleGiven: 'Record: Gave (Owes You)',
    calcTitleTaken: 'Record: Took (You Owe)',
    noteLabel: 'Notes',
    notePlaceholder: 'Add a note or type "حذف" / "delete" to undo last entry...',
    dateTimeLabel: 'Date & Time',
    smartUndoDetected: 'Smart Undo Ready: Delete the last transaction immediately',
    smartUndoButton: 'Delete Last Transaction Now',
    smartUndoDone: 'Last transaction undone and deleted',
    smartUndoEmpty: 'No previous transaction to undo for this customer',
    confirmTransaction: 'Confirm & Add Transaction',
    invalidAmountError: 'Please enter a valid amount greater than zero',
    transactionAdded: 'Transaction recorded and balance updated',
    expressionPlaceholder: '0',

    settingsTitle: 'App Settings',
    storeLogoSection: 'Store Logo',
    uploadLogo: 'Upload Logo',
    changeLogo: 'Change Logo',
    removeLogo: 'Remove Logo',
    languageSection: 'Application Language',
    storeNameSection: 'Store Name',
    storeNamePlaceholder: 'e.g., Al-Baraka Store',
    countryCodeSection: 'Default Country Code',
    countryCodeCustom: 'Custom code (e.g. +90)',
    reminderTemplateSection: 'Overdue Reminder Template',
    reminderTemplateHelp: 'Use variables below; they will auto-fill customer name and due amount:',
    insertVarName: 'Insert {name}',
    insertVarBalance: 'Insert {balance}',
    templatePreview: 'Message Preview:',
    appearanceSection: 'Appearance',
    darkModeLabel: 'Dark Mode',
    darkModeDesc: 'Switch between light and dark themes',
    backupSection: 'Backup & Restore',
    exportBackup: 'Download Backup (JSON)',
    shareBackup: 'Share Backup File',
    sendBackupToGmail: 'Send Backup to Gmail',
    gmailRecipientLabel: 'Recipient Gmail (optional)',
    gmailRecipientPlaceholder: 'example@gmail.com',
    gmailBackupReadyHint: 'Downloads the .json backup and opens Gmail compose to attach it (or opens the mobile share sheet for the Gmail app).',
    restoreBackup: 'Restore from JSON File',
    lastBackupLabel: 'Last backup:',
    neverBackedUp: 'No backup created yet',
    backupSuccess: 'Backup saved successfully',
    restoreConfirmTitle: 'Restore Backup',
    restoreConfirmDesc: 'This will replace all current customers and transactions with the backup file. Continue?',
    restoreSuccess: 'Data restored successfully',
    restoreInvalidError: 'Selected file is invalid or corrupted',
    backupReminderBannerTitle: '12-Hour Backup Reminder',
    backupReminderBannerDesc: 'More than 12 hours have passed since your last backup.',
    backupNowBtn: 'Backup Now',
    snoozeReminderBtn: 'Later',
    settingsSaved: 'Settings saved',

    waStatementTitle: 'Account Statement',
    waCustomerLabel: 'Customer',
    waStatusLabel: 'Status',
    waBalanceLabel: 'Remaining Balance',
    waRecentOps: 'Recent Transactions',
    waDateLabel: 'Date',

    justNow: 'Just now',
    minutesAgo: '{n}m ago',
    hoursAgo: '{n}h ago',
    daysAgo: '{n}d ago',
    monthsAgo: '{n}mo ago',
  },
  fr: {
    appName: 'Grand Livre des Comptes',
    designedBy: 'Conçu par Firas Al-Mahmoud',
    settings: 'Paramètres',
    back: 'Retour',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',

    netBalance: 'Solde Net Restant',
    netInYourFavor: 'Net en votre faveur',
    netYouOwe: 'Net que vous devez',
    netSettled: 'Comptes équilibrés',
    totalGiven: 'Total Donné',
    totalTaken: 'Total Reçu',

    searchPlaceholder: 'Rechercher un client ou numéro...',
    filtersTitle: 'Filtres et Tri',
    resetFilters: 'Réinitialiser',
    accountTypeLabel: 'Type de Compte',
    filterAll: 'Tous',
    filterOwesMe: 'Vous doit',
    filterIOwe: 'Vous devez',
    timeRangeLabel: 'Période et Tri',
    sortNewest: 'Plus récent',
    sortOldest: 'Plus ancien',
    last24Hours: 'Dernières 24h',
    lastWeek: 'Dernière semaine',
    lastMonth: 'Dernier mois',
    overdueLabel: 'Paiements en retard',
    overdueHint: 'Clients débiteurs inactifs depuis plus de 7 jours',
    activeFiltersCount: 'actifs',

    customersTitle: 'Clients',
    customersCount: 'clients',
    addCustomerFab: '+ Ajouter Client',
    noCustomersTitle: 'Votre grand livre est vide',
    noCustomersDesc: 'Ajoutez votre premier client pour suivre les dettes et paiements.',
    noResultsTitle: 'Aucun résultat',
    noResultsDesc: 'Essayez de modifier votre recherche ou de réinitialiser les filtres.',
    givenTag: 'Donné',
    takenTag: 'Reçu',
    settledTag: 'Soldé',
    owesYouShort: 'Vous doit',
    youOweShort: 'Vous devez',
    noTransactionsYet: 'Aucune opération',
    overdueBadge: 'En retard',

    addCustomerTitle: 'Nouveau Client',
    editCustomerTitle: 'Modifier Client',
    customerNameLabel: 'Nom du Client',
    customerNamePlaceholder: 'Ex: Ahmad Mohammad',
    phoneLabel: 'Numéro de Téléphone',
    phonePlaceholder: 'Ex: 5312345678',
    pickFromContacts: 'Choisir dans les Contacts',
    importVcfContact: 'Importer Contact (.vcf)',
    contactsUnsupportedHint: 'Le sélecteur de contacts direct n’est pas pris en charge ici ; importez un fichier .vcf ou saisissez le numéro.',
    contactNoPhoneError: 'Aucun numéro trouvé dans le contact sélectionné',
    countryCodeHint: 'Indicatif par défaut appliqué :',
    nameRequiredError: 'Veuillez saisir le nom du client',
    customerAdded: 'Client ajouté avec succès',
    customerUpdated: 'Client mis à jour',
    customerDeleted: 'Client et opérations supprimés',

    currentBalance: 'Solde Actuel',
    owesYouStatus: 'Vous doit',
    youOweStatus: 'Vous devez',
    settledStatus: 'Soldé',
    sendWhatsAppStatement: 'Envoyer relevé via WhatsApp',
    sendWhatsAppReminder: 'Envoyer un rappel',
    copyStatement: 'Copier le relevé',
    statementCopied: 'Relevé copié',
    noPhoneWarning: 'Ajoutez un numéro pour envoyer directement sur WhatsApp',
    giveButton: 'Donné (Vous doit)',
    takeButton: 'Reçu (Vous devez)',
    transactionsHistory: 'Historique des Opérations',
    longPressHint: 'Appui long sur une opération pour la supprimer',
    emptyTransactions: 'Aucune opération enregistrée pour ce client',
    deleteTransactionTitle: 'Supprimer l’opération',
    deleteTransactionConfirm: 'Supprimer cette opération ? Le solde sera mis à jour immédiatement.',
    deleteCustomerTitle: 'Supprimer le client',
    deleteCustomerConfirm: 'Supprimer définitivement ce client et toutes ses opérations ?',
    transactionDeleted: 'Opération supprimée',

    calcTitleGiven: 'Opération : Donné (Vous doit)',
    calcTitleTaken: 'Opération : Reçu (Vous devez)',
    noteLabel: 'Notes',
    notePlaceholder: 'Note ou tapez "حذف" / "supprimer" pour annuler la dernière...',
    dateTimeLabel: 'Date et Heure',
    smartUndoDetected: 'Annulation intelligente : Supprimer la dernière opération',
    smartUndoButton: 'Supprimer la dernière opération',
    smartUndoDone: 'Dernière opération supprimée',
    smartUndoEmpty: 'Aucune opération précédente à supprimer',
    confirmTransaction: 'Confirmer et Ajouter',
    invalidAmountError: 'Veuillez saisir un montant valide supérieur à zéro',
    transactionAdded: 'Opération ajoutée et solde mis à jour',
    expressionPlaceholder: '0',

    settingsTitle: 'Paramètres',
    storeLogoSection: 'Logo du Magasin',
    uploadLogo: 'Importer un Logo',
    changeLogo: 'Changer le Logo',
    removeLogo: 'Supprimer',
    languageSection: 'Langue',
    storeNameSection: 'Nom du Magasin',
    storeNamePlaceholder: 'Ex: Magasin Al-Baraka',
    countryCodeSection: 'Indicatif Téléphonique par Défaut',
    countryCodeCustom: 'Indicatif personnalisé (ex: +33)',
    reminderTemplateSection: 'Modèle de Message de Rappel',
    reminderTemplateHelp: 'Utilisez les variables pour insérer le nom et le solde :',
    insertVarName: 'Insérer {name}',
    insertVarBalance: 'Insérer {balance}',
    templatePreview: 'Aperçu :',
    appearanceSection: 'Apparence',
    darkModeLabel: 'Mode Sombre',
    darkModeDesc: 'Basculer entre le thème clair et sombre',
    backupSection: 'Sauvegarde et Restauration',
    exportBackup: 'Télécharger Sauvegarde (JSON)',
    shareBackup: 'Partager la Sauvegarde',
    sendBackupToGmail: 'Envoyer la Sauvegarde vers Gmail',
    gmailRecipientLabel: 'Adresse Gmail destinataire (optionnel)',
    gmailRecipientPlaceholder: 'exemple@gmail.com',
    gmailBackupReadyHint: 'Télécharge le fichier .json et ouvre Gmail pour le joindre (ou utilise le partage mobile vers l’application Gmail).',
    restoreBackup: 'Restaurer depuis JSON',
    lastBackupLabel: 'Dernière sauvegarde :',
    neverBackedUp: 'Aucune sauvegarde effectuée',
    backupSuccess: 'Sauvegarde créée avec succès',
    restoreConfirmTitle: 'Restaurer les Données',
    restoreConfirmDesc: 'Les données actuelles seront remplacées par celles du fichier. Continuer ?',
    restoreSuccess: 'Données restaurées avec succès',
    restoreInvalidError: 'Fichier de sauvegarde invalide',
    backupReminderBannerTitle: 'Rappel de Sauvegarde (12h)',
    backupReminderBannerDesc: 'Plus de 12 heures se sont écoulées depuis votre dernière sauvegarde.',
    backupNowBtn: 'Sauvegarder',
    snoozeReminderBtn: 'Plus tard',
    settingsSaved: 'Paramètres enregistrés',

    waStatementTitle: 'Relevé de Compte',
    waCustomerLabel: 'Client',
    waStatusLabel: 'Statut',
    waBalanceLabel: 'Solde Restant',
    waRecentOps: 'Dernières Opérations',
    waDateLabel: 'Date',

    justNow: 'À l’instant',
    minutesAgo: 'Il y a {n} min',
    hoursAgo: 'Il y a {n} h',
    daysAgo: 'Il y a {n} j',
    monthsAgo: 'Il y a {n} mois',
  },
  tr: {
    appName: 'Hesap Defteri',
    designedBy: 'Tasarım: Firas Al-Mahmoud',
    settings: 'Ayarlar',
    back: 'Geri',
    save: 'Kaydet',
    cancel: 'İptal',
    confirm: 'Onayla',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',

    netBalance: 'Net Kalan Bakiye',
    netInYourFavor: 'Net alacağınız',
    netYouOwe: 'Net borcunuz',
    netSettled: 'Hesaplar dengede',
    totalGiven: 'Toplam Verilen',
    totalTaken: 'Toplam Alınan',

    searchPlaceholder: 'Müşteri adı veya telefon ara...',
    filtersTitle: 'Filtreler ve Sıralama',
    resetFilters: 'Sıfırla',
    accountTypeLabel: 'Hesap Türü',
    filterAll: 'Tümü',
    filterOwesMe: 'Alacaklısın',
    filterIOwe: 'Borçlusun',
    timeRangeLabel: 'Zaman ve Sıralama',
    sortNewest: 'En Yeni',
    sortOldest: 'En Eski',
    last24Hours: 'Son 24 Saat',
    lastWeek: 'Son 1 Hafta',
    lastMonth: 'Son 1 Ay',
    overdueLabel: 'Ödemesi Gecikenler',
    overdueHint: '7 günden uzun süredir borcu bulunan müşteriler',
    activeFiltersCount: 'aktif',

    customersTitle: 'Müşteriler',
    customersCount: 'müşteri',
    addCustomerFab: '+ Müşteri Ekle',
    noCustomersTitle: 'Defteriniz henüz boş',
    noCustomersDesc: 'Borç ve ödemeleri kolayca takip etmek için ilk müşterinizi ekleyin.',
    noResultsTitle: 'Eşleşen müşteri yok',
    noResultsDesc: 'Arama kelimenizi değiştirmeyi veya filtreleri sıfırlamayı deneyin.',
    givenTag: 'Verilen',
    takenTag: 'Alınan',
    settledTag: 'Sıfırlandı',
    owesYouShort: 'Alacaklısın',
    youOweShort: 'Borçlusun',
    noTransactionsYet: 'Henüz işlem yok',
    overdueBadge: 'Gecikmiş',

    addCustomerTitle: 'Yeni Müşteri Ekle',
    editCustomerTitle: 'Müşteriyi Düzenle',
    customerNameLabel: 'Müşteri Adı',
    customerNamePlaceholder: 'Örn: Ahmet Yılmaz',
    phoneLabel: 'Telefon Numarası',
    phonePlaceholder: 'Örn: 5312345678',
    pickFromContacts: 'Rehberden Seç',
    importVcfContact: 'Kişi İçe Aktar (.vcf)',
    contactsUnsupportedHint: 'Bu tarayıcı doğrudan rehber erişimini desteklemiyor; .vcf dosyası yükleyebilir veya numarayı yazabilirsiniz.',
    contactNoPhoneError: 'Seçilen kişide telefon numarası bulunamadı',
    countryCodeHint: 'Varsayılan ülke kodu:',
    nameRequiredError: 'Lütfen müşteri adını girin',
    customerAdded: 'Müşteri başarıyla eklendi',
    customerUpdated: 'Müşteri bilgileri güncellendi',
    customerDeleted: 'Müşteri ve işlemleri silindi',

    currentBalance: 'Güncel Bakiye',
    owesYouStatus: 'Alacaklısın',
    youOweStatus: 'Borçlusun',
    settledStatus: 'Kapalı',
    sendWhatsAppStatement: 'WhatsApp ile Ekstre Gönder',
    sendWhatsAppReminder: 'Ödeme Hatırlatması Gönder',
    copyStatement: 'Ekstreyi Kopyala',
    statementCopied: 'Ekstre panoya kopyalandı',
    noPhoneWarning: 'Doğrudan WhatsApp için telefon numarası ekleyin',
    giveButton: 'Verdim (Alacaklısın)',
    takeButton: 'Aldım (Borçlusun)',
    transactionsHistory: 'İşlem Geçmişi',
    longPressHint: 'Silmek için herhangi bir işleme uzun basın',
    emptyTransactions: 'Bu müşteri için henüz kayıtlı işlem yok',
    deleteTransactionTitle: 'İşlemi Sil',
    deleteTransactionConfirm: 'Bu işlemi silmek istiyor musunuz? Bakiye anında güncellenecektir.',
    deleteCustomerTitle: 'Müşteriyi Sil',
    deleteCustomerConfirm: 'Bu müşteri ve tüm işlemleri kalıcı olarak silinsin mi?',
    transactionDeleted: 'İşlem silindi ve bakiye güncellendi',

    calcTitleGiven: 'Kayıt: Verdim (Alacaklısın)',
    calcTitleTaken: 'Kayıt: Aldım (Borçlusun)',
    noteLabel: 'Notlar',
    notePlaceholder: 'Not yazın veya son işlemi silmek için "حذف" / "sil" yazın...',
    dateTimeLabel: 'Tarih ve Saat',
    smartUndoDetected: 'Akıllı Geri Alma: Son işlemi hemen sil',
    smartUndoButton: 'Son İşlemi Şimdi Sil',
    smartUndoDone: 'Son işlem geri alındı ve silindi',
    smartUndoEmpty: 'Bu müşteri için silinecek önceki işlem yok',
    confirmTransaction: 'Onayla ve İşlemi Ekle',
    invalidAmountError: 'Lütfen sıfırdan büyük geçerli bir tutar girin',
    transactionAdded: 'İşlem kaydedildi ve bakiye güncellendi',
    expressionPlaceholder: '0',

    settingsTitle: 'Uygulama Ayarları',
    storeLogoSection: 'Mağaza Logosu',
    uploadLogo: 'Logo Yükle',
    changeLogo: 'Logoyu Değiştir',
    removeLogo: 'Logoyu Kaldır',
    languageSection: 'Uygulama Dili',
    storeNameSection: 'Mağaza Adı',
    storeNamePlaceholder: 'Örn: Bereket Ticaret',
    countryCodeSection: 'Varsayılan Ülke Kodu',
    countryCodeCustom: 'Özel kod (örn: +90)',
    reminderTemplateSection: 'Gecikme Hatırlatma Şablonu',
    reminderTemplateHelp: 'Müşteri adı ve bakiye için otomatik değişkenleri kullanın:',
    insertVarName: '{name} ekle',
    insertVarBalance: '{balance} ekle',
    templatePreview: 'Mesaj Önizleme:',
    appearanceSection: 'Görünüm',
    darkModeLabel: 'Karanlık Mod (Dark Mode)',
    darkModeDesc: 'Açık ve koyu tema arasında geçiş yapın',
    backupSection: 'Yedekleme ve Geri Yükleme',
    exportBackup: 'Yedeği İndir (JSON)',
    shareBackup: 'Yedek Dosyasını Paylaş',
    sendBackupToGmail: 'Yedeği Gmail’e Gönder',
    gmailRecipientLabel: 'Alıcı Gmail Adresi (isteğe bağlı)',
    gmailRecipientPlaceholder: 'ornek@gmail.com',
    gmailBackupReadyHint: 'Yedek .json dosyasını indirir ve eklemek için Gmail oluşturma ekranını (veya mobilde Gmail uygulamasını) açar.',
    restoreBackup: 'JSON Dosyasından Geri Yükle',
    lastBackupLabel: 'Son yedekleme:',
    neverBackedUp: 'Henüz yedek alınmadı',
    backupSuccess: 'Yedekleme başarıyla kaydedildi',
    restoreConfirmTitle: 'Yedeği Geri Yükle',
    restoreConfirmDesc: 'Mevcut tüm veriler yedek dosyasındaki verilerle değiştirilecek. Devam edilsin mi?',
    restoreSuccess: 'Veriler başarıyla geri yüklendi',
    restoreInvalidError: 'Seçilen dosya geçersiz veya bozuk',
    backupReminderBannerTitle: '12 Saatlik Yedekleme Hatırlatıcısı',
    backupReminderBannerDesc: 'Son yedeklemenizin üzerinden 12 saatten fazla zaman geçti.',
    backupNowBtn: 'Şimdi Yedekle',
    snoozeReminderBtn: 'Sonra',
    settingsSaved: 'Ayarlar kaydedildi',

    waStatementTitle: 'Hesap Ekstresi',
    waCustomerLabel: 'Müşteri',
    waStatusLabel: 'Hesap Durumu',
    waBalanceLabel: 'Kalan Bakiye',
    waRecentOps: 'Son İşlemler',
    waDateLabel: 'Tarih',

    justNow: 'Şimdi',
    minutesAgo: '{n} dk önce',
    hoursAgo: '{n} sa önce',
    daysAgo: '{n} gün önce',
    monthsAgo: '{n} ay önce',
  },
};

export function isUndoKeyword(note: string): boolean {
  const normalized = note.trim().toLowerCase();
  return (
    normalized === 'حذف' ||
    normalized === 'delete' ||
    normalized === 'supprimer' ||
    normalized === 'sil'
  );
}
