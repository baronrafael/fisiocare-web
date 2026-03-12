import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md';

@Component({
  selector: 'fc-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly block = input(false);
}
