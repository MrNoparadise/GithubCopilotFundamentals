import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Horizontal bar. Tone switches to warning above `warnAt` (default 80%) and danger above 100%. */
@Component({
  selector: 'ui-progress',
  template: `
    <div class="ui-progress" role="progressbar" [attr.aria-valuenow]="clamped()" aria-valuemin="0" aria-valuemax="100">
      <div [class]="'ui-progress__bar ui-progress__bar--' + tone()" [style.width.%]="clamped()"></div>
    </div>
  `,
  styleUrl: './ui-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProgress {
  readonly value = input.required<number>(); // percent, may exceed 100
  readonly warnAt = input<number>(80); // percent
  protected readonly clamped = computed(() => Math.max(0, Math.min(100, this.value())));
  protected readonly tone = computed(() => (this.value() > 100 ? 'danger' : this.value() > this.warnAt() ? 'warning' : 'primary'));
}
