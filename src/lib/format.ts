const pad = (n: number) => String(n).padStart(2, '0');

/** Local-time ISO date (avoids the UTC shift of `toISOString`). */
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatter = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', options);

const longDate = formatter({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const shortDate = formatter({ day: 'numeric', month: 'short' });
const monthYear = formatter({ month: 'long', year: 'numeric' });

export const formatLongDate = (iso: string) => longDate.format(parseISODate(iso));
export const formatShortDate = (iso: string) => shortDate.format(parseISODate(iso));
export const formatMonth = (d: Date) => monthYear.format(d);
export const formatTimestamp = (iso: string) => shortDate.format(new Date(iso));
