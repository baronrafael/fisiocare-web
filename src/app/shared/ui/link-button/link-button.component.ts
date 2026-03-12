import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonSize, ButtonVariant } from '../button/button.component';

@Component({
  selector: 'fc-link-button',
  imports: [RouterLink],
  templateUrl: './link-button.component.html',
  styleUrl: './link-button.component.scss'
})
export class LinkButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false);
  readonly disabled = input(false);
  readonly routerLink = input<string | readonly unknown[] | null>(null);
  readonly href = input<string | null>(null);
  readonly target = input<'_self' | '_blank' | '_parent' | '_top' | null>(null);
  readonly rel = input<string | null>(null);
}
