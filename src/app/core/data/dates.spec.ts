import { timeAgo, weekRange } from './dates';

describe('weekRange', () => {
  // 2026-10-05 is a Monday, 2026-10-11 a Sunday, 2026-10-01 a Thursday.
  it.each([
    ['monday', new Date(2026, 9, 5), '2026-10-05', '2026-10-11'],
    ['sunday', new Date(2026, 9, 5), '2026-10-04', '2026-10-10'],
    ['monday', new Date(2026, 9, 11), '2026-10-05', '2026-10-11'],
    ['sunday', new Date(2026, 9, 11), '2026-10-11', '2026-10-17'],
    ['monday', new Date(2026, 9, 1, 23, 30), '2026-09-28', '2026-10-04'],
  ] as const)('week starting on %s that contains %s', (weekStart, day, start, end) => {
    expect(weekRange(day, weekStart)).toEqual({ start, end });
  });
});

describe('timeAgo', () => {
  const now = new Date(2026, 9, 7, 10, 0); // Wednesday 10:00

  it.each([
    [new Date(2026, 9, 7, 9, 59, 40), 'just now'],
    [new Date(2026, 9, 7, 10, 5), 'just now'], // in the future
    [new Date(2026, 9, 7, 9, 55), '5 min ago'],
    [new Date(2026, 9, 7, 9, 1), '59 min ago'],
    [new Date(2026, 9, 7, 8, 0), '2 h ago'],
    [new Date(2026, 9, 6, 10, 1), '23 h ago'],
    [new Date(2026, 9, 6, 9, 0), 'yesterday'],
    [new Date(2026, 9, 5, 23, 0), '2 days ago'],
    [new Date(2026, 9, 1, 12, 0), '6 days ago'],
    [new Date(2026, 8, 28, 12, 0), 'Sep 28'],
  ])('%s reads "%s"', (at, text) => {
    expect(timeAgo(at, now)).toBe(text);
  });
});
