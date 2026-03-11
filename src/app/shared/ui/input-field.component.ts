import { Component, input, output } from '@angular/core';

@Component({
  selector: 'fc-input-field',
  standalone: true,
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss'
})
export class InputFieldComponent {
  readonly label = input.required<string>();
  readonly type = input('text');
  readonly name = input('');
  readonly placeholder = input('');
  readonly value = input('');
  readonly required = input(false);
  readonly error = input('');

  readonly valueChange = output<string>();

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
