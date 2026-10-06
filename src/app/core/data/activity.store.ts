import { Injectable, signal } from '@angular/core';
import { Activity } from '../models';

@Injectable({ providedIn: 'root' })
export class ActivityStore {
  readonly items = signal<Activity[]>([
    { id: 1, kind: 'completed', actor: 'tomas', taskId: 13, at: '2026-10-05T09:40:00' },
    { id: 2, kind: 'blocked', actor: 'priya', taskId: 3, at: '2026-10-05T09:10:00' },
    { id: 3, kind: 'commented', actor: 'luis', taskId: 8, at: '2026-10-05T08:55:00' },
    { id: 4, kind: 'created', actor: 'anna', taskId: 11, at: '2026-10-04T17:20:00' },
    { id: 5, kind: 'completed', actor: 'anna', taskId: 4, at: '2026-10-04T16:05:00' },
    { id: 6, kind: 'commented', actor: 'mei', taskId: 9, at: '2026-10-04T14:30:00' },
    { id: 7, kind: 'created', actor: 'luis', taskId: 5, at: '2026-10-04T11:00:00' },
  ]);

  /** Tasks closed per day, last 14 days. Static mock series for the charts. */
  readonly throughput = signal<number[]>([2, 3, 1, 4, 3, 0, 0, 5, 2, 4, 3, 6, 1, 3]);
  readonly cycleTimeDays = signal<number[]>([3.2, 2.8, 4.1, 3.6, 2.4, 2.9, 3.3, 2.1]);
}
