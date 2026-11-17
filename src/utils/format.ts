import { Capacitor } from '@capacitor/core';
import { CapacitorContacts, ContactProperty } from '@capgo/capacitor-contacts';
import { Language, Transaction } from '../types';
import { TranslationStrings } from '../i18n';

export function formatCurrency(amount: number, lang: Language): string {
  const absVal = Math.abs(amount);
  const locale = lang === 'ar' ? 'en-US' : lang === 'tr' ? 'tr-TR' : lang === 'fr' ? 'fr-FR' : 'en-US';
  const hasDecimals = Math.round(absVal * 100) % 100 !== 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(absVal);
}

export function formatPhoneWithCountryCode(rawPhone: string, defaultCode: string): string {
  const trimmed = rawPhone.trim();
  if (!trimmed) return '';

  let cleaned = trimmed.replace(/[^\d+]/g, '');
  if (!cleaned) return '';

  const normalizedDefault = defaultCode.startsWith('+')
    ? defaultCode
    : `+${defaultCode.replace(/\D/g, '')}`;

  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }

  if (!cleaned.startsWith('+')) {
    const withoutLeadingZero = cleaned.replace(/^0+/, '');
    cleaned = `${normalizedDefault}${withoutLeadingZero}`;
  }

  const digits = cleaned.slice(1);
  if (digits.length <= 4) return `+${digits}`;

  const ccLen = digits.startsWith('1') ? 1 : digits.startsWith('90') || digits.startsWith('20') || digits.startsWith('33') || digits.startsWith('49') || digits.startsWith('44') ? 2 : 3;
  const cc = digits.slice(0, ccLen);
  const rest = digits.slice(ccLen);
  const groups = rest.match(/.{1,3}/g)?.join(' ') ?? rest;
  return `+${cc} ${groups}`.trim();
}

export function sanitizePhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

export function formatRelativeTime(timestamp: number, t: TranslationStrings): string {
  if (!timestamp) return t.noTransactionsYet;
  const diffMs = Math.max(0, Date.now() - timestamp);
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return t.justNow;
  if (diffMins < 60) return t.minutesAgo.replace('{n}', String(diffMins));
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t.hoursAgo.replace('{n}', String(diffHours));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return t.daysAgo.replace('{n}', String(diffDays));
  const diffMonths = Math.floor(diffDays / 30);
  return t.monthsAgo.replace('{n}', String(diffMonths));
}

export function formatDateTimeDisplay(isoOrMs: string | number, lang: Language): string {
  const date = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  if (Number.isNaN(date.getTime())) return '';
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'tr' ? 'tr-TR' : lang === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function toLocalDateTimeInputValue(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function buildStatementMessage(params: {
  storeName: string;
  customerName: string;
  balance: number;
  transactions: Transaction[];
  lang: Language;
  t: TranslationStrings;
}): string {
  const { storeName, customerName, balance, transactions, lang, t } = params;
  const statusText =
    balance > 0
      ? t.owesYouStatus
      : balance < 0
      ? t.youOweStatus
      : t.settledStatus;

  const lines: string[] = [];
  if (storeName.trim()) {
    lines.push(`*${storeName.trim()}*`);
  }
  lines.push(`*${t.waStatementTitle}*`);
  lines.push(`━━━━━━━━━━━━━━`);
  lines.push(`${t.waCustomerLabel}: *${customerName}*`);
  lines.push(`${t.waStatusLabel}: ${statusText}`);
  lines.push(`${t.waBalanceLabel}: *${formatCurrency(balance, lang)}*`);

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  if (recent.length > 0) {
    lines.push('');
    lines.push(`*${t.waRecentOps}:*`);
    for (const tx of recent) {
      const sign = tx.type === 'given' ? '🔴 +' : '🟢 -';
      const label = tx.type === 'given' ? t.givenTag : t.takenTag;
      const dateStr = formatDateTimeDisplay(tx.date, lang);
      const notePart = tx.note ? ` (${tx.note})` : '';
      lines.push(`${sign}${formatCurrency(tx.amount, lang)} [${label}] · ${dateStr}${notePart}`);
    }
  }

  return lines.join('\n');
}

export function buildReminderMessage(params: {
  template: string;
  storeName: string;
  customerName: string;
  balance: number;
  lang: Language;
}): string {
  const { template, storeName, customerName, balance, lang } = params;
  const formattedBalance = formatCurrency(Math.abs(balance), lang);
  const body = template
    .replace(/\{name\}/g, customerName)
    .replace(/\{balance\}/g, formattedBalance);
  return storeName.trim() ? `*${storeName.trim()}*\n${body}` : body;
}

export function buildWhatsAppHref(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneForWhatsApp(phone);
  const encoded = encodeURIComponent(message);
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}

export function buildGmailComposeHref(params: {
  to: string;
  subject: string;
  body: string;
}): string {
  const query = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: params.to.trim(),
    su: params.subject,
    body: params.body,
  });
  return `https://mail.google.com/mail/?${query.toString()}`;
}

export interface PickedContact {
  name?: string;
  phone: string;
}

export function isDeviceContactPickerSupported(): boolean {
  // DEBUG (temporary): shows whether the app runs as a native Android app
  try { window.alert('DEBUG native=' + Capacitor.isNativePlatform() + ' platform=' + Capacitor.getPlatform()); } catch { /* ignore */ }
  if (Capacitor.isNativePlatform()) return true;
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    contacts?: { select?: (props: string[], opts?: { multiple?: boolean }) => Promise<Array<{ name?: string[]; tel?: string[] }>> };
  };
  return Boolean(nav.contacts && typeof nav.contacts.select === 'function');
}

export async function pickContactFromDevice(): Promise<PickedContact | null> {
  if (Capacitor.isNativePlatform()) {
    // Use Android's system contact picker.
    try {
      const plugin = CapacitorContacts as any;
      const result = await plugin.pickContacts({
        property: ContactProperty.PhoneNumber,
        properties: [ContactProperty.PhoneNumber],
        multiple: false,
      });
      const first = result?.contacts?.[0];
      const rawPhone = first?.phoneNumbers?.[0]?.value ?? first?.phones?.[0]?.value ?? '';
      const rawName = first?.displayName ?? first?.name?.display ?? '';
      if (!rawPhone && !rawName) return null;
      return { name: rawName || undefined, phone: rawPhone };
    } catch (err) {
      // DEBUG (temporary): show the real error to find out why the picker fails
      try { window.alert('DEBUG error: ' + (err instanceof Error ? err.message : JSON.stringify(err))); } catch { /* ignore */ }
      throw err;
    }
  }

  const nav = navigator as Navigator & {
    contacts?: { select?: (props: string[], opts?: { multiple?: boolean }) => Promise<Array<{ name?: string[]; tel?: string[] }>> };
  };
  if (!nav.contacts || typeof nav.contacts.select !== 'function') {
    throw new Error('UNSUPPORTED');
  }
  const results = await nav.contacts.select(['name', 'tel'], { multiple: false });
  if (!results || results.length === 0) return null;
  const first = results[0];
  const rawPhone = first.tel?.[0] ?? '';
  const rawName = first.name?.[0] ?? '';
  if (!rawPhone && !rawName) return null;
  return {
    name: rawName || undefined,
    phone: rawPhone,
  };
}

export function parseVCardContact(vcfText: string): PickedContact | null {
  const lines = vcfText.split(/\r?\n/);
  let name = '';
  let phone = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!name && /^FN[;:]/i.test(trimmed)) {
      const idx = trimmed.indexOf(':');
      if (idx !== -1) {
        name = trimmed.slice(idx + 1).trim();
      }
    } else if (!phone && /^TEL[;:]/i.test(trimmed)) {
      const idx = trimmed.indexOf(':');
      if (idx !== -1) {
        phone = trimmed.slice(idx + 1).trim();
      }
    }
    if (name && phone) break;
  }

  if (!phone && !name) return null;
  return { name: name || undefined, phone };
}

export function compressLogoImage(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.86));
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export function evaluateMathExpression(expr: string): number | null {
  const sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');

  if (!sanitized || !/^[0-9+\-*/.()]+$/.test(sanitized)) {
    return null;
  }

  const cleaned = sanitized.replace(/[+\-*/.]+$/, '');
  if (!cleaned) return null;

  try {
    let pos = 0;
    const parseExpression = (): number => {
      let value = parseTerm();
      while (pos < cleaned.length && (cleaned[pos] === '+' || cleaned[pos] === '-')) {
        const op = cleaned[pos++];
        const right = parseTerm();
        value = op === '+' ? value + right : value - right;
      }
      return value;
    };
    const parseTerm = (): number => {
      let value = parseFactor();
      while (pos < cleaned.length && (cleaned[pos] === '*' || cleaned[pos] === '/')) {
        const op = cleaned[pos++];
        const right = parseFactor();
        if (op === '/') {
          if (right === 0) return NaN;
          value /= right;
        } else {
          value *= right;
        }
      }
      return value;
    };
    const parseFactor = (): number => {
      if (cleaned[pos] === '+') {
        pos++;
        return parseFactor();
      }
      if (cleaned[pos] === '-') {
        pos++;
        return -parseFactor();
      }
      const start = pos;
      while (pos < cleaned.length && /[0-9.]/.test(cleaned[pos])) {
        pos++;
      }
      if (start === pos) return NaN;
      return parseFloat(cleaned.slice(start, pos));
    };

    const result = parseExpression();
    if (pos !== cleaned.length || !Number.isFinite(result)) {
      return null;
    }
    return Math.round(result * 100) / 100;
  } catch {
    return null;
  }
}
