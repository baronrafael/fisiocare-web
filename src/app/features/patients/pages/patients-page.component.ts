import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientStatus } from '../../../core/models/patient.model';
import { TOAST_COPY } from '../../../core/notifications/toast-copy';
import { ToastService } from '../../../core/notifications/toast.service';
import { PlanService } from '../../../core/subscription/plan.service';
import { PatientsRepository } from '../../../mocks/repositories/patients.repository';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';
import { StateCardComponent } from '../../../shared/ui/state-card/state-card.component';

@Component({
  selector: 'fc-patients-page',
  imports: [RouterLink, LinkButtonComponent, StateCardComponent],
  template: `
    <section class="space-y-4">
      @if (uiState() === 'loading') {
        <fc-state-card title="Cargando pacientes" message="Preparando listado y filtros..." type="loading" />
      } @else if (uiState() === 'error') {
        <fc-state-card title="No se pudo cargar" message="No fue posible obtener pacientes. Reintenta en unos segundos." type="error" />
      } @else {
      <header class="flex items-end justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold">Pacientes</h1>
          <p class="mt-1 text-sm text-slate-600">Organiza y accede rapido a tu seguimiento clinico.</p>
        </div>
        <button
          type="button"
          class="fc-btn fc-btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
          [disabled]="patientLimitReached()"
          (click)="goToNewPatient()"
        >
          Crear
        </button>
      </header>

      @if (isFreePlan()) {
        @if (patientLimitReached()) {
          <article class="fc-alert-warning text-sm">
            Limite del plan Free alcanzado. Actualiza tu plan para cargar mas pacientes.
            <a routerLink="/app/account" class="fc-link ml-2 font-semibold">Ver planes</a>
          </article>
        } @else {
          <div class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span>Uso del plan Free: {{ patientUsage() }}</span>
            <a routerLink="/app/account" class="fc-link font-semibold">Plan</a>
          </div>
        }
      }

      <div class="fc-card space-y-3 p-4">
        <input
          class="fc-input"
          type="text"
          placeholder="Buscar por nombre..."
          [value]="query()"
          (input)="onQueryChange($event)"
        />

        <div class="flex gap-2 overflow-x-auto pb-1">
          @for (status of statuses; track status.value) {
            <button
              class="fc-btn text-sm"
              [class.fc-btn-primary]="statusFilter() === status.value"
              [class.fc-btn-ghost]="statusFilter() !== status.value"
              type="button"
              (click)="statusFilter.set(status.value)"
            >
              {{ status.label }}
            </button>
          }
        </div>
      </div>

      <div class="space-y-3">
        @for (patient of filteredPatients(); track patient.id) {
          <article class="fc-card p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="font-semibold">{{ patient.fullName }}</h2>
                <p class="mt-1 text-sm text-slate-600">{{ patient.diagnosis }}</p>
              </div>
              <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{{ patient.status }}</span>
            </div>

            <p class="mt-3 text-sm text-slate-600">{{ patient.age }} anos · {{ patient.careMode === 'home' ? 'Domicilio' : 'Consultorio' }}</p>
            <p class="mt-1 text-xs text-slate-500">Ultima sesion: {{ patient.lastSessionAt }}</p>

            <div class="mt-3 flex gap-2">
              <fc-link-button variant="ghost" size="sm" [routerLink]="['/app/patients', patient.id]">Ver ficha</fc-link-button>
              <fc-link-button variant="primary" size="sm" [routerLink]="['/app/patients', patient.id, 'sessions', 'new']">Nueva sesion</fc-link-button>
            </div>
          </article>
        } @empty {
          <fc-state-card title="Sin pacientes" message="No hay pacientes que coincidan con tu busqueda." type="empty" />
        }
      </div>
      }
    </section>
  `
})
export class PatientsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly patientsRepository = inject(PatientsRepository);
  private readonly planService = inject(PlanService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly query = signal('');
  protected readonly statusFilter = signal<'all' | PatientStatus>('all');
  protected readonly uiState = signal<'ready' | 'loading' | 'error'>('ready');

  protected readonly statuses = [
    { value: 'all' as const, label: 'Todos' },
    { value: 'active' as const, label: 'Activos' },
    { value: 'paused' as const, label: 'En pausa' },
    { value: 'discharged' as const, label: 'Alta' }
  ];

  protected readonly filteredPatients = computed(() => {
    const query = this.query().toLowerCase().trim();
    const status = this.statusFilter();

    return this.patientsRepository
      .patients()
      .filter((patient) => (status === 'all' ? true : patient.status === status))
      .filter((patient) => patient.fullName.toLowerCase().includes(query));
  });

  protected readonly patientUsage = computed(() =>
    this.planService.patientUsageLabel(this.patientsRepository.patients().length)
  );

  protected readonly isFreePlan = computed(() => this.planService.plan() === 'free');

  protected readonly patientLimitReached = computed(() =>
    this.planService.isPatientLimitReached(this.patientsRepository.patients().length)
  );

  constructor() {
    const state = this.route.snapshot.queryParamMap.get('state');
    if (state === 'loading' || state === 'error') {
      this.uiState.set(state);
    }
  }

  protected onQueryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  protected goToNewPatient(): void {
    if (this.patientLimitReached()) {
      this.toastService.warning(TOAST_COPY.plan.freeLimit);
      this.router.navigateByUrl('/app/account');
      return;
    }

    this.router.navigateByUrl('/app/patients/new');
  }
}
