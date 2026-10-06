import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationsStore } from '../../../core/data/notifications.store';
import { NOTIFICATION_ICON, NOTIFICATION_LABEL, NOTIFICATION_TONE, NOTIFICATION_TYPES } from '../../../core/data/labels';
import { AppNotification, NotificationType } from '../../../core/models';
import { UiButton, UiCard, UiChip, UiEmpty, UiIcon } from '../../../shared/ui';

type NotificationFilter = 'all' | NotificationType;

@Component({
  selector: 'app-notifications-panel',
  imports: [DatePipe, UiCard, UiButton, UiChip, UiIcon, UiEmpty],
  templateUrl: './notifications-panel.html',
  styleUrl: './notifications-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPanel {
  private readonly store = inject(NotificationsStore);

  protected readonly filter = signal<NotificationFilter>('all');
  protected readonly tabs: { id: NotificationFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...NOTIFICATION_TYPES.map((id) => ({ id, label: NOTIFICATION_LABEL[id] })),
  ];

  protected readonly unread = this.store.unreadCount;
  protected readonly heading = computed(() => `Notifications · ${this.unread()} unread`);
  protected readonly total = computed(() => this.store.items().length);
  protected readonly visible = computed(() => {
    const f = this.filter();
    return this.store.items().filter((n) => f === 'all' || n.type === f);
  });

  protected count(id: NotificationFilter): number {
    return id === 'all' ? this.total() : this.store.items().filter((n) => n.type === id).length;
  }

  protected icon(n: AppNotification) {
    return NOTIFICATION_ICON[n.type];
  }

  protected tone(n: AppNotification) {
    return NOTIFICATION_TONE[n.type];
  }

  protected markAllRead(): void {
    this.store.markAllRead();
  }

  protected dismiss(id: number): void {
    this.store.dismiss(id);
  }
}
