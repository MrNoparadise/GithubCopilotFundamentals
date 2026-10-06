import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Toggle chip used for filters. Emits `toggled` on click. */
@Component({
  selector: 'ui-chip',
  template: `
    <button type="button" class="ui-chip" [class.ui-chip--active]="active()" [attr.aria-pressed]="active()" (click)="toggled.emit()">
      <ng-content />
      @if (count() !== null) {
        <span class="ui-chip__count">{{ count() }}</span>
      }
    </button>
  `,
  styleUrl: './ui-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiChip {
  readonly active = input<boolean>(false);
  readonly count = input<number | null>(null);
  readonly toggled = output<void>();
}
