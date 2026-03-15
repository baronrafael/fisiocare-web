import { Component, input, output } from '@angular/core';

@Component({
  selector: 'fc-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirmar accion');
  readonly message = input('Esta accion no se puede deshacer.');
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');
  readonly destructive = input(false);
  readonly busy = input(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected onConfirm(): void {
    if (this.busy()) {
      return;
    }

    this.confirm.emit();
  }

  protected onCancel(): void {
    if (this.busy()) {
      return;
    }

    this.cancel.emit();
  }
}
