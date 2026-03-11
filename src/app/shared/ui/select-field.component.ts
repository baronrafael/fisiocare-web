import { Component, input, output } from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'fc-select-field',
  standalone: true,
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss'
})
export class SelectFieldComponent {
  readonly label = input.required<string>();
  readonly options = input<SelectOption[]>([]);
  readonly value = input('');
  readonly error = input('');

  readonly valueChange = output<string>();

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.valueChange.emit(select.value);
  }
}
