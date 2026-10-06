import { Injectable, computed, signal } from '@angular/core';
import { AppNotification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  readonly items = signal<AppNotification[]>([
    { id: 1, type: 'error', title: 'Deploy failed', message: 'Staging build 412 failed at the migration step.', at: '2026-10-05T09:52:00', read: false },
    { id: 2, type: 'warning', title: 'Capacity warning', message: 'Priya is at 95% of weekly capacity.', at: '2026-10-05T09:15:00', read: false },
    { id: 3, type: 'success', title: 'Task completed', message: 'Tomas closed a task from the onboarding project.', at: '2026-10-05T09:40:00', read: false },
    { id: 4, type: 'info', title: 'New comment', message: 'Luis commented on a task you follow.', at: '2026-10-05T08:55:00', read: true },
    { id: 5, type: 'warning', title: 'Tasks overdue', message: '2 tasks passed their due date yesterday.', at: '2026-10-04T18:00:00', read: false },
    { id: 6, type: 'info', title: 'Weekly report ready', message: 'The report for last week is ready to view.', at: '2026-10-04T08:00:00', read: true },
  ]);

  readonly unreadCount = computed(() => this.items().filter((n) => !n.read).length);

  markAllRead(): void {
    this.items.update((list) => list.map((n) => (n.read ? n : { ...n, read: true })));
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((n) => n.id !== id));
  }
}
