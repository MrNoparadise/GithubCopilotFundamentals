import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AppNotification } from '../models';
import { BROWSER_STORAGE, readStored, writeStored } from './storage';

const STORAGE_KEY = 'notifications';
const MINUTE_MS = 60_000;

/** What is saved: the ids the user has read or dismissed. The notifications themselves are mock data. */
interface NotificationState {
  read: number[];
  dismissed: number[];
}

type SeedNotification = Omit<AppNotification, 'at' | 'read'> & { minutesAgo: number };

// Newest first. Times count back from app start, so the mock always reads "5 min ago", "2 h ago", "yesterday".
const SEED: SeedNotification[] = [
  { id: 1, type: 'error', title: 'Nightly build failed', message: 'The weekly throughput endpoint broke 3 API tests on main.', memberId: 'luis', minutesAgo: 5 },
  { id: 2, type: 'warning', title: 'Task blocked', message: 'Priya flagged "Review Figma MCP setup": no access to the Figma library yet.', memberId: 'priya', minutesAgo: 25 },
  { id: 3, type: 'success', title: 'Task completed', message: 'Tomas finished "Team page: capacity bars".', memberId: 'tomas', minutesAgo: 2 * 60 },
  { id: 4, type: 'info', title: 'Anna mentioned you', message: 'Can you review the repo instructions draft before Friday?', memberId: 'anna', minutesAgo: 4 * 60 },
  { id: 5, type: 'warning', title: 'Deadline this week', message: '"Write repo instructions file" is due on Friday and has not started.', minutesAgo: 7 * 60 },
  { id: 6, type: 'info', title: 'Sprint review moved', message: 'The sprint review is now on Thursday at 14:00.', minutesAgo: 26 * 60 },
  { id: 7, type: 'success', title: 'Weekly report ready', message: 'Throughput and cycle time for last week are in Reports.', minutesAgo: 30 * 60 },
  { id: 8, type: 'error', title: 'Regression suite failing', message: 'Mei found 4 failing checks in the task table suite.', memberId: 'mei', minutesAgo: 51 * 60 },
];

const DEFAULT_STATE: NotificationState = { read: [5, 6, 7, 8], dismissed: [] };

/** Notifications for the top bar bell and the Notifications page. Read and dismissed state is saved to browser storage. */
@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private readonly storage = inject(BROWSER_STORAGE);
  private readonly seed = withTimes(SEED, new Date());
  private readonly state = signal<NotificationState>(this.load());

  /** Notifications that are not dismissed, newest first. */
  readonly items = computed<AppNotification[]>(() => {
    const { read, dismissed } = this.state();
    return this.seed.filter((n) => !dismissed.includes(n.id)).map((n) => ({ ...n, read: read.includes(n.id) }));
  });

  readonly unreadCount = computed(() => this.items().filter((n) => !n.read).length);

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

  /** Back to the sample state: nothing dismissed, the four newest unread. */
  reset(): void {
    this.state.set(DEFAULT_STATE);
  }

  private load(): NotificationState {
    const saved = readStored<Partial<NotificationState>>(this.storage, STORAGE_KEY);
    return { read: ids(saved?.read) ?? DEFAULT_STATE.read, dismissed: ids(saved?.dismissed) ?? DEFAULT_STATE.dismissed };
  }
}

function withTimes(seed: SeedNotification[], now: Date): Omit<AppNotification, 'read'>[] {
  return seed.map(({ minutesAgo, ...n }) => ({ ...n, at: new Date(now.getTime() - minutesAgo * MINUTE_MS).toISOString() }));
}

/** The value if it is a list of ids, else undefined. */
function ids(value: unknown): number[] | undefined {
  return Array.isArray(value) && value.every((v) => typeof v === 'number') ? value : undefined;
}
