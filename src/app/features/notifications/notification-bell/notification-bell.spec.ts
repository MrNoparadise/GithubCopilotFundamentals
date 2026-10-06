import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MemoryStorage } from '../../../../testing/memory-storage';
import { BROWSER_STORAGE } from '../../../core/data/storage';
import { NotificationBell } from './notification-bell';

describe('NotificationBell', () => {
  let fixture: ComponentFixture<NotificationBell>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'notifications', children: [] }]), { provide: BROWSER_STORAGE, useValue: new MemoryStorage() }],
    });
    fixture = TestBed.createComponent(NotificationBell);
    await fixture.whenStable();
  });

  const el = (): HTMLElement => fixture.nativeElement;
  const bell = () => el().querySelector<HTMLButtonElement>('.notification-bell__button')!;
  const panel = () => el().querySelector<HTMLElement>('.notification-bell__panel');
  const counter = () => el().querySelector('.notification-bell__count')?.textContent?.trim() ?? null;
  const button = (label: string) => [...el().querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent?.trim() === label)!;

  async function click(target: HTMLElement | null): Promise<void> {
    target!.click();
    await fixture.whenStable();
  }

  it('shows the number of unread notifications on the bell', () => {
    expect(counter()).toBe('4');
    expect(bell().getAttribute('aria-label')).toBe('Notifications, 4 unread');
    expect(panel()).toBeNull();
  });

  it('opens the dropdown; Mark all as read clears the counter', async () => {
    await click(bell());

    expect(bell().getAttribute('aria-expanded')).toBe('true');
    expect(panel()!.querySelector('h2')!.textContent).toBe('Notifications');
    expect(panel()!.querySelector('ui-badge')!.textContent!.trim()).toBe('4 unread');

    await click(button('Mark all as read'));

    expect(counter()).toBeNull();
    expect(panel()!.querySelector('ui-badge')!.textContent!.trim()).toBe('0 unread');
  });

  it('clicks inside the dropdown keep it open, including ×; a click outside closes it', async () => {
    await click(bell());
    await click(panel()!.querySelector('.notification-list__dismiss'));
    await click(panel()!.querySelector('.notification-list__open'));

    expect(panel()).not.toBeNull();
    expect(counter()).toBe('2');

    await click(document.body);

    expect(panel()).toBeNull();
    expect(bell().getAttribute('aria-expanded')).toBe('false');
  });

  it('Escape closes the dropdown and puts focus back on the bell', async () => {
    await click(bell());
    const tab = panel()!.querySelector<HTMLElement>('[role="tab"]')!;
    tab.focus();

    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(bell());
  });

  it('View all opens the Notifications page and closes the dropdown', async () => {
    await click(bell());

    await click(panel()!.querySelector('a'));

    expect(TestBed.inject(Router).url).toBe('/notifications');
    expect(panel()).toBeNull();
  });
});
