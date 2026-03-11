import { Component, input } from '@angular/core';

@Component({
  selector: 'fc-global-header',
  templateUrl: './global-header.component.html',
  styleUrl: './global-header.component.scss'
})
export class GlobalHeaderComponent {
  readonly fullName = input.required<string>();
  readonly plan = input.required<'free' | 'premium'>();
  readonly patientLimitReached = input(false);
}
