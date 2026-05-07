import { DateTime } from 'luxon';

export const TZ = 'Europe/Bucharest';

export function nowInAcademyTz(): DateTime {
  return DateTime.now().setZone(TZ);
}

export function isoDateInAcademyTz(value?: string): string {
  if (value) {
    return DateTime.fromISO(value, { zone: TZ }).toISODate() ?? nowInAcademyTz().toISODate()!;
  }
  return nowInAcademyTz().toISODate()!;
}

export function weekStartIso(value?: string): string {
  const dt = value ? DateTime.fromISO(value, { zone: TZ }) : nowInAcademyTz();
  return dt.startOf('week').toISODate()!;
}

export function formatDateTime(value: string): string {
  return DateTime.fromISO(value, { zone: TZ }).toFormat('dd.MM.yyyy HH:mm');
}

export function formatTimeRange(startAt: string, endAt: string): string {
  const start = DateTime.fromISO(startAt, { zone: TZ }).toFormat('HH:mm');
  const end = DateTime.fromISO(endAt, { zone: TZ }).toFormat('HH:mm');
  return `${start} - ${end}`;
}

export function shiftWeek(startIso: string, delta: number): string {
  return DateTime.fromISO(startIso, { zone: TZ }).plus({ weeks: delta }).toISODate()!;
}

export function monthYearFromNow(): { year: number; month: number } {
  const now = nowInAcademyTz();
  return { year: now.year, month: now.month };
}

