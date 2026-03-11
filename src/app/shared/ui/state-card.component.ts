import { Component, input } from '@angular/core';

export type StateCardType = 'empty' | 'loading' | 'error';

@Component({
  selector: 'fc-state-card',
  template: `
    <article
      class="fc-card p-6 text-center"
      [class.border-red-200]="type() === 'error'"
      [class.bg-red-50]="type() === 'error'"
    >
      <p class="text-sm font-semibold text-slate-800">{{ title() }}</p>
      <p class="mt-1 text-sm text-slate-600">{{ message() }}</p>
    </article>
  `
})
export class StateCardComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly type = input<StateCardType>('empty');
}
