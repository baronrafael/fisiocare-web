import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TOAST_COPY } from '../notifications/toast-copy';
import { ToastService } from '../notifications/toast.service';
import { PlanService } from '../subscription/plan.service';
import { PatientsRepository } from '../../mocks/repositories/patients.repository';
import { ToastStackComponent } from '../../shared/ui/toast-stack/toast-stack.component';
import { GlobalHeaderComponent } from '../../shared/ui/global-header/global-header.component';
import { AppNavigationComponent, AppNavItem } from '../../shared/ui/app-navigation/app-navigation.component';

@Component({
  selector: 'fc-app-shell',
  imports: [RouterOutlet, ToastStackComponent, GlobalHeaderComponent, AppNavigationComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly planService = inject(PlanService);
  private readonly patientsRepository = inject(PatientsRepository);

  protected readonly navItems: AppNavItem[] = [
    { label: 'Pacientes', path: '/app/patients' },
    { label: 'Dashboard', path: '/app/dashboard' },
    { label: 'Plantillas', path: '/app/templates' },
    { label: 'Cuenta', path: '/app/account' }
  ];

  protected readonly userFullName = computed(() => this.authService.user()?.fullName ?? 'Profesional');
  protected readonly activePlan = this.planService.plan;
  protected readonly patientLimitReached = computed(() =>
    this.planService.isPatientLimitReached(this.patientsRepository.patients().length)
  );

  protected logout(): void {
    this.authService.logout();
    this.toastService.info(TOAST_COPY.auth.logout);
    this.router.navigateByUrl('/auth/login');
  }
}
