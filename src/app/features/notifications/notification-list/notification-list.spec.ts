import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../../testing/memory-storage';
import { NotificationsStore } from '../../../core/data/notifications.store';
import { BROWSER_STORAGE } from '../../../core/data/storage';
import { NotificationList } from './notification-list';

describe('NotificationList', () => {
  let fixture: ComponentFixture<NotificationList>;

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 7, 10, 0)); // Wednesday 10:00
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: new MemoryStorage() }] });
    fixture = TestBed.createComponent(NotificationList);
    await fixture.whenStable();
  });
  afterEach(() => vi.useRealTimers());

  const el = (): HTMLElement => fixture.nativeElement;
  const rows = () => [...el().querySelectorAll<HTMLElement>('.notification-list__item')];
  const text = (row: HTMLElement, selector: string) => row.querySelector(selector)?.textContent?.trim();
  const titles = () => rows().map((r) => text(r, '.notification-list__title'));
  const tab = (label: string) => [...el().querySelectorAll<HTMLButtonElement>('[role="tab"]')].find((b) => b.textContent?.trim() === label)!;
  const store = () => TestBed.inject(NotificationsStore);

  async function click(target: HTMLElement | null): Promise<void> {
    target!.click();
    await fixture.whenStable();
  }

  it('shows each notification with its type, message, teammate photo and relative time', () => {
    const [first] = rows();

    expect(first.querySelector('.notification-list__icon')!.classList).toContain('notification-list__icon--danger');
    expect(text(first, '.notification-list__title')).toBe('Nightly build failed');
    expect(text(first, '.notification-list__message')).toBe('The weekly throughput endpoint broke 3 API tests on main.');
    expect(first.querySelector('ui-avatar img')!.getAttribute('src')).toBe('/avatars/luis.jpg');
    expect(rows().map((r) => text(r, 'time'))).toEqual(['5 min ago', '25 min ago', '2 h ago', '4 h ago', '7 h ago', 'yesterday', 'yesterday', '2 days ago']);
    expect(rows().filter((r) => r.querySelector('ui-avatar')).length).toBe(5);
  });

  it('tabs show one type at a time', async () => {
    await click(tab('Error'));

    expect(titles()).toEqual(['Nightly build failed', 'Regression suite failing']);
    expect(tab('Error').getAttribute('aria-selected')).toBe('true');
    expect(tab('All').getAttribute('aria-selected')).toBe('false');

    await click(tab('All'));
    expect(rows().length).toBe(8);
  });

  it('arrow keys move between tabs', async () => {
    tab('All').focus();
    tab('All').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();

    expect(document.activeElement).toBe(tab('Error'));
    expect(titles()).toEqual(['Nightly build failed', 'Regression suite failing']);
  });

  it('clicking an unread row marks it read', async () => {
    expect(rows()[0].classList).toContain('notification-list__item--unread');

    await click(rows()[0].querySelector('.notification-list__open'));

    expect(rows()[0].classList).not.toContain('notification-list__item--unread');
    expect(store().unreadCount()).toBe(3);
  });

  it('× dismisses a notification and moves focus to the row that takes its place', async () => {
    await click(rows()[0].querySelector('.notification-list__dismiss'));

    expect(rows().length).toBe(7);
    expect(titles()[0]).toBe('Task blocked');
    expect(document.activeElement).toBe(rows()[0].querySelector('.notification-list__open'));
  });

  it('shows a friendly empty state when nothing is left to show', async () => {
    await click(tab('Success'));
    await click(rows()[0].querySelector('.notification-list__dismiss'));
    await click(rows()[0].querySelector('.notification-list__dismiss'));

    expect(rows().length).toBe(0);
    expect(text(el(), 'ui-empty')).toContain('No success notifications');

    for (const n of store().items()) store().dismiss(n.id);
    await click(tab('All'));

    expect(text(el(), 'ui-empty')).toContain('all caught up');
  });
});
