import { Component, input, output } from '@angular/core';

@Component({
  selector: 'fc-global-header',
  templateUrl: './global-header.component.html',
  styleUrl: './global-header.component.scss'
})
export class GlobalHeaderComponent {
  readonly userName = input.required<string>();
  readonly patientLimitReached = input(false);
  readonly createPatient = output<void>();

  protected onCreatePatient(): void {
    this.createPatient.emit();
  }
}
