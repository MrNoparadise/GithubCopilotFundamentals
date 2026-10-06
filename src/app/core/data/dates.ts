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

/**
 * How long ago `at` was, as short text: "just now", "5 min ago", "2 h ago" (same day),
 * "yesterday", "3 days ago" (under a week), then the date ("Sep 28").
 */
export function relativeTime(at: Date, now: Date): string {
  const minutes = Math.floor((now.getTime() - at.getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  // Count calendar days, not 24 h blocks; round() absorbs a daylight-saving hour.
  const days = Math.round((addDays(now, 0).getTime() - addDays(at, 0).getTime()) / 86_400_000);
  if (days === 0) return `${Math.floor(minutes / 60)} h ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return at.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** The 7-day week that contains `day`, starting on `weekStart`. */
export function weekRange(day: Date, weekStart: WeekStart): DateRange {
  const start = addDays(day, -((day.getDay() - WEEK_START_DAY[weekStart] + 7) % 7));
  return { start: toIsoDate(start), end: toIsoDate(addDays(start, 6)) };
}
