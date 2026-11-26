# New Born Life (clickable prototype)

A mobile-first concept prototype for a midwifery practice led by Sister Sally Chuma.
React 18, TypeScript, Tailwind CSS 4, React Router, Lucide icons.

## Run it

```powershell
npm install
```

```powershell
npm run dev
```

Open http://localhost:5173. For a production build use `npm run build`, then `npm run preview`.

## Routes

| Route | View |
| --- | --- |
| `/` | Home, About Sister Sally, services preview |
| `/services`, `/services/:serviceId` | Directory and detail dialog |
| `/book?step=1..4` | Booking wizard |
| `/book/confirmation/:ref` | Confirmation and next steps |
| `/feedback?ref=NBL-004` | Visit feedback |
| `/admin?tab=bookings\|feedback` | Practice View |

## Structure

```
src/
  components/  layout, home, ui, services, booking, admin
  context/     AppContext (draft, records, toasts)
  lib/         formatting, validation, hooks
  pages/       one file per route
  services/    mockApi (async, 300-600ms latency), seedData, storage
  types/       shared domain types
```

## Moving to a real backend

UI code only talks to `src/services/mockApi.ts` (through `AppContext`, plus the availability
loader in `ScheduleStep`). Replace each method with a `fetch` call that returns the same types.
The server must then own reference numbers, availability, validation and authentication.

A floating **Demo Mode** pill (bottom right) switches between the patient site and the Practice View.

## Demo data

Bookings and feedback persist in `localStorage` (`nbl.bookings.v1`, `nbl.feedback.v1`).
Use **Reset demo data** in the Practice View before a presentation.
Service, location and date choices are kept for the browser tab; personal details are not.

## Before any real use

- The Practice View has **no sign-in**. It must not hold real client data.
- Replace placeholder phone, email, hours and addresses in `src/services/seedData.ts`.
- Confirm service wording, durations, emergency numbers and consent text with Sister Sally.
- Photos, including the portrait, are hot-linked Unsplash stock images. The portrait is **not** Sister Sally.
  Replace it with an approved photo of Sally before any public use.
- Remove the demo view switcher (`src/components/layout/DemoSwitcher.tsx`).
- Hosting needs a single-page-app fallback (all paths serve `index.html`).
- Have privacy obligations (for example POPIA) reviewed.
