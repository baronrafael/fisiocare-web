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
        <p
          class="fc-badge-plan mt-1"
          [class.fc-badge-plan-free]="userPlan() === 'free'"
          [class.fc-badge-plan-pro]="userPlan() === 'pro'"
        >
          {{ userPlan() === 'free' ? 'Free' : 'Pro' }}
        </p>

        <p class="mt-4 text-sm text-slate-600">Uso de pacientes</p>
        <p class="mt-1 font-semibold">{{ patientUsage() }}</p>

        @if (userPlan() === 'free') {
          <p class="fc-alert-warning mt-4 text-sm">
            Free: hasta 10 pacientes. Sin plantillas ni exportacion PDF.
          </p>
          <button class="fc-btn fc-btn-primary mt-3 w-full" type="button" (click)="upgradeToPro()">
            Activar Pro (mock)
          </button>
        } @else {
          <p class="fc-alert-success mt-4 text-sm">
            Pro activo: pacientes ilimitados, plantillas y PDF habilitados.
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

  protected upgradeToPro(): void {
    this.authService.setPlan('pro');
    this.toastService.success(TOAST_COPY.plan.upgraded);
  }

  protected downgradeToFree(): void {
    this.authService.setPlan('free');
    this.toastService.info(TOAST_COPY.plan.downgraded);
  }
}
