import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/memory-storage';
import { NotificationsStore } from '../../core/data/notifications.store';
import { BROWSER_STORAGE } from '../../core/data/storage';
import { Notifications } from './notifications';

describe('Notifications page', () => {
  it('lists every notification with the tabs, and Mark all as read clears the unread count', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: new MemoryStorage() }] });
    const fixture = TestBed.createComponent(Notifications);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('.ui-card__heading')!.textContent).toBe('8 notifications');
    expect([...el.querySelectorAll('[role="tab"]')].map((t) => t.textContent?.trim())).toEqual(['All', 'Info', 'Warning', 'Success', 'Error']);
    expect(el.querySelectorAll('.notification-list__item').length).toBe(8);

    [...el.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent?.trim() === 'Mark all as read')!.click();
    await fixture.whenStable();

    expect(TestBed.inject(NotificationsStore).unreadCount()).toBe(0);
    expect(el.querySelector('ui-badge')!.textContent!.trim()).toBe('0 unread');
    expect(el.querySelectorAll('.notification-list__item--unread').length).toBe(0);
  });
});
