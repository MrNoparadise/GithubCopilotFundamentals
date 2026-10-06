import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationsStore } from '../../core/data/notifications.store';
import { SettingsStore } from '../../core/data/settings.store';
import { TasksStore } from '../../core/data/tasks.store';
import { UiButton, UiCard } from '../../shared/ui';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, UiCard, UiButton],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private readonly fb = inject(FormBuilder);
  private readonly settingsStore = inject(SettingsStore);
  private readonly tasksStore = inject(TasksStore);
  private readonly notificationsStore = inject(NotificationsStore);

  private readonly current = this.settingsStore.settings();

  protected readonly form = this.fb.nonNullable.group({
    workspaceName: [this.current.workspaceName, Validators.required],
    weekStart: [this.current.weekStart],
    capacityWarning: [this.current.capacityWarning, [Validators.required, Validators.min(50), Validators.max(100)]],
  });

  protected readonly saved = signal(false);
  protected readonly confirmingReset = signal(false);

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.settingsStore.save(this.form.getRawValue());
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  /** Drops unsaved edits and goes back to the last saved values. */
  protected reset(): void {
    this.form.reset(this.settingsStore.settings());
  }

  /** Puts back the sample tasks, default settings and notifications, dropping everything saved in this browser. */
  protected resetDemoData(): void {
    this.tasksStore.reset();
    this.settingsStore.reset();
    this.notificationsStore.reset();
    this.form.reset(this.settingsStore.settings());
    this.confirmingReset.set(false);
  }
}
