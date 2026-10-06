import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName, UiIcon } from '../ui-icon/ui-icon';

export type StatTone = 'primary' | 'success' | 'warning' | 'danger';

/**
 * KPI tile: icon, label, big value, delta vs. last period and a sparkline of the series.
 * The delta is green when it moves the good way; set `lowerIsBetter` for counts like "Blocked".
 */
@Component({
  selector: 'ui-stat',
  imports: [UiIcon],
  templateUrl: './ui-stat.html',
  styleUrl: './ui-stat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStat {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly delta = input<number>(0); // percent, signed
  readonly series = input<number[]>([]);
  readonly tone = input<StatTone>('primary');
  readonly icon = input<IconName | null>(null);
  readonly lowerIsBetter = input<boolean>(false);

  protected readonly deltaUp = computed(() => this.delta() >= 0);
  protected readonly deltaBad = computed(() => this.delta() !== 0 && this.deltaUp() === this.lowerIsBetter());
  protected readonly deltaText = computed(() => `${this.delta() >= 0 ? '+' : ''}${this.delta()}%`);

  /** Polyline points for a 100×32 viewBox. */
  protected readonly points = computed(() => {
    const s = this.series();
    if (s.length < 2) return '';
    const max = Math.max(...s, 1);
    const step = 100 / (s.length - 1);
    return s.map((v, i) => `${(i * step).toFixed(1)},${(30 - (v / max) * 28).toFixed(1)}`).join(' ');
  });

  /** The line closed along the bottom edge, for the filled area under it. */
  protected readonly area = computed(() => (this.points() ? `0,32 ${this.points()} 100,32` : ''));
}
