import { Component, input, output } from '@angular/core';

@Component({
  selector: 'fc-textarea-field',
  standalone: true,
  templateUrl: './textarea-field.component.html',
  styleUrl: './textarea-field.component.scss'
})
export class TextareaFieldComponent {
  readonly label = input.required<string>();
  readonly name = input('');
  readonly placeholder = input('');
  readonly value = input('');
  readonly error = input('');

  readonly valueChange = output<string>();

  protected onInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.valueChange.emit(input.value);
  }
}
