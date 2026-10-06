import { computed, Injectable, signal } from '@angular/core';
import { AppNotification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  readonly items = signal<AppNotification[]>([
    { id: 1, type: 'error', title: 'Deploy failed', message: 'The staging build stopped at the migration step.', at: '2026-10-05T09:48:00', read: false },
    { id: 2, type: 'warning', title: 'Capacity near limit', message: 'Priya is at 92% of weekly capacity.', at: '2026-10-05T09:15:00', read: false },
    { id: 3, type: 'success', title: 'Task completed', message: 'Tomas closed a task you follow.', at: '2026-10-05T08:40:00', read: false },
    { id: 4, type: 'info', title: 'New comment', message: 'Luis left a comment on a task you follow.', at: '2026-10-04T17:25:00', read: true },
    { id: 5, type: 'warning', title: 'Due tomorrow', message: '3 open tasks are due tomorrow.', at: '2026-10-04T15:00:00', read: false },
    { id: 6, type: 'info', title: 'Weekly report ready', message: 'The team report for last week is ready to view.', at: '2026-10-04T08:00:00', read: true },
  ]);

  readonly unreadCount = computed(() => this.items().filter((n) => !n.read).length);

  markAllRead(): void {
    this.items.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((n) => n.id !== id));
  }
}
