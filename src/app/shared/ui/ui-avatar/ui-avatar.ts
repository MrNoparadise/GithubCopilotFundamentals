import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/** Photo avatar. Shows the initials when there is no photo or it fails to load. */
@Component({
  selector: 'ui-avatar',
  template: `
    @if (src() && !failed()) {
      <img [class]="'ui-avatar ui-avatar--' + size()" [src]="src()" [alt]="name()" [title]="name()" (error)="failed.set(true)" />
    } @else {
      <span [class]="'ui-avatar ui-avatar--initials ui-avatar--' + size()" [title]="name()">{{ initials() }}</span>
    }
  `,
  styleUrl: './ui-avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAvatar {
  readonly initials = input.required<string>();
  readonly name = input<string>('');
  readonly src = input<string | undefined>(undefined);
  readonly size = input<AvatarSize>('md');

  /** Reset on every new source, so a fixed URL gets another try. */
  protected readonly failed = linkedSignal({ source: this.src, computation: () => false });
}
