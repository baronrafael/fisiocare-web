import { Component, input, output } from '@angular/core';

@Component({
  selector: 'fc-global-header',
  templateUrl: './global-header.component.html',
  styleUrl: './global-header.component.scss'
})
export class GlobalHeaderComponent {
  readonly fullName = input.required<string>();
  readonly plan = input.required<'free' | 'premium'>();
  readonly patientLimitReached = input(false);
  readonly logoutRequested = output<void>();

  protected onLogout(): void {
    this.logoutRequested.emit();
  }
}
