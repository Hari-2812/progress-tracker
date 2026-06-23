const timeZone = process.env.APP_TIME_ZONE || 'Asia/Kolkata';

export function localDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export const keyToDate = (key) => new Date(`${key}T00:00:00.000Z`);
export const dateToKey = (date) => date.toISOString().slice(0, 10);
export function addDays(key, amount) { const d = keyToDate(key); d.setUTCDate(d.getUTCDate() + amount); return dateToKey(d); }
export function daysBetween(a, b) { return Math.floor((keyToDate(b) - keyToDate(a)) / 86400000); }
