import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { relativeTime } from '../../../core/data/dates';
import { NOTIFICATION_ICON, NOTIFICATION_LABEL, NOTIFICATION_TONE, NOTIFICATION_TYPES } from '../../../core/data/labels';
import { MembersStore } from '../../../core/data/members.store';
import { NotificationsStore } from '../../../core/data/notifications.store';
import { AppNotification, NotificationType } from '../../../core/models';
import { UiAvatar, UiButton, UiChip, UiEmpty, UiIcon } from '../../../shared/ui';

type TypeFilter = NotificationType | 'all';

/**
 * Type tabs and the notification rows, used by the top bar dropdown and the Notifications page.
 * Clicking a row marks it read; × dismisses it. `compact` (dropdown) hides the tab counts and scrolls the rows.
 */
@Component({
  selector: 'app-notification-list',
  imports: [DatePipe, UiAvatar, UiButton, UiChip, UiEmpty, UiIcon],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationList {
  private readonly store = inject(NotificationsStore);
  private readonly membersStore = inject(MembersStore);

  readonly compact = input<boolean>(false);

  protected readonly types = NOTIFICATION_TYPES;
  protected readonly filter = signal<TypeFilter>('all');

  /** Moves every minute so "5 min ago" stays true while the list is open. */
  private readonly now = signal(new Date());

  protected readonly counts = computed(() => {
    const counts: Record<TypeFilter, number> = { all: 0, info: 0, warning: 0, success: 0, error: 0 };
    for (const n of this.store.notifications()) {
      counts.all++;
      counts[n.type]++;
    }
    return counts;
  });

  protected readonly rows = computed(() => {
    const filter = this.filter();
    const now = this.now();
    return this.store
      .notifications()
      .filter((n) => filter === 'all' || n.type === filter)
      .map((n) => ({
        notification: n,
        member: n.memberId ? this.membersStore.byId(n.memberId) : undefined,
        tone: NOTIFICATION_TONE[n.type],
        icon: NOTIFICATION_ICON[n.type],
        time: relativeTime(new Date(n.at), now),
      }));
  });

  protected readonly emptyTitle = computed(() => {
    const filter = this.filter();
    return filter === 'all' ? 'You’re all caught up' : `No ${NOTIFICATION_LABEL[filter].toLowerCase()} notifications`;
  });

  protected readonly emptyHint = computed(() =>
    this.filter() === 'all' ? 'New updates from your team will show up here.' : 'Pick another tab to see the rest.',
  );

  constructor() {
    const timer = setInterval(() => this.now.set(new Date()), 60_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected typeLabel(type: NotificationType): string {
    return NOTIFICATION_LABEL[type];
  }

  protected markRead(n: AppNotification): void {
    if (!n.read) this.store.markRead(n.id);
  }

  protected dismiss(n: AppNotification): void {
    this.store.dismiss(n.id);
  }
}
