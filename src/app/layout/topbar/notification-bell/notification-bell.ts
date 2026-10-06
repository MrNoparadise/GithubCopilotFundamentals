import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationsStore } from '../../../core/data/notifications.store';
import { NotificationList } from '../../../features/notifications/notification-list/notification-list';
import { UiBadge, UiButton, UiCard, UiIcon } from '../../../shared/ui';

/** Bell with an unread counter. Opens a dropdown that closes on a click outside it or on Escape. */
@Component({
  selector: 'app-notification-bell',
  imports: [RouterLink, UiBadge, UiButton, UiCard, UiIcon, NotificationList],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeOnClickOutside($event)',
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class NotificationBell {
  private readonly store = inject(NotificationsStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly bellButton = viewChild.required('bellButton', { read: ElementRef<HTMLElement> });

  protected readonly open = signal(false);
  protected readonly unreadCount = this.store.unreadCount;
  protected readonly counterText = computed(() => (this.unreadCount() > 9 ? '9+' : String(this.unreadCount())));
  protected readonly buttonLabel = computed(() =>
    this.unreadCount() ? `Notifications, ${this.unreadCount()} unread` : 'Notifications',
  );

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected markAllRead(): void {
    this.store.markAllRead();
  }

  /** composedPath() still holds a row that the same click just dismissed and took out of the page. */
  protected closeOnClickOutside(event: Event): void {
    if (this.open() && !event.composedPath().includes(this.host.nativeElement)) this.close();
  }

  /** Focus goes back to the bell, so it is not lost with the dropdown. */
  protected closeOnEscape(): void {
    if (!this.open()) return;
    this.close();
    this.bellButton().nativeElement.querySelector('button')?.focus();
  }
}
