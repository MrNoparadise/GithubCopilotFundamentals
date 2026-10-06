import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/memory-storage';
import { NotificationsStore } from './notifications.store';
import { BROWSER_STORAGE } from './storage';

const KEY = 'team-dashboard.v1.notifications';

describe('NotificationsStore', () => {
  let storage: MemoryStorage;

  function startApp(): NotificationsStore {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
    return TestBed.inject(NotificationsStore);
  }

  beforeEach(() => (storage = new MemoryStorage()));

  it('starts with 8 notifications over the four types, newest first, 4 unread', () => {
    const store = startApp();

    expect(store.items().length).toBe(8);
    expect(new Set(store.items().map((n) => n.type))).toEqual(new Set(['info', 'warning', 'success', 'error']));
    expect(store.items().some((n) => n.memberId)).toBe(true);
    const times = store.items().map((n) => n.at);
    expect(times).toEqual([...times].sort().reverse());
    expect(store.unreadCount()).toBe(4);
  });

  it('keeps read and dismissed notifications for the next start of the app', () => {
    const store = startApp();
    store.markRead(1);
    store.dismiss(2);
    TestBed.tick();

    const next = startApp();

    expect(next.items().find((n) => n.id === 1)?.read).toBe(true);
    expect(next.items().find((n) => n.id === 2)).toBeUndefined();
    expect(next.unreadCount()).toBe(2);
  });

  it('mark all as read leaves nothing unread', () => {
    const store = startApp();

    store.markAllRead();

    expect(store.unreadCount()).toBe(0);
    expect(store.items().length).toBe(8);
  });

  it('dismissing an unread notification lowers the unread count', () => {
    const store = startApp();

    store.dismiss(1);

    expect(store.unreadCount()).toBe(3);
  });

  it('uses the sample state when nothing valid is saved', () => {
    storage.setItem(KEY, JSON.stringify({ read: 'all', dismissed: [1, 'x'] }));

    const store = startApp();

    expect(store.items().length).toBe(8);
    expect(store.unreadCount()).toBe(4);
  });

  it('reset brings back dismissed notifications', () => {
    const store = startApp();
    store.dismiss(3);
    store.markAllRead();

    store.reset();

    expect(store.items().length).toBe(8);
    expect(store.unreadCount()).toBe(4);
  });
});
