/**
 * Simulated API layer. Every method is async and returns plain data, so each one
 * can be swapped for a `fetch` call to a real backend without touching the UI.
 */
import { toISODate } from '../lib/format';
import type {
  AvailableDay,
  Booking,
  BookingStatus,
  Catalog,
  Feedback,
  LocationId,
  NewBooking,
  NewFeedback,
  TimeSlot,
} from '../types';
import { locations, practice, seedBookings, seedFeedback, services } from './seedData';
import { readStored, removeStored, writeStored } from './storage';

export const STORAGE_KEYS = {
  bookings: 'nbl.bookings.v1',
  feedback: 'nbl.feedback.v1',
} as const;

const BOOKING_WINDOW_DAYS = 35;

const SLOT_TEMPLATE: TimeSlot[] = [
  { time: '08:30', period: 'morning' },
  { time: '09:30', period: 'morning' },
  { time: '10:30', period: 'morning' },
  { time: '11:30', period: 'morning' },
  { time: '13:30', period: 'afternoon' },
  { time: '14:30', period: 'afternoon' },
  { time: '15:30', period: 'afternoon' },
];

export class ApiError extends Error {}

/** Resolves after 300–600ms, like a real network round trip. */
function respond<T>(produce: () => T): Promise<T> {
  const latency = 300 + Math.random() * 300;
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(structuredClone(produce()));
      } catch (error) {
        reject(error);
      }
    }, latency);
  });
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const isBookingList = (v: unknown): v is Booking[] =>
  Array.isArray(v) &&
  v.every((b) => isRecord(b) && typeof b.ref === 'string' && typeof b.date === 'string' && typeof b.fullName === 'string');

const isFeedbackList = (v: unknown): v is Feedback[] =>
  Array.isArray(v) && v.every((f) => isRecord(f) && typeof f.id === 'string' && typeof f.rating === 'number');

const loadBookings = () => readStored(STORAGE_KEYS.bookings, isBookingList, seedBookings);
const loadFeedback = () => readStored(STORAGE_KEYS.feedback, isFeedbackList, seedFeedback);

function nextId(prefix: string, ids: string[]): string {
  const highest = ids.reduce((max, id) => Math.max(max, Number(id.split('-')[1]) || 0), 0);
  return `${prefix}-${String(highest + 1).padStart(3, '0')}`;
}

/** Small deterministic hash so sample availability stays stable between visits. */
function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value = Math.imul(value ^ input.charCodeAt(i), 16777619);
  }
  return value >>> 0;
}

/** Sample availability for the coming weeks: closed Sundays, requested times removed. */
function buildAvailability(locationId: LocationId, bookings: Booking[]): AvailableDay[] {
  const taken = new Set(
    bookings.filter((b) => b.locationId === locationId).map((b) => `${b.date} ${b.time}`),
  );
  const today = new Date();
  const days: AvailableDay[] = [];

  for (let offset = 1; offset <= BOOKING_WINDOW_DAYS; offset += 1) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const date = toISODate(day);
    if (day.getDay() === 0 || hash(`${locationId}|${date}`) % 5 === 0) continue;
    const slots = SLOT_TEMPLATE.filter(
      (slot) => hash(`${date}|${slot.time}|${locationId}`) % 3 !== 0 && !taken.has(`${date} ${slot.time}`),
    );
    if (slots.length > 0) days.push({ date, slots });
  }
  return days;
}

export const mockApi = {
  getCatalog: (): Promise<Catalog> => respond(() => ({ practice, services, locations })),

  getAvailability: (locationId: LocationId): Promise<AvailableDay[]> =>
    respond(() => buildAvailability(locationId, loadBookings())),

  getBookings: (): Promise<Booking[]> => respond(loadBookings),

  createBooking: (input: NewBooking): Promise<Booking> =>
    respond(() => {
      if (!input.consent) throw new ApiError('Consent is required before the practice can contact you.');
      const bookings = loadBookings();
      const stillOpen = buildAvailability(input.locationId, bookings)
        .find((d) => d.date === input.date)
        ?.slots.some((s) => s.time === input.time);
      if (!stillOpen) throw new ApiError('That time is no longer available. Please choose another.');

      const booking: Booking = {
        ...input,
        ref: nextId('NBL', bookings.map((b) => b.ref)),
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      writeStored(STORAGE_KEYS.bookings, [...bookings, booking]);
      return booking;
    }),

  updateBookingStatus: (ref: string, status: BookingStatus): Promise<Booking> =>
    respond(() => {
      const bookings = loadBookings();
      const current = bookings.find((b) => b.ref === ref);
      if (!current) throw new ApiError(`Booking ${ref} was not found.`);
      const updated: Booking = { ...current, status };
      writeStored(STORAGE_KEYS.bookings, bookings.map((b) => (b.ref === ref ? updated : b)));
      return updated;
    }),

  getFeedback: (): Promise<Feedback[]> => respond(loadFeedback),

  submitFeedback: (input: NewFeedback): Promise<Feedback> =>
    respond(() => {
      if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
        throw new ApiError('Please choose a rating from 1 to 5.');
      }
      const all = loadFeedback();
      const feedback: Feedback = {
        ...input,
        id: nextId('FB', all.map((f) => f.id)),
        createdAt: new Date().toISOString(),
      };
      writeStored(STORAGE_KEYS.feedback, [...all, feedback]);
      return feedback;
    }),

  resetDemoData: (): Promise<void> =>
    respond(() => {
      removeStored(STORAGE_KEYS.bookings);
      removeStored(STORAGE_KEYS.feedback);
    }),
};
