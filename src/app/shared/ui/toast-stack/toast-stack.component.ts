import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'fc-toast-stack',
  template: `
    <section class="pointer-events-none fixed inset-x-0 top-3 z-50 px-3">
      <div class="mx-auto flex w-full max-w-md flex-col gap-2">
        @for (toast of toastService.toasts(); track toast.id) {
          <article
            class="pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-md"
            [class.border-teal-200]="toast.type === 'success'"
            [class.bg-teal-50]="toast.type === 'success'"
            [class.text-teal-900]="toast.type === 'success'"
            [class.border-slate-200]="toast.type === 'info'"
            [class.bg-white]="toast.type === 'info'"
            [class.text-slate-800]="toast.type === 'info'"
            [class.border-amber-200]="toast.type === 'warning'"
            [class.bg-amber-50]="toast.type === 'warning'"
            [class.text-amber-900]="toast.type === 'warning'"
          >
            <div class="flex items-center justify-between gap-3">
              <p>{{ toast.text }}</p>
              <button class="text-xs font-semibold opacity-70 hover:opacity-100" type="button" (click)="toastService.dismiss(toast.id)">
                Cerrar
              </button>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class ToastStackComponent {
  protected readonly toastService = inject(ToastService);
}
