import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContactLogType } from '../../../core/models/contact-log.model';
import { PatientFileType } from '../../../core/models/patient-file.model';
import { TOAST_COPY } from '../../../core/notifications/toast-copy';
import { ToastService } from '../../../core/notifications/toast.service';
import { PlanService } from '../../../core/subscription/plan.service';
import { PatientsRepository } from '../../../mocks/repositories/patients.repository';
import { PatientFilesRepository } from '../../../mocks/repositories/patient-files.repository';
import { ContactLogsRepository } from '../../../mocks/repositories/contact-logs.repository';
import { SessionsRepository } from '../../../mocks/repositories/sessions.repository';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';
import { SessionTimelineComponent } from '../../../shared/ui/session-timeline/session-timeline.component';

type PatientTab = 'summary' | 'clinical' | 'files' | 'context' | 'checklist' | 'administrative' | 'sessions' | 'contacts';
type SessionFilterType = 'all' | 'physical' | 'cognitive' | 'mixed';

@Component({
  selector: 'fc-patient-detail-page',
  imports: [RouterLink, LinkButtonComponent, SessionTimelineComponent],
  template: `
    @if (patient(); as item) {
      <section class="space-y-4">
        <header class="fc-card p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Ficha de paciente</p>
          <h1 class="mt-1 text-xl font-semibold">{{ item.fullName }}</h1>
          <p class="mt-2 text-sm text-slate-600">{{ item.diagnosis }}</p>
          <div class="mt-3 flex gap-2">
            <fc-link-button variant="ghost" size="sm" [routerLink]="['/app/patients', item.id, 'edit']">Editar ficha</fc-link-button>
            <fc-link-button variant="primary" size="sm" [routerLink]="['/app/patients', item.id, 'sessions', 'new']">Registrar sesion</fc-link-button>
          </div>
        </header>

        <nav class="fc-card overflow-x-auto p-2">
          <div class="flex gap-2">
            @for (tab of tabs; track tab.value) {
              <button
                type="button"
                class="fc-btn text-xs"
                [class.fc-btn-primary]="activeTab() === tab.value"
                [class.fc-btn-ghost]="activeTab() !== tab.value"
                [class.opacity-60]="isLockedTab(tab.value)"
                (click)="selectTab(tab.value)"
              >
                {{ tab.label }}
                @if (isLockedTab(tab.value)) {
                  <span> · Pro</span>
                }
              </button>
            }
          </div>
        </nav>

        @switch (activeTab()) {
          @case ('summary') {
            <article class="fc-card p-4">
              <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Resumen</h2>
              <div class="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p><strong>Edad:</strong> {{ item.age }} anos</p>
                <p><strong>Estado:</strong> {{ item.status }}</p>
                <p><strong>Modalidad:</strong> {{ item.careMode === 'home' ? 'Domicilio' : 'Consultorio' }}</p>
                <p><strong>Ultima sesion:</strong> {{ item.lastSessionAt }}</p>
                <p><strong>Telefono principal:</strong> {{ item.primaryPhone || 'No registrado' }}</p>
                <p><strong>Diagnostico:</strong> {{ item.diagnosis }}</p>
              </div>
              <p class="fc-alert-success mt-4 text-sm">
                <strong>Nota rapida:</strong> {{ item.persistentNotes || 'Sin notas permanentes.' }}
              </p>
            </article>
          }

          @case ('clinical') {
            <article class="fc-card space-y-3 p-4 text-sm text-slate-700">
              <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Datos clinicos</h2>
              <p><strong>Diagnostico medico:</strong> {{ item.diagnosis }}</p>
              <p><strong>Observaciones iniciales:</strong> {{ item.initialClinicalNotes || 'Sin registro' }}</p>
              <p><strong>Estudios complementarios:</strong> {{ item.studiesNotes || 'Sin registro' }}</p>
              <p><strong>Consentimiento informado:</strong> {{ item.consentGiven ? 'Si' : 'No registrado' }}</p>
            </article>
          }

          @case ('files') {
            <article class="space-y-3">
              <div class="fc-card space-y-2 p-4">
                <p class="text-sm font-semibold">Adjuntar estudio/documento</p>
                <div class="grid gap-2 sm:grid-cols-3">
                  <select class="fc-input" [value]="newFileType()" (change)="onFileTypeChange($event)">
                    <option value="study">Estudio</option>
                    <option value="consent">Consentimiento</option>
                    <option value="report">Reporte</option>
                    <option value="other">Otro</option>
                  </select>
                  <input class="fc-input sm:col-span-2" type="text" placeholder="Nombre del archivo (mock)" [value]="newFileName()" (input)="onFileNameChange($event)" />
                </div>
                <button class="fc-btn fc-btn-primary" type="button" (click)="addPatientFile()">Agregar archivo</button>
              </div>

              @for (file of patientFiles(); track file.id) {
                <div class="fc-card flex items-center justify-between gap-2 p-4 text-sm text-slate-700">
                  <div>
                    <p class="font-semibold">{{ file.fileName }}</p>
                    <p class="text-xs text-slate-500">{{ fileTypeLabel(file.type) }} · {{ file.uploadedAt }}</p>
                  </div>
                  <button type="button" class="text-xs text-red-700 hover:underline" (click)="removePatientFile(file.id)">Eliminar</button>
                </div>
              } @empty {
                <div class="fc-card p-6 text-center text-sm text-slate-600">No hay archivos adjuntos para este paciente.</div>
              }
            </article>
          }

          @case ('context') {
            <article class="fc-card space-y-3 p-4 text-sm text-slate-700">
              <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Contexto</h2>
              <p><strong>Direccion:</strong> {{ item.address || 'Sin registro' }}</p>
              <p><strong>Referencia:</strong> {{ item.reference || 'Sin registro' }}</p>
              <p><strong>Acompanante:</strong> {{ item.companion?.present ? 'Si' : 'No' }}</p>
              <p><strong>Detalle acompanante:</strong> {{ item.companion?.description || 'Sin detalle' }}</p>
              <p><strong>Mascotas:</strong> {{ item.pets?.present ? 'Si' : 'No' }}</p>
              <p><strong>Espacio de sesion:</strong> {{ item.availableSpace || 'Sin detalle' }}</p>
              <p><strong>Observaciones contextuales:</strong> {{ item.contextualNotes || 'Sin observaciones' }}</p>
            </article>
          }

          @case ('administrative') {
            <article class="fc-card space-y-3 p-4 text-sm text-slate-700">
              <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Administrativo</h2>
              <p><strong>Modalidad de pago:</strong> {{ item.paymentMode || 'Sin registro' }}</p>
              <p><strong>Observaciones de pago:</strong> {{ item.paymentNotes || 'Sin observaciones' }}</p>
              <a [routerLink]="['/app/exports/patients', item.id, 'pdf-preview']" class="fc-link fc-link-medium inline-block">
                Ver preview PDF
              </a>
            </article>
          }

          @case ('checklist') {
            <article class="fc-card space-y-3 p-4 text-sm text-slate-700">
              <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Checklist de ingreso</h2>
              <p><strong>Direccion confirmada:</strong> {{ item.intakeChecklist?.addressConfirmed ? 'Si' : 'No' }}</p>
              <p><strong>Espacio adecuado:</strong> {{ item.intakeChecklist?.adequateSpace ? 'Si' : 'No' }}</p>
              <p><strong>Acompanante presente:</strong> {{ item.intakeChecklist?.companionPresent ? 'Si' : 'No' }}</p>
              <p><strong>Mascotas presentes:</strong> {{ item.intakeChecklist?.petsPresent ? 'Si' : 'No' }}</p>
              <p><strong>Estudios cargados:</strong> {{ item.intakeChecklist?.studiesLoaded ? 'Si' : 'No' }}</p>
              <p><strong>Condiciones especiales:</strong> {{ item.intakeChecklist?.specialHomeConditions || 'Sin observaciones' }}</p>
            </article>
          }

          @case ('sessions') {
            <section class="space-y-3">
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Timeline de sesiones</h2>
                <a [routerLink]="['/app/patients', item.id, 'sessions', 'new']" class="fc-link fc-link-medium">Nueva sesion</a>
              </div>

              <div class="fc-card grid gap-2 p-3 text-sm sm:grid-cols-3">
                <label>
                  Tipo
                  <select class="fc-input mt-1" [value]="sessionTypeFilter()" (change)="onSessionTypeChange($event)">
                    <option value="all">Todos</option>
                    <option value="physical">Fisica</option>
                    <option value="cognitive">Cognitiva</option>
                    <option value="mixed">Mixta</option>
                  </select>
                </label>
                <label>
                  Desde
                  <input class="fc-input mt-1" type="date" [value]="sessionDateFrom()" (input)="onDateFromChange($event)" />
                </label>
                <label>
                  Hasta
                  <input class="fc-input mt-1" type="date" [value]="sessionDateTo()" (input)="onDateToChange($event)" />
                </label>
              </div>

              <p class="text-xs text-slate-500">Mostrando {{ filteredSessions().length }} sesiones.</p>
              <fc-session-timeline [sessions]="filteredSessions()" />
            </section>
          }

          @case ('contacts') {
            <article class="space-y-3">
              <div class="fc-card space-y-2 p-4">
                <p class="text-sm font-semibold">Agregar evento</p>
                <div class="grid gap-2 sm:grid-cols-3">
                  <input class="fc-input" type="date" [value]="newContactDate()" (input)="onDateChange($event)" />
                  <select class="fc-input" [value]="newContactType()" (change)="onTypeChange($event)">
                    <option value="confirmed">Confirmo</option>
                    <option value="rescheduled">Reprogramo</option>
                    <option value="cancelled">Cancelo</option>
                    <option value="family-update">Familiar</option>
                    <option value="note">Nota</option>
                  </select>
                  <button class="fc-btn fc-btn-primary" type="button" (click)="addContactLog()">Guardar</button>
                </div>
                <textarea class="fc-input min-h-20" placeholder="Describe el evento" [value]="newContactDescription()" (input)="onDescriptionChange($event)"></textarea>
              </div>

              @for (log of contactLogs(); track log.id) {
                <div class="fc-card p-4 text-sm text-slate-700">
                  <div class="flex items-center justify-between gap-2">
                    <p class="font-semibold">{{ log.occurredAt }}</p>
                    <div class="flex items-center gap-2">
                      <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">{{ contactTypeLabel(log.type) }}</span>
                      <button type="button" class="text-xs text-red-700 hover:underline" (click)="removeContactLog(log.id)">Eliminar</button>
                    </div>
                  </div>
                  <p class="mt-2">{{ log.description }}</p>
                </div>
              } @empty {
                <div class="fc-card p-6 text-center text-sm text-slate-600">No hay contactos registrados.</div>
              }
            </article>
          }
        }
      </section>
    } @else {
      <article class="fc-card p-6 text-center text-sm text-slate-600">Paciente no encontrado.</article>
    }
  `
})
export class PatientDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly patientsRepository = inject(PatientsRepository);
  private readonly sessionsRepository = inject(SessionsRepository);
  private readonly contactLogsRepository = inject(ContactLogsRepository);
  private readonly patientFilesRepository = inject(PatientFilesRepository);
  private readonly toastService = inject(ToastService);
  private readonly planService = inject(PlanService);

  protected readonly activeTab = signal<PatientTab>('summary');

  protected readonly tabs: ReadonlyArray<{ value: PatientTab; label: string }> = [
    { value: 'summary', label: 'Resumen' },
    { value: 'clinical', label: 'Clinico' },
    { value: 'files', label: 'Archivos' },
    { value: 'context', label: 'Contexto' },
    { value: 'checklist', label: 'Checklist' },
    { value: 'administrative', label: 'Admin' },
    { value: 'sessions', label: 'Sesiones' },
    { value: 'contacts', label: 'Contactos' }
  ];

  protected readonly newContactDate = signal(this.today());
  protected readonly newContactType = signal<ContactLogType>('confirmed');
  protected readonly newContactDescription = signal('');
  protected readonly newFileType = signal<PatientFileType>('study');
  protected readonly newFileName = signal('');
  protected readonly sessionTypeFilter = signal<SessionFilterType>('all');
  protected readonly sessionDateFrom = signal('');
  protected readonly sessionDateTo = signal('');

  protected readonly lockedTabs: ReadonlyArray<PatientTab> = ['clinical', 'files', 'context', 'checklist', 'administrative'];

  protected readonly patient = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.patientsRepository.findById(id) : undefined;
  });

  protected readonly sessions = computed(() => {
    const patient = this.patient();
    return patient ? this.sessionsRepository.findByPatientId(patient.id) : [];
  });

  protected readonly filteredSessions = computed(() => {
    const typeFilter = this.sessionTypeFilter();
    const from = this.sessionDateFrom();
    const to = this.sessionDateTo();

    return this.sessions().filter((session) => {
      const matchesType = typeFilter === 'all' ? true : session.type === typeFilter;
      const matchesFrom = from ? session.sessionAt >= from : true;
      const matchesTo = to ? session.sessionAt <= to : true;
      return matchesType && matchesFrom && matchesTo;
    });
  });

  protected readonly contactLogs = computed(() => {
    const patient = this.patient();
    return patient ? this.contactLogsRepository.findByPatientId(patient.id) : [];
  });

  protected readonly patientFiles = computed(() => {
    const patient = this.patient();
    return patient ? this.patientFilesRepository.findByPatientId(patient.id) : [];
  });

  protected contactTypeLabel(type: ContactLogType): string {
    switch (type) {
      case 'cancelled':
        return 'Cancelo';
      case 'rescheduled':
        return 'Reprogramo';
      case 'confirmed':
        return 'Confirmo';
      case 'family-update':
        return 'Familiar';
      default:
        return 'Nota';
    }
  }

  protected onDateChange(event: Event): void {
    this.newContactDate.set((event.target as HTMLInputElement).value);
  }

  protected onTypeChange(event: Event): void {
    this.newContactType.set((event.target as HTMLSelectElement).value as ContactLogType);
  }

  protected onDescriptionChange(event: Event): void {
    this.newContactDescription.set((event.target as HTMLTextAreaElement).value);
  }

  protected onFileTypeChange(event: Event): void {
    this.newFileType.set((event.target as HTMLSelectElement).value as PatientFileType);
  }

  protected onFileNameChange(event: Event): void {
    this.newFileName.set((event.target as HTMLInputElement).value);
  }

  protected onSessionTypeChange(event: Event): void {
    this.sessionTypeFilter.set((event.target as HTMLSelectElement).value as SessionFilterType);
  }

  protected onDateFromChange(event: Event): void {
    this.sessionDateFrom.set((event.target as HTMLInputElement).value);
  }

  protected onDateToChange(event: Event): void {
    this.sessionDateTo.set((event.target as HTMLInputElement).value);
  }

  protected addContactLog(): void {
    const patient = this.patient();
    const description = this.newContactDescription().trim();
    if (!patient || !description) {
      return;
    }

    this.contactLogsRepository.create({
      patientId: patient.id,
      occurredAt: this.newContactDate() || this.today(),
      type: this.newContactType(),
      description
    });

    this.newContactDescription.set('');
    this.toastService.success('Evento de contacto guardado.');
  }

  protected removeContactLog(logId: string): void {
    this.contactLogsRepository.remove(logId);
    this.toastService.info('Evento eliminado.');
  }

  protected addPatientFile(): void {
    const patient = this.patient();
    const fileName = this.newFileName().trim();
    if (!patient || !fileName) {
      return;
    }

    this.patientFilesRepository.create({
      patientId: patient.id,
      type: this.newFileType(),
      fileName
    });

    this.newFileName.set('');
    this.toastService.success('Archivo adjunto agregado.');
  }

  protected removePatientFile(fileId: string): void {
    this.patientFilesRepository.remove(fileId);
    this.toastService.info('Archivo eliminado.');
  }

  protected selectTab(tab: PatientTab): void {
    if (this.isLockedTab(tab)) {
      this.toastService.warning(TOAST_COPY.plan.proOnly);
      return;
    }

    this.activeTab.set(tab);
  }

  protected isLockedTab(tab: PatientTab): boolean {
    return this.lockedTabs.includes(tab) && !this.planService.canUseAdvancedPatientProfile();
  }

  protected fileTypeLabel(type: PatientFileType): string {
    switch (type) {
      case 'study':
        return 'Estudio';
      case 'consent':
        return 'Consentimiento';
      case 'report':
        return 'Reporte';
      default:
        return 'Otro';
    }
  }

  constructor() {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'sessions') {
      this.activeTab.set('sessions');
    }
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
