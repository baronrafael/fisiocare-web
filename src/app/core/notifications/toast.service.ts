import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  durationMs: number;
  dismissible: boolean;
  exiting: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  private readonly timeoutHandles = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly remainingDuration = new Map<string, number>();
  private readonly timeoutStartedAt = new Map<string, number>();

  private readonly exitDurationMs = 180;

  readonly toasts = this.toastsSignal.asReadonly();

  success(message: string, title = 'Listo', durationMs = 2600): void {
    this.push(message, 'success', title, durationMs);
  }

  info(message: string, title = 'Informacion', durationMs = 3000): void {
    this.push(message, 'info', title, durationMs);
  }

  warning(message: string, title = 'Atencion', durationMs = 3600): void {
    this.push(message, 'warning', title, durationMs);
  }

  error(message: string, title = 'No se pudo completar', durationMs = 4200): void {
    this.push(message, 'error', title, durationMs);
  }

  dismiss(id: string): void {
    const toast = this.toastsSignal().find((item) => item.id === id);
    if (!toast || toast.exiting) {
      return;
    }

    this.clearTimer(id);
    this.toastsSignal.update((items) => items.map((item) => (item.id === id ? { ...item, exiting: true } : item)));

    setTimeout(() => {
      this.toastsSignal.update((items) => items.filter((item) => item.id !== id));
      this.remainingDuration.delete(id);
      this.timeoutStartedAt.delete(id);
      this.timeoutHandles.delete(id);
    }, this.exitDurationMs);
  }

  pause(id: string): void {
    const handle = this.timeoutHandles.get(id);
    const startedAt = this.timeoutStartedAt.get(id);
    const remaining = this.remainingDuration.get(id);

    if (!handle || startedAt === undefined || remaining === undefined) {
      return;
    }

    clearTimeout(handle);
    const elapsed = Date.now() - startedAt;
    this.remainingDuration.set(id, Math.max(remaining - elapsed, 0));
    this.timeoutHandles.delete(id);
    this.timeoutStartedAt.delete(id);
  }

  resume(id: string): void {
    const toast = this.toastsSignal().find((item) => item.id === id);
    const remaining = this.remainingDuration.get(id);
    if (!toast || toast.exiting || remaining === undefined || remaining <= 0 || this.timeoutHandles.has(id)) {
      return;
    }

    this.scheduleDismiss(id, remaining);
  }

  private push(message: string, type: ToastType, title: string, durationMs: number): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast: ToastMessage = {
      id,
      title,
      message,
      type,
      durationMs,
      dismissible: true,
      exiting: false
    };

    this.toastsSignal.update((items) => [...items, toast]);
    this.remainingDuration.set(id, durationMs);
    this.scheduleDismiss(id, durationMs);
  }

  private scheduleDismiss(id: string, durationMs: number): void {
    this.clearTimer(id);
    this.timeoutStartedAt.set(id, Date.now());
    this.remainingDuration.set(id, durationMs);
    const handle = setTimeout(() => this.dismiss(id), durationMs);
    this.timeoutHandles.set(id, handle);
  }

  private clearTimer(id: string): void {
    const handle = this.timeoutHandles.get(id);
    if (handle) {
      clearTimeout(handle);
      this.timeoutHandles.delete(id);
    }
  }
}
