import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PRIORITIES, PRIORITY_LABEL } from '../../../core/data/labels';
import { MembersStore } from '../../../core/data/members.store';
import { TasksStore } from '../../../core/data/tasks.store';
import { TaskPriority } from '../../../core/models';
import { UiButton, UiCard, UiIcon } from '../../../shared/ui';

/** New task form. Adds the task to the store as "open", then emits `closed`. */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, UiCard, UiButton, UiIcon],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  private readonly fb = inject(FormBuilder);
  private readonly tasksStore = inject(TasksStore);
  private readonly membersStore = inject(MembersStore);

  readonly closed = output<void>();

  protected readonly members = this.membersStore.members;
  protected readonly projects = this.tasksStore.projects;
  protected readonly priorities = PRIORITIES;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.pattern(/\S/)]],
    project: [this.projects()[0] ?? ''],
    owner: [this.members()[0]?.id ?? ''],
    priority: ['medium' as TaskPriority],
    dueDate: ['', Validators.required],
    estimateHours: [1, [Validators.required, Validators.min(1)]],
  });

  protected priorityLabel(p: TaskPriority): string {
    return PRIORITY_LABEL[p];
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.tasksStore.add({ ...value, title: value.title.trim() });
    this.closed.emit();
  }
}
