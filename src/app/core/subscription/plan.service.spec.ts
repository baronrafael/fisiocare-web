import { TestBed } from '@angular/core/testing';
import { PlanService } from './plan.service';
import { AuthService } from '../auth/auth.service';

describe('PlanService', () => {
  const storageKey = 'fc_auth_user';

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        id: 'u-001',
        fullName: 'Demo User',
        email: 'demo@fisio.com',
        plan: 'free'
      })
    );

    TestBed.configureTestingModule({});
  });

  it('should expose free restrictions by default', () => {
    const planService = TestBed.inject(PlanService);
    expect(planService.plan()).toBe('free');
    expect(planService.canUseTemplates()).toBe(false);
    expect(planService.canUseAdvancedSessionFields()).toBe(false);
    expect(planService.isPatientLimitReached(10)).toBe(true);
  });

  it('should unlock pro features after plan upgrade', () => {
    const authService = TestBed.inject(AuthService);
    const planService = TestBed.inject(PlanService);

    authService.setPlan('pro');

    expect(planService.plan()).toBe('pro');
    expect(planService.canUseTemplates()).toBe(true);
    expect(planService.canUsePdfExport()).toBe(true);
    expect(planService.canUseAdvancedPatientProfile()).toBe(true);
    expect(planService.isPatientLimitReached(200)).toBe(false);
  });
});
