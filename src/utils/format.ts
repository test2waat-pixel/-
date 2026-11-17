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
