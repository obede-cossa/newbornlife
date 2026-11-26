import type { BookingDraft } from '../types';

export type DetailsErrors = Partial<Record<keyof BookingDraft['details'], string>>;

export const NOTE_LIMIT = 300;

export function validateDetails(details: BookingDraft['details']): DetailsErrors {
  const errors: DetailsErrors = {};
  const phone = details.phone.trim();
  const digits = phone.replace(/\D/g, '').length;

  if (details.fullName.trim().length < 2) errors.fullName = 'Please enter your full name.';
  if (!/^\+?[\d\s()-]+$/.test(phone) || digits < 7 || digits > 15) {
    errors.phone = 'Please enter a phone or WhatsApp number, for example +27 82 123 4567.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!details.consent) errors.consent = 'Please tick the box so the practice may contact you.';
  return errors;
}
