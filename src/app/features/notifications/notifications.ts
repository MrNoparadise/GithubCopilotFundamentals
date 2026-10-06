import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NotificationsStore } from '../../core/data/notifications.store';
import { UiButton, UiCard, UiIcon } from '../../shared/ui';
import { NotificationList } from './notification-list/notification-list';

/** Every notification on one page: the same tabs and rows as the top bar dropdown, with more room. */
@Component({
  selector: 'app-notifications',
  imports: [UiCard, UiButton, UiIcon, NotificationList],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notifications {
  private readonly store = inject(NotificationsStore);

  protected readonly unreadCount = this.store.unreadCount;
  protected readonly heading = computed(() => {
    const total = this.store.notifications().length;
    return `${total} ${total === 1 ? 'notification' : 'notifications'} · ${this.unreadCount()} unread`;
  });

  protected markAllRead(): void {
    this.store.markAllRead();
  }
}
