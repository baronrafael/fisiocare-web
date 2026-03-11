import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../../core/subscription/plan.service';
import { PatientsRepository } from '../../../mocks/repositories/patients.repository';
import { SessionsRepository } from '../../../mocks/repositories/sessions.repository';
import { StateCardComponent } from '../../../shared/ui/state-card/state-card.component';

@Component({
  selector: 'fc-dashboard-page',
  imports: [StateCardComponent],
  template: `
    <section class="space-y-4">
      @if (uiState === 'loading') {
        <fc-state-card title="Cargando dashboard" message="Preparando resumen de tu practica..." type="loading" />
      } @else if (uiState === 'error') {
        <fc-state-card title="Error de dashboard" message="No se pudo generar el resumen inicial." type="error" />
      } @else {
      <header>
        <h1 class="text-xl font-semibold">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-600">Vista rapida del estado de tu practica.</p>
      </header>

      <div class="grid gap-3 sm:grid-cols-3">
        <article class="fc-card p-4">
          <p class="text-sm text-slate-600">Pacientes activos</p>
          <p class="mt-2 text-2xl font-semibold">{{ activeCount() }}</p>
        </article>
        <article class="fc-card p-4">
          <p class="text-sm text-slate-600">Pacientes en pausa</p>
          <p class="mt-2 text-2xl font-semibold">{{ pausedCount() }}</p>
        </article>
        <article class="fc-card p-4">
          <p class="text-sm text-slate-600">Pacientes de alta</p>
          <p class="mt-2 text-2xl font-semibold">{{ dischargedCount() }}</p>
        </article>
      </div>

      <article class="fc-card space-y-2 p-4 text-sm">
        <p class="font-semibold text-slate-800">Plan {{ planService.plan() === 'free' ? 'Free' : 'Premium' }}</p>
        <p class="text-slate-600">Uso de pacientes: {{ patientUsage() }}</p>
        @if (limitReached()) {
          <p class="text-amber-700">Llegaste al limite del plan. Actualiza para seguir cargando pacientes.</p>
        }
      </article>

      <div class="grid gap-3 md:grid-cols-2">
        <article class="fc-card p-4">
          <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Ultimos pacientes actualizados</h2>
          <div class="mt-3 space-y-2 text-sm">
            @for (patient of recentPatients(); track patient.id) {
              <div class="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <p class="font-medium text-slate-800">{{ patient.fullName }}</p>
                <p class="text-xs text-slate-500">{{ patient.lastSessionAt }}</p>
              </div>
            } @empty {
              <fc-state-card title="Sin actividad" message="Aun no hay pacientes recientes." type="empty" />
            }
          </div>
        </article>

        <article class="fc-card p-4">
          <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Ultimas sesiones registradas</h2>
          <div class="mt-3 space-y-2 text-sm">
            @for (entry of recentSessions(); track entry.session.id) {
              <div class="rounded-lg bg-slate-50 px-3 py-2">
                <div class="flex items-center justify-between gap-2">
                  <p class="font-medium text-slate-800">{{ entry.patientName }}</p>
                  <p class="text-xs text-slate-500">{{ entry.session.sessionAt }}</p>
                </div>
                <p class="text-xs uppercase tracking-[0.1em] text-slate-500">{{ entry.session.type }}</p>
              </div>
            } @empty {
              <fc-state-card title="Sin sesiones" message="Aun no hay sesiones registradas." type="empty" />
            }
          </div>
        </article>
      </div>
      }
    </section>
  `
})
export class DashboardPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly patientsRepository = inject(PatientsRepository);
  private readonly sessionsRepository = inject(SessionsRepository);
  protected readonly planService = inject(PlanService);
  protected readonly uiState = this.route.snapshot.queryParamMap.get('state');

  protected readonly activeCount = computed(
    () => this.patientsRepository.patients().filter((item) => item.status === 'active').length
  );

  protected readonly pausedCount = computed(
    () => this.patientsRepository.patients().filter((item) => item.status === 'paused').length
  );

  protected readonly dischargedCount = computed(
    () => this.patientsRepository.patients().filter((item) => item.status === 'discharged').length
  );

  protected readonly patientUsage = computed(() =>
    this.planService.patientUsageLabel(this.patientsRepository.patients().length)
  );

  protected readonly limitReached = computed(() =>
    this.planService.isPatientLimitReached(this.patientsRepository.patients().length)
  );

  protected readonly recentPatients = computed(() =>
    [...this.patientsRepository.patients()]
      .sort((a, b) => b.lastSessionAt.localeCompare(a.lastSessionAt))
      .slice(0, 5)
  );

  protected readonly recentSessions = computed(() => {
    const patientById = new Map(this.patientsRepository.patients().map((patient) => [patient.id, patient.fullName]));

    return [...this.sessionsRepository.sessions()]
      .sort((a, b) => b.sessionAt.localeCompare(a.sessionAt))
      .slice(0, 5)
      .map((session) => ({
        session,
        patientName: patientById.get(session.patientId) ?? 'Paciente'
      }));
  });
}
