import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { timeAgo } from '../../../core/data/dates';
import { NOTIFICATION_TYPES, NOTIFICATION_TYPE_ICON, NOTIFICATION_TYPE_LABEL, NOTIFICATION_TYPE_TONE } from '../../../core/data/labels';
import { MembersStore } from '../../../core/data/members.store';
import { NotificationsStore } from '../../../core/data/notifications.store';
import { NotificationType } from '../../../core/models';
import { UiAvatar, UiEmpty, UiIcon } from '../../../shared/ui';

type Tab = NotificationType | 'all';

const TABS: { value: Tab; label: string }[] = [
  { value: 'all', label: 'All' },
  ...NOTIFICATION_TYPES.map((type) => ({ value: type, label: NOTIFICATION_TYPE_LABEL[type] })),
];
const MINUTE_MS = 60_000;

let nextId = 0;

/**
 * Type tabs and notification rows, used by the top bar dropdown (`compact`) and the Notifications page.
 * Clicking a row marks it read; × dismisses it. Relative times refresh every minute.
 */
@Component({
  selector: 'app-notification-list',
  imports: [UiAvatar, UiEmpty, UiIcon],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationList {
  private readonly store = inject(NotificationsStore);
  private readonly membersStore = inject(MembersStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  /** Dropdown version: tighter rows and a list that scrolls. */
  readonly compact = input<boolean>(false);

  /** Unique per instance: the dropdown and the page can be on screen together. */
  protected readonly id = `notification-list-${nextId++}`;
  protected readonly tabs = TABS;
  protected readonly active = signal<Tab>('all');
  private readonly now = signal(new Date());

  protected readonly rows = computed(() => {
    const tab = this.active();
    const now = this.now();
    return this.store
      .items()
      .filter((n) => tab === 'all' || n.type === tab)
      .map((n) => {
        const member = n.memberId ? this.membersStore.byId(n.memberId) : undefined;
        const ago = timeAgo(new Date(n.at), now);
        return {
          ...n,
          member,
          ago,
          icon: NOTIFICATION_TYPE_ICON[n.type],
          tone: NOTIFICATION_TYPE_TONE[n.type],
          // Screen readers get the whole row plus its read state in one name.
          label: [n.title + '.', n.message, member ? `About ${member.name}.` : '', ago + '.', n.read ? '' : 'Unread.']
            .filter(Boolean)
            .join(' '),
        };
      });
  });

  protected readonly empty = computed(() => {
    const tab = this.active();
    return tab === 'all' || !this.store.items().length
      ? { title: 'You’re all caught up', hint: 'No notifications right now. New ones will show up here.' }
      : { title: `No ${NOTIFICATION_TYPE_LABEL[tab].toLowerCase()} notifications`, hint: 'Nothing of this type right now. Try another tab.' };
  });

  constructor() {
    const timer = setInterval(() => this.now.set(new Date()), MINUTE_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected select(tab: Tab): void {
    this.active.set(tab);
  }

  /** Arrow keys, Home and End move between tabs, as in the ARIA tabs pattern. */
  protected moveTab(event: KeyboardEvent): void {
    const last = TABS.length - 1;
    const i = TABS.findIndex((t) => t.value === this.active());
    const moves: Record<string, number> = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last };
    const next: number | undefined = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.active.set(TABS[next].value);
    (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }

  protected markRead(id: number): void {
    this.store.markRead(id);
  }

  /** Removes the row and keeps focus in the list: on the row that takes its place, else on the active tab. */
  protected dismiss(id: number, index: number): void {
    this.store.dismiss(id);
    afterNextRender(
      () => {
        const host = this.host.nativeElement;
        const rows = host.querySelectorAll<HTMLElement>('.notification-list__open');
        const target = rows[Math.min(index, rows.length - 1)] ?? host.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
        target?.focus();
      },
      { injector: this.injector },
    );
  }
}
