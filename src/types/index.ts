export type ServiceId =
  | 'antenatal'
  | 'labour-birth'
  | 'postnatal'
  | 'phototherapy'
  | 'education'
  | 'well-baby';

export type LocationId = 'new-born-life' | 'genesis' | 'oxford';

export interface Service {
  id: ServiceId;
  name: string;
  summary: string;
  description: string;
  duration: string;
  /** Used for compact badges and summaries. */
  durationMinutes: number;
  idealFor: string;
  includes: string[];
  goodToKnow: string;
}

export interface PracticeLocation {
  id: LocationId;
  name: string;
  shortName: string;
  setting: string;
  context: string;
}

export interface Photo {
  src: string;
  alt: string;
}

export interface NextStep {
  id: 'bring' | 'prepare' | 'contact';
  title: string;
  items: string[];
}

export interface TrustPillar {
  id: 'experience' | 'locations' | 'privacy';
  title: string;
  detail: string;
}

export interface Practice {
  name: string;
  tagline: string;
  midwife: {
    name: string;
    role: string;
    bio: string[];
    quote: string;
    highlights: string[];
  };
  photos: { hero: Photo; midwife: Photo; family: Photo; room: Photo };
  trustPillars: TrustPillar[];
  contact: { phone: string; email: string; hours: string };
  urgentNote: string;
  consentText: string;
  nextSteps: NextStep[];
}

export interface Catalog {
  practice: Practice;
  services: Service[];
  locations: PracticeLocation[];
}

export type DayPeriod = 'morning' | 'afternoon';

export interface TimeSlot {
  /** 24-hour HH:mm */
  time: string;
  period: DayPeriod;
}

export interface AvailableDay {
  /** YYYY-MM-DD */
  date: string;
  slots: TimeSlot[];
}

export type BookingStatus = 'new' | 'confirmed' | 'completed';

export interface ContactDetails {
  fullName: string;
  phone: string;
  email: string;
  note: string;
}

export interface Booking extends ContactDetails {
  ref: string;
  serviceId: ServiceId;
  locationId: LocationId;
  date: string;
  time: string;
  status: BookingStatus;
  consent: boolean;
  createdAt: string;
}

export type NewBooking = Omit<Booking, 'ref' | 'status' | 'createdAt'>;

export interface Feedback {
  id: string;
  rating: number;
  wentWell: string;
  canImprove: string;
  followUpConsent: boolean;
  bookingRef?: string;
  createdAt: string;
}

export type NewFeedback = Omit<Feedback, 'id' | 'createdAt'>;

export interface BookingDraft {
  serviceId?: ServiceId;
  locationId?: LocationId;
  date?: string;
  time?: string;
  details: ContactDetails & { consent: boolean };
}

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}
