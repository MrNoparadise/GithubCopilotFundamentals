import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/memory-storage';
import { SettingsStore } from '../../core/data/settings.store';
import { NotificationsStore } from '../../core/data/notifications.store';
import { BROWSER_STORAGE } from '../../core/data/storage';
import { TasksStore } from '../../core/data/tasks.store';
import { Settings } from './settings';

describe('Settings', () => {
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    const storage = new MemoryStorage();
    storage.setItem(
      'team-dashboard.v1.tasks',
      JSON.stringify([{ id: 1, title: 'Mine', owner: 'anna', project: 'Platform', status: 'open', priority: 'low', dueDate: '2026-10-20', estimateHours: 1 }]),
    );
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
    fixture = TestBed.createComponent(Settings);
    await fixture.whenStable();
  });

  const el = (): HTMLElement => fixture.nativeElement;
  const field = (id: string) => el().querySelector<HTMLInputElement>(`#${id}`)!;
  const settings = () => TestBed.inject(SettingsStore).settings();

  async function type(id: string, value: string): Promise<void> {
    field(id).value = value;
    field(id).dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function click(label: string): Promise<void> {
    const button = [...el().querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent?.trim() === label);
    if (!button) throw new Error(`No button "${label}"`);
    button.click();
    await fixture.whenStable();
  }

  it('Save stores the changes', async () => {
    await type('workspaceName', 'Platform · Q1 2027');
    await click('Save changes');

    expect(settings().workspaceName).toBe('Platform · Q1 2027');
    expect(el().querySelector('.settings__saved')).not.toBeNull();
  });

  it('Save refuses a capacity warning below 50 %', async () => {
    await type('capacityWarning', '40');
    await click('Save changes');

    expect(settings().capacityWarning).toBe(80);
    expect(el().querySelector('.settings__saved')).toBeNull();
  });

  it('Reset drops unsaved edits', async () => {
    await type('workspaceName', 'Not saved');
    await click('Reset');

    expect(field('workspaceName').value).toBe('Platform · Q4 2026');
  });

  it('Reset demo data asks first, then restores the sample tasks, default settings and notifications', async () => {
    await type('workspaceName', 'Changed');
    await click('Save changes');
    TestBed.inject(NotificationsStore).dismiss(1);

    await click('Reset demo data');
    expect(TestBed.inject(TasksStore).tasks().length).toBe(1);

    await click('Yes, reset');

    expect(TestBed.inject(TasksStore).tasks().length).toBe(14);
    expect(settings()).toEqual({ workspaceName: 'Platform · Q4 2026', weekStart: 'monday', capacityWarning: 80 });
    expect(field('workspaceName').value).toBe('Platform · Q4 2026');
    expect(TestBed.inject(NotificationsStore).items().length).toBe(8);
  });

  it('Cancel on the reset question keeps the data', async () => {
    await click('Reset demo data');
    await click('Cancel');

    expect(TestBed.inject(TasksStore).tasks().length).toBe(1);
    expect(el().textContent).toContain('Reset demo data');
  });
});
