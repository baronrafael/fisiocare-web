import { Component, inject } from '@angular/core';
import { ToastMessage, ToastService, ToastType } from '../../../core/notifications/toast.service';

@Component({
  selector: 'fc-toast-stack',
  templateUrl: './toast-stack.component.html',
  styleUrl: './toast-stack.component.scss'
})
export class ToastStackComponent {
  protected readonly toastService = inject(ToastService);

  protected iconPath(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'M9 12.75 11.25 15 15.75 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z';
      case 'warning':
        return 'M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.28 2.25h16.8A1.5 1.5 0 0 0 21.18 18L12.71 3.86a1.5 1.5 0 0 0-2.42 0Z';
      case 'error':
        return 'M9.75 9.75 14.25 14.25m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z';
      default:
        return 'M12 8.25h.008v.008H12V8.25Zm0 3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z';
    }
  }

  protected liveMode(type: ToastType): 'polite' | 'assertive' {
    return type === 'warning' || type === 'error' ? 'assertive' : 'polite';
  }

  protected role(type: ToastType): 'status' | 'alert' {
    return type === 'warning' || type === 'error' ? 'alert' : 'status';
  }

  protected onMouseEnter(toast: ToastMessage): void {
    this.toastService.pause(toast.id);
  }

  protected onMouseLeave(toast: ToastMessage): void {
    this.toastService.resume(toast.id);
  }
}
