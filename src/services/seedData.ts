/** Mock content and seed records. All people, contacts and comments below are sample data. */
import type { Booking, Feedback, Practice, PracticeLocation, Service } from '../types';

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=1200`;

export const practice: Practice = {
  name: 'New Born Life',
  tagline: 'Care through every chapter',
  midwife: {
    name: 'Sister Sally Chuma',
    role: 'Professional nurse and midwife',
    bio: [
      'Sister Sally qualified in 2005 and has experience across private and public hospitals in South Africa, Saudi Arabia and Bahrain.',
      'Her philosophy is calm, patient and culturally respectful, centred on safe natural birth.',
    ],
    quote:
      'Kindly give me the opportunity to walk and support you as you welcome your new family member into the world.',
    highlights: ['Qualified in 2005', 'Private and public hospitals', 'South Africa, Saudi Arabia, Bahrain'],
  },
  photos: {
    hero: {
      src: unsplash('photo-1570657891791-e39a9d185540'),
      alt: 'A smiling newborn resting against a parent',
    },
    midwife: {
      src: unsplash('photo-1666867540898-aaa1993ffabc'),
      alt: 'Illustrative photo of a smiling nurse in a light blue uniform in a bright clinical space',
    },
    family: {
      src: unsplash('photo-1512094476718-4d8f19366c62'),
      alt: 'An expectant parent holding their belly while their partner kisses it',
    },
    room: {
      src: unsplash('photo-1617228154841-0b8a2eb64c03'),
      alt: 'A calm, softly lit room with comfortable chairs and plants',
    },
  },
  trustPillars: [
    { id: 'experience', title: '20+ Years Experience', detail: 'Qualified 2005 • International hospital background' },
    { id: 'locations', title: '3 Convenient Locations', detail: 'New Born Life, Genesis & Oxford Clinics' },
    { id: 'privacy', title: 'Privacy-First Booking', detail: 'No clinical records stored online' },
  ],
  // Placeholder contact details: replace with the practice's real ones.
  contact: {
    phone: '+27 00 000 0000',
    email: 'hello@newbornlife.example',
    hours: 'Monday to Saturday, 08:00 to 17:00',
  },
  urgentNote:
    'Please don’t use this portal for anything urgent. If labour has started, or you are worried about yourself or your baby, contact your midwife or emergency services straight away (in South Africa: 10177, or 112 from a mobile).',
  consentText:
    'I consent to New Born Life contacting me regarding this booking request. No clinical records are stored in this portal.',
  nextSteps: [
    {
      id: 'bring',
      title: 'What to bring',
      items: [
        'Your identity document or passport.',
        'Any antenatal card or notes you already keep. Bring them with you; there is nothing to upload.',
        'Medical aid details, if you have them.',
        'For baby visits: nappies, a blanket and your baby’s health booklet.',
      ],
    },
    {
      id: 'prepare',
      title: 'How to prepare',
      items: [
        'Jot down the questions you would like to ask.',
        'Wear comfortable clothing.',
        'You are welcome to bring a partner or support person.',
        'Plan to arrive about 10 minutes early.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact the practice',
      items: [
        'The practice will contact you to confirm your requested time.',
        'Keep your reference number handy if you need to change your request.',
      ],
    },
  ],
};

export const services: Service[] = [
  {
    id: 'antenatal',
    name: 'Antenatal care',
    summary: 'Consultations, education and preparation for birth.',
    description:
      'Regular, unhurried visits through pregnancy to check how you and your baby are doing, answer your questions and help you prepare for birth.',
    duration: 'About 45 min',
    durationMinutes: 45,
    idealFor: 'Anyone who is pregnant and wants steady, personal support before birth.',
    includes: ['Pregnancy wellbeing check-ins', 'Birth preferences and planning', 'Time for your questions and your partner’s'],
    goodToKnow: 'If something needs a doctor’s attention, you will be guided to the right referral.',
  },
  {
    id: 'labour-birth',
    name: 'Labour & birth',
    summary: 'Support for low-risk home and hospital births.',
    description:
      'Respectful midwifery support for low-risk births, at home or in hospital. We begin with a planning consultation to talk through your options.',
    duration: 'Planning visit: about 60 min',
    durationMinutes: 60,
    idealFor: 'Families with a low-risk pregnancy who are planning a home or hospital birth.',
    includes: ['Suitability discussion', 'Home or hospital birth planning', 'Support during labour and birth'],
    goodToKnow: 'This request books a planning consultation. It is not for labour that has already started.',
  },
  {
    id: 'postnatal',
    name: 'Postnatal care',
    summary: 'Support after birth for parent and newborn.',
    description: 'Gentle follow-up in the early days and weeks, covering recovery, feeding and your newborn’s wellbeing.',
    duration: 'About 45 min',
    durationMinutes: 45,
    idealFor: 'New parents and babies in the first days and weeks after birth.',
    includes: ['Recovery check for the birthing parent', 'Feeding guidance', 'Newborn wellbeing checks'],
    goodToKnow: 'Emotional wellbeing matters too. You are welcome to raise anything on your mind.',
  },
  {
    id: 'phototherapy',
    name: 'Home phototherapy',
    summary: 'At-home support where clinically appropriate.',
    description:
      'Light therapy for newborn jaundice in the comfort of home, offered only after an assessment shows it is suitable for your baby.',
    duration: 'Assessment: about 60 min',
    durationMinutes: 60,
    idealFor: 'Newborns with jaundice who may be suited to treatment at home.',
    includes: ['Suitability assessment', 'Equipment guidance for parents', 'Planned follow-up checks'],
    goodToKnow: 'Some babies need hospital care instead. Home visits are arranged through your chosen location.',
  },
  {
    id: 'education',
    name: 'Health education',
    summary: 'Practical guidance for pregnancy and early parenting.',
    description:
      'Clear, practical sessions that build confidence for pregnancy, birth, feeding and caring for your baby at home.',
    duration: 'About 60 min',
    durationMinutes: 60,
    idealFor: 'Expectant and new parents, partners and family members who want practical confidence.',
    includes: ['Preparing for labour', 'Feeding and newborn care basics', 'Partner and family guidance'],
    goodToKnow: 'Sessions can be shaped around the topics you care about most.',
  },
  {
    id: 'well-baby',
    name: 'Well-baby support',
    summary: 'Follow-up care and referral pathways.',
    description:
      'Check-ins as your baby grows, with advice on everyday concerns and clear referral pathways when more care is needed.',
    duration: 'About 30 min',
    durationMinutes: 30,
    idealFor: 'Families who want follow-up and everyday advice as their baby grows.',
    includes: ['Growth and wellbeing follow-up', 'Everyday care advice', 'Referrals where needed'],
    goodToKnow: 'Bring your baby’s health booklet so you can review progress together.',
  },
];

export const locations: PracticeLocation[] = [
  {
    id: 'new-born-life',
    name: 'New Born Life',
    shortName: 'New Born Life',
    setting: 'Sister Sally’s own practice',
    context: 'A quiet, personal consultation setting. Address shared when your visit is confirmed.',
  },
  {
    id: 'genesis',
    name: 'Genesis Clinic',
    shortName: 'Genesis',
    setting: 'Maternity clinic',
    context: 'Consultations within a dedicated maternity setting. Directions shared when your visit is confirmed.',
  },
  {
    id: 'oxford',
    name: 'Oxford Midwifery Clinic',
    shortName: 'Oxford',
    setting: 'Midwife-led clinic',
    context: 'Consultations in a midwife-led setting. Directions shared when your visit is confirmed.',
  },
];

type SeedFields = 'ref' | 'fullName' | 'serviceId' | 'locationId' | 'date' | 'time' | 'status' | 'createdAt';

const seedBooking = (fields: Pick<Booking, SeedFields>): Booking => ({
  ...fields,
  phone: '+27 00 000 0000',
  email: `${fields.fullName.split(' ')[0].toLowerCase()}@example.com`,
  note: '',
  consent: true,
});

export const seedBookings: Booking[] = [
  seedBooking({ ref: 'NBL-001', fullName: 'Naledi M.', serviceId: 'antenatal', locationId: 'genesis', date: '2026-12-12', time: '09:30', status: 'new', createdAt: '2026-11-20T08:15:00.000Z' }),
  seedBooking({ ref: 'NBL-002', fullName: 'Lerato K.', serviceId: 'postnatal', locationId: 'new-born-life', date: '2026-12-13', time: '10:30', status: 'confirmed', createdAt: '2026-11-21T11:40:00.000Z' }),
  seedBooking({ ref: 'NBL-003', fullName: 'Amahle S.', serviceId: 'education', locationId: 'oxford', date: '2026-12-15', time: '13:30', status: 'new', createdAt: '2026-11-23T14:05:00.000Z' }),
];

export const seedFeedback: Feedback[] = [
  {
    id: 'FB-001',
    rating: 5,
    wentWell: 'I felt listened to and never rushed. Every question was answered calmly.',
    canImprove: '',
    followUpConsent: true,
    createdAt: '2026-11-18T09:20:00.000Z',
  },
  {
    id: 'FB-002',
    rating: 4,
    wentWell: 'Very practical feeding advice.',
    canImprove: 'A reminder message the day before would help.',
    followUpConsent: false,
    createdAt: '2026-11-22T15:45:00.000Z',
  },
];
