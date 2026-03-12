import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly authService = inject(AuthService);

  readonly plan = computed(() => this.authService.user()?.plan ?? 'free');
  readonly isPro = computed(() => this.plan() === 'pro');
  readonly patientLimit = computed(() => (this.isPro() ? Number.POSITIVE_INFINITY : 10));
  readonly canUseTemplates = computed(() => this.isPro());
  readonly canUsePdfExport = computed(() => this.isPro());
  readonly canUseAdvancedSessionFields = computed(() => this.isPro());
  readonly canUseAdvancedPatientProfile = computed(() => this.isPro());

  isPatientLimitReached(currentPatientCount: number): boolean {
    const limit = this.patientLimit();
    return Number.isFinite(limit) && currentPatientCount >= limit;
  }

  patientUsageLabel(currentPatientCount: number): string {
    const limit = this.patientLimit();
    return Number.isFinite(limit) ? `${currentPatientCount}/${limit}` : `${currentPatientCount}/ilimitados`;
  }
}
