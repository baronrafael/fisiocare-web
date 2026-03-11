import { Component, input, output } from '@angular/core';

@Component({
  selector: 'fc-checkbox-field',
  standalone: true,
  templateUrl: './checkbox-field.component.html',
  styleUrl: './checkbox-field.component.scss'
})
export class CheckboxFieldComponent {
  readonly label = input.required<string>();
  readonly checked = input(false);

  readonly checkedChange = output<boolean>();

  protected onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
