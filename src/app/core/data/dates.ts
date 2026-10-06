import { WeekStart } from '../models';

export interface DateRange {
  start: string; // ISO date, inclusive
  end: string; // ISO date, inclusive
}

const WEEK_START_DAY: Record<WeekStart, number> = { sunday: 0, monday: 1 };

/** Local calendar date as YYYY-MM-DD. */
export function toIsoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

/** The 7-day week that contains `day`, starting on `weekStart`. */
export function weekRange(day: Date, weekStart: WeekStart): DateRange {
  const start = addDays(day, -((day.getDay() - WEEK_START_DAY[weekStart] + 7) % 7));
  return { start: toIsoDate(start), end: toIsoDate(addDays(start, 6)) };
}
