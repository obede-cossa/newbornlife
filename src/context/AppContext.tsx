import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { mockApi, STORAGE_KEYS } from '../services/mockApi';
import type {
  Booking,
  BookingDraft,
  BookingStatus,
  Catalog,
  Feedback,
  LocationId,
  NewFeedback,
  ServiceId,
  Toast,
  ToastTone,
} from '../types';

const DRAFT_KEY = 'nbl.draft.v1';
const TOAST_MS = 5000;

const emptyDetails: BookingDraft['details'] = { fullName: '', phone: '', email: '', note: '', consent: false };

/** Only care choices survive a refresh. Personal details stay in memory (privacy by design). */
function restoreDraft(): BookingDraft {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) ?? '{}') as Partial<BookingDraft>;
    const { serviceId, locationId, date, time } = saved;
    return { serviceId, locationId, date, time, details: emptyDetails };
  } catch {
    return { details: emptyDetails };
  }
}

interface AppState {
  catalog?: Catalog;
  bookings: Booking[];
  feedback: Feedback[];
  loading: boolean;
  loadError: boolean;
  reload: () => void;

  draft: BookingDraft;
  selectService: (id: ServiceId) => void;
  selectLocation: (id: LocationId) => void;
  selectDate: (date: string) => void;
  selectTime: (time: string) => void;
  clearSchedule: () => void;
  updateDetails: (patch: Partial<BookingDraft['details']>) => void;
  submitBooking: () => Promise<Booking>;
  resetDraft: () => void;

  setBookingStatus: (ref: string, status: BookingStatus) => Promise<void>;
  submitFeedback: (input: NewFeedback) => Promise<void>;
  resetDemo: () => Promise<void>;

  toasts: Toast[];
  notify: (message: string, tone?: ToastTone) => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [draft, setDraft] = useState<BookingDraft>(restoreDraft);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const dismissToast = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      toastId.current += 1;
      const id = toastId.current;
      setToasts((list) => [...list.slice(-2), { id, tone, message }]);
      window.setTimeout(() => dismissToast(id), TOAST_MS);
    },
    [dismissToast],
  );

  const refreshRecords = useCallback(async () => {
    const [nextBookings, nextFeedback] = await Promise.all([mockApi.getBookings(), mockApi.getFeedback()]);
    setBookings(nextBookings);
    setFeedback(nextFeedback);
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    Promise.all([mockApi.getCatalog().then(setCatalog), refreshRecords()])
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [refreshRecords]);

  useEffect(reload, [reload]);

  // Keeps a second tab (for example the practice view during a demo) in step.
  useEffect(() => {
    const keys: string[] = Object.values(STORAGE_KEYS);
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || keys.includes(event.key)) void refreshRecords();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshRecords]);

  useEffect(() => {
    const { serviceId, locationId, date, time } = draft;
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ serviceId, locationId, date, time }));
    } catch {
      /* storage unavailable */
    }
  }, [draft]);

  const selectService = useCallback((serviceId: ServiceId) => setDraft((d) => ({ ...d, serviceId })), []);
  const selectLocation = useCallback(
    (locationId: LocationId) =>
      setDraft((d) => (d.locationId === locationId ? d : { ...d, locationId, date: undefined, time: undefined })),
    [],
  );
  const selectDate = useCallback(
    (date: string) => setDraft((d) => (d.date === date ? d : { ...d, date, time: undefined })),
    [],
  );
  const selectTime = useCallback((time: string) => setDraft((d) => ({ ...d, time })), []);
  const clearSchedule = useCallback(() => setDraft((d) => ({ ...d, date: undefined, time: undefined })), []);
  const updateDetails = useCallback(
    (patch: Partial<BookingDraft['details']>) => setDraft((d) => ({ ...d, details: { ...d.details, ...patch } })),
    [],
  );
  const resetDraft = useCallback(() => setDraft({ details: emptyDetails }), []);

  /** The caller resets the draft after navigating away, so the wizard never flashes back to step 1. */
  const submitBooking = useCallback(async () => {
    const { serviceId, locationId, date, time, details } = draft;
    if (!serviceId || !locationId || !date || !time) throw new Error('Please complete the earlier steps first.');
    const booking = await mockApi.createBooking({
      serviceId,
      locationId,
      date,
      time,
      fullName: details.fullName.trim(),
      phone: details.phone.trim(),
      email: details.email.trim(),
      note: details.note.trim(),
      consent: details.consent,
    });
    setBookings((list) => [...list.filter((b) => b.ref !== booking.ref), booking]);
    return booking;
  }, [draft]);

  const setBookingStatus = useCallback(async (ref: string, status: BookingStatus) => {
    const updated = await mockApi.updateBookingStatus(ref, status);
    setBookings((list) => list.map((b) => (b.ref === ref ? updated : b)));
  }, []);

  const submitFeedback = useCallback(async (input: NewFeedback) => {
    const saved = await mockApi.submitFeedback(input);
    setFeedback((list) => [...list.filter((f) => f.id !== saved.id), saved]);
  }, []);

  const resetDemo = useCallback(async () => {
    await mockApi.resetDemoData();
    resetDraft();
    await refreshRecords();
  }, [refreshRecords, resetDraft]);

  const value = useMemo<AppState>(
    () => ({
      catalog, bookings, feedback, loading, loadError, reload,
      draft, selectService, selectLocation, selectDate, selectTime, clearSchedule, updateDetails, submitBooking,
      resetDraft, setBookingStatus, submitFeedback, resetDemo,
      toasts, notify, dismissToast,
    }),
    [
      catalog, bookings, feedback, loading, loadError, reload,
      draft, selectService, selectLocation, selectDate, selectTime, clearSchedule, updateDetails, submitBooking,
      resetDraft, setBookingStatus, submitFeedback, resetDemo,
      toasts, notify, dismissToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside <AppProvider>.');
  return context;
}
