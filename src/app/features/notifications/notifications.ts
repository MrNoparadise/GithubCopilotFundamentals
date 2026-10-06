import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NotificationsStore } from '../../core/data/notifications.store';
import { UiBadge, UiButton, UiCard, UiIcon } from '../../shared/ui';
import { NotificationList } from './notification-list/notification-list';

/** Full-page version of the top bar dropdown: the same tabs and rows, with more room. */
@Component({
  selector: 'app-notifications',
  imports: [UiCard, UiBadge, UiButton, UiIcon, NotificationList],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notifications {
  private readonly store = inject(NotificationsStore);

  protected readonly unread = this.store.unreadCount;
  protected readonly heading = computed(() => {
    const count = this.store.items().length;
    return `${count} ${count === 1 ? 'notification' : 'notifications'}`;
  });

  protected markAllRead(): void {
    this.store.markAllRead();
  }
}
