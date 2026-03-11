import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'fc-toast-stack',
  templateUrl: './toast-stack.component.html',
  styleUrl: './toast-stack.component.scss'
})
export class ToastStackComponent {
  protected readonly toastService = inject(ToastService);
}
