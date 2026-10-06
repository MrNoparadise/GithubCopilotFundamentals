import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Small status label. Tone picks the colour pair from the tokens. */
@Component({
  selector: 'ui-badge',
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBadge {
  readonly tone = input<BadgeTone>('neutral');
}
