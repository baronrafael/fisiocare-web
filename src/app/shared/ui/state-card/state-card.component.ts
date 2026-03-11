import { Component, input } from '@angular/core';

export type StateCardType = 'empty' | 'loading' | 'error';

@Component({
  selector: 'fc-state-card',
  templateUrl: './state-card.component.html',
  styleUrl: './state-card.component.scss'
})
export class StateCardComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly type = input<StateCardType>('empty');
}
