import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TOAST_COPY } from '../notifications/toast-copy';
import { ToastService } from '../notifications/toast.service';
import { PlanService } from '../subscription/plan.service';
import { PatientsRepository } from '../../mocks/repositories/patients.repository';
import { ToastStackComponent } from '../../shared/ui/toast-stack/toast-stack.component';
import { GlobalHeaderComponent } from '../../shared/ui/global-header/global-header.component';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'fc-app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ToastStackComponent, GlobalHeaderComponent],
  template: `
    <div class="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside class="fc-card m-4 hidden p-4 md:block">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FisioCare</p>
        <h1 class="mt-2 text-lg font-semibold">Panel clinico</h1>

        <nav class="mt-6 space-y-2">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-teal-50 text-teal-800"
              class="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              {{ item.label }}
            </a>
          }
        </nav>

        <button class="fc-btn fc-btn-ghost mt-8 w-full" type="button" (click)="logout()">Cerrar sesion</button>
      </aside>

      <section class="pb-24 md:pb-0">
        <fc-global-header
          [userName]="userName()"
          [patientLimitReached]="patientLimitReached()"
          (createPatient)="goToNewPatient()"
        />

        <main class="mx-auto max-w-6xl px-4 py-4 md:py-6">
          <router-outlet />
        </main>
      </section>

      <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-2 py-2 md:hidden">
        <div class="grid grid-cols-4 gap-1">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-teal-50 text-teal-800"
              class="rounded-lg px-2 py-2 text-center text-xs font-medium text-slate-600"
            >
              {{ item.label }}
            </a>
          }
        </div>
      </nav>

      <fc-toast-stack />
    </div>
  `
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly planService = inject(PlanService);
  private readonly patientsRepository = inject(PatientsRepository);

  protected readonly navItems: NavItem[] = [
    { label: 'Pacientes', path: '/app/patients' },
    { label: 'Dashboard', path: '/app/dashboard' },
    { label: 'Plantillas', path: '/app/templates' },
    { label: 'Cuenta', path: '/app/account' }
  ];

  protected readonly userName = computed(() => this.authService.user()?.fullName ?? 'Fisio');
  protected readonly patientLimitReached = computed(() =>
    this.planService.isPatientLimitReached(this.patientsRepository.patients().length)
  );

  protected goToNewPatient(): void {
    if (this.patientLimitReached()) {
      this.toastService.warning(TOAST_COPY.plan.freeLimit);
      this.router.navigateByUrl('/app/account');
      return;
    }

    this.router.navigateByUrl('/app/patients/new');
  }

  protected logout(): void {
    this.authService.logout();
    this.toastService.info(TOAST_COPY.auth.logout);
    this.router.navigateByUrl('/auth/login');
  }
}
