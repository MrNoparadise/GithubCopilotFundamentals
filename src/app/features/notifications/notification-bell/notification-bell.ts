import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificationsStore } from '../../../core/data/notifications.store';
import { UiBadge, UiButton, UiIcon } from '../../../shared/ui';
import { NotificationList } from '../notification-list/notification-list';

/**
 * Top bar bell with a red unread counter. Opens a dropdown with the notification list;
 * a click outside it or Escape closes it.
 */
@Component({
  selector: 'app-notification-bell',
  imports: [RouterLink, UiBadge, UiButton, UiIcon, NotificationList],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class NotificationBell {
  private readonly store = inject(NotificationsStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('bellButton');

  protected readonly panelId = 'notification-panel';
  protected readonly open = signal(false);
  protected readonly unread = this.store.unreadCount;
  /** Caps at 9+ so the counter stays small. */
  protected readonly countText = computed(() => (this.unread() > 9 ? '9+' : String(this.unread())));
  protected readonly buttonLabel = computed(() => (this.unread() ? `Notifications, ${this.unread()} unread` : 'Notifications'));

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected markAllRead(): void {
    this.store.markAllRead();
  }

  /**
   * The event path is fixed when the click starts, so a click on × still counts as inside
   * even though its row is gone from the page by the time the click reaches the document.
   */
  protected closeOnOutsideClick(event: MouseEvent): void {
    if (this.open() && !event.composedPath().includes(this.host.nativeElement)) this.close();
  }

  /** Closes and puts focus back on the bell, unless the user has already moved focus somewhere else. */
  protected closeOnEscape(): void {
    if (!this.open()) return;
    const focused = this.document.activeElement;
    const focusWasHere = !focused || focused === this.document.body || this.host.nativeElement.contains(focused);
    this.close();
    if (focusWasHere) this.button().nativeElement.focus();
  }
}
