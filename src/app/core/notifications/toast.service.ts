import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);

  readonly toasts = this.toastsSignal.asReadonly();

  success(text: string, durationMs = 2600): void {
    this.push(text, 'success', durationMs);
  }

  info(text: string, durationMs = 2600): void {
    this.push(text, 'info', durationMs);
  }

  warning(text: string, durationMs = 3200): void {
    this.push(text, 'warning', durationMs);
  }

  dismiss(id: string): void {
    this.toastsSignal.update((items) => items.filter((item) => item.id !== id));
  }

  private push(text: string, type: ToastType, durationMs: number): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const message: ToastMessage = { id, text, type };

    this.toastsSignal.update((items) => [...items, message]);

    setTimeout(() => this.dismiss(id), durationMs);
  }
}
