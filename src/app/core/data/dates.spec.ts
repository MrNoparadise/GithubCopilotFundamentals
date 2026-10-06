import { weekRange } from './dates';

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
