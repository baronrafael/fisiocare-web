import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { TOAST_COPY } from '../../../core/notifications/toast-copy';
import { ToastService } from '../../../core/notifications/toast.service';
import { PlanService } from '../../../core/subscription/plan.service';
import { PatientsRepository } from '../../../mocks/repositories/patients.repository';

@Component({
  selector: 'fc-account-page',
  template: `
    <section class="space-y-4">
      <header>
        <h1 class="text-xl font-semibold">Cuenta</h1>
        <p class="mt-1 text-sm text-slate-600">Estado de suscripcion y perfil profesional.</p>
      </header>

      <article class="fc-card p-4">
        <p class="text-sm text-slate-600">Nombre</p>
        <p class="mt-1 font-semibold">{{ userName() }}</p>

        <p class="mt-4 text-sm text-slate-600">Plan actual</p>
        <p class="mt-1 inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
          {{ userPlan() === 'free' ? 'Free' : 'Premium' }}
        </p>

        <p class="mt-4 text-sm text-slate-600">Uso de pacientes</p>
        <p class="mt-1 font-semibold">{{ patientUsage() }}</p>

        @if (userPlan() === 'free') {
          <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Free: hasta 10 pacientes. Sin plantillas ni exportacion PDF.
          </p>
          <button class="fc-btn fc-btn-primary mt-3 w-full" type="button" (click)="upgradeToPremium()">
            Activar Premium (mock)
          </button>
        } @else {
          <p class="mt-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-900">
            Premium activo: pacientes ilimitados, plantillas y PDF habilitados.
          </p>
          <button class="fc-btn fc-btn-ghost mt-3 w-full" type="button" (click)="downgradeToFree()">
            Volver a Free (mock)
          </button>
        }
      </article>
    </section>
  `
})
export class AccountPageComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly planService = inject(PlanService);
  private readonly patientsRepository = inject(PatientsRepository);

  protected readonly userName = computed(() => this.authService.user()?.fullName ?? 'Sin sesion');
  protected readonly userPlan = computed(() => this.authService.user()?.plan ?? 'free');
  protected readonly patientUsage = computed(() =>
    this.planService.patientUsageLabel(this.patientsRepository.patients().length)
  );

  protected upgradeToPremium(): void {
    this.authService.setPlan('premium');
    this.toastService.success(TOAST_COPY.plan.upgraded);
  }

  protected downgradeToFree(): void {
    this.authService.setPlan('free');
    this.toastService.info(TOAST_COPY.plan.downgraded);
  }
}
