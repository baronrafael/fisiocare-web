import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly authService = inject(AuthService);

  readonly plan = computed(() => this.authService.user()?.plan ?? 'free');
  readonly isPremium = computed(() => this.plan() === 'premium');
  readonly patientLimit = computed(() => (this.isPremium() ? Number.POSITIVE_INFINITY : 10));
  readonly canUseTemplates = computed(() => this.isPremium());
  readonly canUsePdfExport = computed(() => this.isPremium());
  readonly canUseAdvancedSessionFields = computed(() => this.isPremium());
  readonly canUseAdvancedPatientProfile = computed(() => this.isPremium());

  isPatientLimitReached(currentPatientCount: number): boolean {
    const limit = this.patientLimit();
    return Number.isFinite(limit) && currentPatientCount >= limit;
  }

  patientUsageLabel(currentPatientCount: number): string {
    const limit = this.patientLimit();
    return Number.isFinite(limit) ? `${currentPatientCount}/${limit}` : `${currentPatientCount}/ilimitados`;
  }
}
