import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, BookUser, FileUp } from 'lucide-react';
import { Customer } from '../types';
import { TranslationStrings } from '../i18n';
import {
  formatPhoneWithCountryCode,
  isDeviceContactPickerSupported,
  parseVCardContact,
  pickContactFromDevice,
} from '../utils/format';

interface CustomerModalProps {
  open: boolean;
  editingCustomer: Customer | null;
  defaultCountryCode: string;
  t: TranslationStrings;
  onClose: () => void;
  onSave: (data: { name: string; phone: string }) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  editingCustomer,
  defaultCountryCode,
  t,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [contactHint, setContactHint] = useState('');
  const vcfInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setName(editingCustomer?.name ?? '');
      setPhone(editingCustomer?.phone ?? '');
      setError('');
      setContactHint('');
    }
  }, [open, editingCustomer]);

  if (!open) return null;

  const formattedPreview = phone.trim()
    ? formatPhoneWithCountryCode(phone, defaultCountryCode)
    : '';

  const applyPickedContact = (picked: { name?: string; phone: string }) => {
    if (!picked.phone.trim()) {
      setContactHint(t.contactNoPhoneError);
      return;
    }
    setPhone(formatPhoneWithCountryCode(picked.phone, defaultCountryCode));
    if (!name.trim() && picked.name) {
      setName(picked.name);
    }
    setContactHint('');
    setError('');
  };

  const handlePickFromDevice = async () => {
    setContactHint('');
    if (!isDeviceContactPickerSupported()) {
      setContactHint(t.contactsUnsupportedHint);
      vcfInputRef.current?.click();
      return;
    }

    try {
      const picked = await pickContactFromDevice();
      if (!picked) return;
      applyPickedContact(picked);
    } catch {
      setContactHint(t.contactsUnsupportedHint);
      vcfInputRef.current?.click();
    }
  };

  const handleVcfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseVCardContact(String(reader.result ?? ''));
      if (!parsed || !parsed.phone) {
        setContactHint(t.contactNoPhoneError);
        return;
      }
      applyPickedContact(parsed);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t.nameRequiredError);
      return;
    }
    const formattedPhone = phone.trim()
      ? formatPhoneWithCountryCode(phone, defaultCountryCode)
      : '';
    onSave({ name: trimmedName, phone: formattedPhone });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-2" />

        <div className="flex items-center justify-between gap-3">
          <h2
            id="customer-modal-title"
            className="text-lg font-extrabold text-slate-900 dark:text-white"
          >
            {editingCustomer ? t.editCustomerTitle : t.addCustomerTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="customer-name-input"
              className="text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {t.customerNameLabel}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                id="customer-name-input"
                type="text"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.customerNamePlaceholder}
                className="w-full h-12 ps-10 pe-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>
            {error && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}
          </div>

          {/* Phone Input + Device Contact Picker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="customer-phone-input"
                className="text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {t.phoneLabel}
              </label>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400" dir="ltr">
                {defaultCountryCode}
              </span>
            </div>

            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                id="customer-phone-input"
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => {
                  if (phone.trim()) {
                    setPhone(formatPhoneWithCountryCode(phone, defaultCountryCode));
                  }
                }}
                placeholder={t.phonePlaceholder}
                className="w-full h-12 ps-10 pe-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-num text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>

            {/* Pick from Phone Contacts / Import vCard */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePickFromDevice}
                className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <BookUser className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{t.pickFromContacts}</span>
              </button>

              <input
                ref={vcfInputRef}
                type="file"
                accept=".vcf,text/vcard,text/x-vcard"
                onChange={handleVcfChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => vcfInputRef.current?.click()}
                title={t.importVcfContact}
                className="min-h-[44px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileUp className="w-4 h-4 shrink-0" />
                <span>.vcf</span>
              </button>
            </div>

            {contactHint && (
              <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300 leading-relaxed">
                {contactHint}
              </p>
            )}

            {formattedPreview && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span>{t.countryCodeHint}</span>
                <span className="font-num font-semibold text-slate-700 dark:text-slate-200" dir="ltr">
                  {formattedPreview}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-[2] min-h-[48px] rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white text-sm font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 active:scale-[0.98] transition-all cursor-pointer"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
