import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationsStore } from '../../core/data/notifications.store';
import { NotificationType } from '../../core/models';
import { IconName, UiButton, UiCard, UiChip, UiEmpty, UiIcon } from '../../shared/ui';

type Tab = 'all' | NotificationType;

const TYPE_ICON: Record<NotificationType, IconName> = {
  info: 'info',
  warning: 'alert',
  success: 'check',
  error: 'x',
};

@Component({
  selector: 'app-notifications-panel',
  imports: [DatePipe, UiCard, UiButton, UiChip, UiEmpty, UiIcon],
  templateUrl: './notifications-panel.html',
  styleUrl: './notifications-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPanel {
  private readonly store = inject(NotificationsStore);

  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'info', label: 'Info' },
    { id: 'warning', label: 'Warning' },
    { id: 'success', label: 'Success' },
    { id: 'error', label: 'Error' },
  ];
  protected readonly active = signal<Tab>('all');

  protected readonly unread = this.store.unreadCount;
  protected readonly heading = computed(() => `Notifications · ${this.unread()} unread`);
  protected readonly visible = computed(() => {
    const tab = this.active();
    return this.store.items().filter((n) => tab === 'all' || n.type === tab);
  });

  protected count(tab: Tab): number {
    return tab === 'all' ? this.store.items().length : this.store.items().filter((n) => n.type === tab).length;
  }

  protected icon(type: NotificationType): IconName {
    return TYPE_ICON[type];
  }

  protected select(tab: Tab): void {
    this.active.set(tab);
  }

  protected markAllRead(): void {
    this.store.markAllRead();
  }

  protected dismiss(id: number): void {
    this.store.dismiss(id);
  }
}
