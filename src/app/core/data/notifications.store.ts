import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AppNotification } from '../models';
import { BROWSER_STORAGE, readStored, writeStored } from './storage';

const STORAGE_KEY = 'notifications';

/** What the user changed. Only this is saved; the notifications themselves are mock data. */
interface NotificationState {
  read: number[]; // ids
  dismissed: number[]; // ids
}

type NotificationSeed = Omit<AppNotification, 'at'> & { minutesAgo: number };

const HOUR = 60;
const DAY = 24 * HOUR;

const SEED: NotificationSeed[] = [
  { id: 1, type: 'warning', title: 'Task blocked', message: 'Priya flagged “Review Figma MCP setup” as blocked.', memberId: 'priya', minutesAgo: 5, read: false },
  { id: 2, type: 'success', title: 'Task completed', message: 'Tomas finished “Team page: capacity bars”.', memberId: 'tomas', minutesAgo: 25, read: false },
  { id: 3, type: 'error', title: 'Build failed', message: 'The main branch build failed in the Reports API tests.', minutesAgo: 2 * HOUR, read: false },
  { id: 4, type: 'info', title: 'New comment', message: 'Luis commented on “Reports API: weekly throughput endpoint”.', memberId: 'luis', minutesAgo: 3 * HOUR, read: false },
  { id: 5, type: 'warning', title: 'Deadline soon', message: '“Add UI rules for spacing and colours” is due soon and still in progress.', memberId: 'tomas', minutesAgo: 5 * HOUR, read: true },
  { id: 6, type: 'info', title: 'Weekly report ready', message: 'Throughput for last week is ready in Reports.', minutesAgo: DAY + 2 * HOUR, read: true },
  { id: 7, type: 'success', title: 'Task completed', message: 'Anna finished “Switch off unused tools in Copilot”.', memberId: 'anna', minutesAgo: DAY + 4 * HOUR, read: true },
  { id: 8, type: 'error', title: 'Calendar sync failed', message: 'Mei’s calendar stopped syncing, so her capacity may be out of date.', memberId: 'mei', minutesAgo: 3 * DAY, read: false },
];

/** Notifications for the bell and the Notifications page. Read and dismissed ids are saved to browser storage. */
@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private readonly storage = inject(BROWSER_STORAGE);

  /** Timed back from app start, so "5 min ago" and "yesterday" read right whenever the demo runs. */
  private readonly seed: AppNotification[] = this.buildSeed(new Date());
  private readonly state = signal<NotificationState>(this.load());

  /** Notifications not dismissed, newest first. */
  readonly notifications = computed<AppNotification[]>(() => {
    const { read, dismissed } = this.state();
    return this.seed
      .filter((n) => !dismissed.includes(n.id))
      .map((n) => ({ ...n, read: read.includes(n.id) }))
      .sort((a, b) => b.at.localeCompare(a.at));
  });

  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  constructor() {
    effect(() => writeStored(this.storage, STORAGE_KEY, this.state()));
  }

  markRead(id: number): void {
    this.state.update((s) => (s.read.includes(id) ? s : { ...s, read: [...s.read, id] }));
  }

  markAllRead(): void {
    this.state.update((s) => ({ ...s, read: this.seed.map((n) => n.id) }));
  }

  dismiss(id: number): void {
    this.state.update((s) => (s.dismissed.includes(id) ? s : { ...s, dismissed: [...s.dismissed, id] }));
  }

  /** Back to the sample read flags, nothing dismissed. */
  reset(): void {
    this.state.set(this.defaultState());
  }

  private buildSeed(now: Date): AppNotification[] {
    return SEED.map(({ minutesAgo, ...n }) => ({ ...n, at: new Date(now.getTime() - minutesAgo * 60_000).toISOString() }));
  }

  private defaultState(): NotificationState {
    return { read: this.seed.filter((n) => n.read).map((n) => n.id), dismissed: [] };
  }

  private load(): NotificationState {
    const saved = readStored<Partial<NotificationState>>(this.storage, STORAGE_KEY);
    const ids = (value: unknown): number[] | undefined =>
      Array.isArray(value) ? value.filter((id): id is number => typeof id === 'number') : undefined;
    const fallback = this.defaultState();
    return { read: ids(saved?.read) ?? fallback.read, dismissed: ids(saved?.dismissed) ?? fallback.dismissed };
  }
}
