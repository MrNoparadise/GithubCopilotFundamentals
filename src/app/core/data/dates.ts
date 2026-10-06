import { formatDate } from '@angular/common';
import { WeekStart } from '../models';

export interface DateRange {
  start: string; // ISO date, inclusive
  end: string; // ISO date, inclusive
}

const WEEK_START_DAY: Record<WeekStart, number> = { sunday: 0, monday: 1 };
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

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

/**
 * How long ago `at` was, as short text: "just now", "5 min ago", "2 h ago", "yesterday", "3 days ago",
 * then the date ("Sep 28") from a week back. Times in the future count as "just now".
 */
export function timeAgo(at: Date, now: Date): string {
  const minutes = Math.floor((now.getTime() - at.getTime()) / MINUTE_MS);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  // Calendar days, so 25 h ago at 00:30 is "2 days ago". Rounding absorbs daylight saving shifts.
  const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((midnight(now) - midnight(at)) / DAY_MS);
  if (days <= 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(at, 'MMM d', 'en-US');
}
