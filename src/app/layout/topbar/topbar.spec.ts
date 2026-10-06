import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MemoryStorage } from '../../../testing/memory-storage';
import { BROWSER_STORAGE } from '../../core/data/storage';
import { Topbar } from './topbar';

describe('Topbar', () => {
  let fixture: ComponentFixture<Topbar>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'tasks', children: [] }]), { provide: BROWSER_STORAGE, useValue: new MemoryStorage() }],
    });
    fixture = TestBed.createComponent(Topbar);
    await fixture.whenStable();
  });

  const url = () => TestBed.inject(Router).url;
  const search = () => fixture.nativeElement.querySelector('input[type=search]') as HTMLInputElement;

  async function pressEnter(value: string): Promise<void> {
    search().value = value;
    search().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();
  }

  it('Enter in the search box opens Tasks filtered by the text and clears the box', async () => {
    await pressEnter('  Figma ');

    expect(url()).toBe('/tasks?q=Figma');
    expect(search().value).toBe('');
  });

  it('Enter in an empty search box stays on the page', async () => {
    await pressEnter('   ');

    expect(url()).toBe('/');
  });

  it('Ctrl+K moves focus to the search box', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));

    expect(document.activeElement).toBe(search());
  });

  it('shows the notification bell to the left of the user name', () => {
    const actions = [...fixture.nativeElement.querySelector('.topbar__actions').children] as HTMLElement[];
    const bell = actions.findIndex((e) => e.tagName === 'APP-NOTIFICATION-BELL');
    const user = actions.findIndex((e) => e.classList.contains('topbar__user'));

    expect(bell).toBeGreaterThan(-1);
    expect(bell).toBe(user - 1);
  });

  it('New task opens the new task form on Tasks', async () => {
    const button = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLElement) => b.textContent?.trim() === 'New task');

    button.click();
    await fixture.whenStable();

    expect(url()).toBe('/tasks?new=1');
  });
});
