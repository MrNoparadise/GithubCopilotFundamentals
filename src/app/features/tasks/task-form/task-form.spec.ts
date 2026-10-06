import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../../testing/memory-storage';
import { BROWSER_STORAGE } from '../../../core/data/storage';
import { TasksStore } from '../../../core/data/tasks.store';
import { TaskForm } from './task-form';

describe('TaskForm', () => {
  let fixture: ComponentFixture<TaskForm>;
  let closed: ReturnType<typeof vi.fn<() => void>>;

  beforeEach(async () => {
    const storage = new MemoryStorage();
    storage.setItem(
      'team-dashboard.v1.tasks',
      JSON.stringify([{ id: 5, title: 'Existing', owner: 'anna', project: 'Platform', status: 'open', priority: 'low', dueDate: '2026-10-20', estimateHours: 1 }]),
    );
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
    fixture = TestBed.createComponent(TaskForm);
    closed = vi.fn<() => void>();
    fixture.componentInstance.closed.subscribe(closed);
    await fixture.whenStable();
  });

  const tasks = () => TestBed.inject(TasksStore).tasks();
  const control = (name: string) => fixture.nativeElement.querySelector(`[formControlName=${name}]`) as HTMLInputElement | HTMLSelectElement;

  async function set(name: string, value: string): Promise<void> {
    const el = control(name);
    el.value = value;
    el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? 'change' : 'input'));
    await fixture.whenStable();
  }

  async function submit(): Promise<void> {
    const button = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLElement) => b.textContent?.trim() === 'Add task');
    button.click();
    await fixture.whenStable();
  }

  it('does not add a task while the title is blank or the due date is missing', async () => {
    await set('title', '   ');
    await submit();
    await set('title', 'Has a title');
    await submit();

    expect(tasks().length).toBe(1);
    expect(closed).not.toHaveBeenCalled();
  });

  it('adds an open task with the next id and a trimmed title, then closes', async () => {
    await set('title', '  Ship it ');
    await set('owner', 'mei');
    await set('dueDate', '2026-10-30');
    await set('estimateHours', '3');
    await submit();

    expect(tasks()[1]).toEqual({ id: 6, title: 'Ship it', owner: 'mei', project: 'Platform', priority: 'medium', dueDate: '2026-10-30', estimateHours: 3, status: 'open' });
    expect(closed).toHaveBeenCalledTimes(1);
  });
});
