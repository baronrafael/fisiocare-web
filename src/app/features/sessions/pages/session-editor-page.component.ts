import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessionRecord, SessionType } from '../../../core/models/session.model';
import { TOAST_COPY } from '../../../core/notifications/toast-copy';
import { ToastService } from '../../../core/notifications/toast.service';
import { PlanService } from '../../../core/subscription/plan.service';
import { PatientsRepository } from '../../../mocks/repositories/patients.repository';
import { SessionsRepository } from '../../../mocks/repositories/sessions.repository';
import { TemplatesRepository } from '../../../mocks/repositories/templates.repository';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'fc-session-editor-page',
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent],
  template: `
    <section class="space-y-4">
      <header>
        <h1 class="text-xl font-semibold">{{ title() }}</h1>
        <p class="mt-1 text-sm text-slate-600">Registro rapido para no frenar el flujo clinico.</p>
      </header>

      <a routerLink="/app/patients" class="inline-block text-sm text-teal-700 hover:underline">Volver a pacientes</a>

      <form class="fc-card space-y-4 p-4" [formGroup]="form" (ngSubmit)="onSubmit()">
        <label class="block text-sm font-medium text-slate-700">
          Fecha
          <input class="fc-input mt-1" type="date" formControlName="sessionAt" />
        </label>
        @if (hasError('sessionAt', 'required')) {
          <p class="text-xs text-red-700">La fecha de sesion es obligatoria.</p>
        }

        <label class="block text-sm font-medium text-slate-700">
          Tipo de sesion
          <select class="fc-input mt-1" formControlName="type">
            <option value="physical">Fisica</option>
            <option value="cognitive">Cognitiva</option>
            <option value="mixed">Mixta</option>
          </select>
        </label>

        <div class="space-y-2 rounded-xl border border-slate-200 p-3">
          <p class="text-sm font-semibold text-slate-700">Carga rapida</p>
          @if (planService.canUseTemplates()) {
            <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
              <select class="fc-input" [value]="selectedTemplateId()" (change)="onTemplateChange($event)">
                <option value="">Seleccionar plantilla</option>
                @for (template of templates(); track template.id) {
                  <option [value]="template.id">{{ template.name }}</option>
                }
              </select>
              <button type="button" class="fc-btn fc-btn-ghost text-sm" [disabled]="!selectedTemplateId()" (click)="applyTemplate()">
                Aplicar
              </button>
            </div>
          } @else {
            <p class="rounded-lg bg-amber-50 p-2 text-xs text-amber-900">Las plantillas estan disponibles en Premium.</p>
          }

          <button type="button" class="fc-btn fc-btn-ghost w-full text-sm" [disabled]="!latestSession()" (click)="duplicateLastSession()">
            Duplicar ultima sesion
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-700">Actividades</p>
            <fc-button variant="ghost" size="sm" (click)="addActivity()">Agregar</fc-button>
          </div>

          <div formArrayName="activities" class="space-y-2">
            @for (activity of activityControls.controls; track $index) {
              <div class="rounded-xl border border-slate-200 p-3" [formGroupName]="$index">
                <div class="grid gap-2 sm:grid-cols-2">
                  <label class="text-sm text-slate-700">
                    Nombre
                    <input class="fc-input mt-1" type="text" formControlName="name" placeholder="Ej. Marcha asistida" />
                  </label>
                  @if (activity.get('name')?.touched && activity.get('name')?.hasError('required')) {
                    <p class="text-xs text-red-700 sm:col-span-2">Cada actividad debe tener un nombre.</p>
                  }
                  <label class="text-sm text-slate-700">
                    Tipo
                    <select class="fc-input mt-1" formControlName="type">
                      <option value="physical">Fisica</option>
                      <option value="cognitive">Cognitiva</option>
                    </select>
                  </label>
                  <label class="text-sm text-slate-700">
                    Series
                    <input class="fc-input mt-1" type="number" min="1" formControlName="sets" />
                  </label>
                  <label class="text-sm text-slate-700">
                    Repeticiones
                    <input class="fc-input mt-1" type="number" min="1" formControlName="reps" />
                  </label>
                  <label class="text-sm text-slate-700">
                    Tiempo (min)
                    <input class="fc-input mt-1" type="number" min="1" formControlName="durationMinutes" />
                  </label>
                </div>

                @if (activity.value.type === 'cognitive') {
                  <label class="mt-2 block text-sm text-slate-700">
                    Descripcion cognitiva
                    <textarea class="fc-input mt-1 min-h-16" formControlName="description" placeholder="Ej. memoria visual por bloques"></textarea>
                  </label>
                } @else {
                  <label class="mt-2 block text-sm text-slate-700">
                    Nota opcional
                    <input class="fc-input mt-1" type="text" formControlName="description" placeholder="Observacion breve" />
                  </label>
                }

                <div class="mt-2 flex flex-wrap gap-2 text-xs">
                  <button type="button" class="fc-btn fc-btn-ghost" [disabled]="$index === 0" (click)="moveActivityUp($index)">Subir</button>
                  <button type="button" class="fc-btn fc-btn-ghost" [disabled]="$index === activityControls.length - 1" (click)="moveActivityDown($index)">Bajar</button>
                </div>
                <button type="button" class="mt-2 text-sm text-red-700 hover:underline" (click)="removeActivity($index)">Eliminar actividad</button>
              </div>
            }
          </div>
        </div>

        <label class="block text-sm font-medium text-slate-700">
          Observaciones
          <textarea class="fc-input mt-1 min-h-20" placeholder="Como respondio el paciente?" formControlName="generalNotes"></textarea>
        </label>

        @if (planService.canUseAdvancedSessionFields()) {
          <button type="button" class="fc-btn fc-btn-ghost w-full text-left" (click)="showScales.update((v) => !v)">
            {{ showScales() ? 'Ocultar' : 'Mostrar' }} escalas clinicas
          </button>

          @if (showScales()) {
            <div class="grid gap-2 sm:grid-cols-2">
              <label class="text-sm text-slate-700">
                Escala de Borg
                <input class="fc-input mt-1" type="number" min="0" max="10" formControlName="borgScale" />
              </label>
              <label class="text-sm text-slate-700">
                Wong-Baker
                <input class="fc-input mt-1" type="number" min="0" max="10" formControlName="wongBakerScale" />
              </label>
            </div>
          }

          <button type="button" class="fc-btn fc-btn-ghost w-full text-left" (click)="showVitals.update((v) => !v)">
            {{ showVitals() ? 'Ocultar' : 'Mostrar' }} signos vitales
          </button>

          @if (showVitals()) {
            <div class="grid gap-2 sm:grid-cols-2">
              <label class="text-sm text-slate-700">
                PA pre esfuerzo
                <input class="fc-input mt-1" type="text" formControlName="prePa" placeholder="120/80" />
              </label>
              <label class="text-sm text-slate-700">
                FC pre esfuerzo
                <input class="fc-input mt-1" type="number" formControlName="preFc" />
              </label>
              <label class="text-sm text-slate-700">
                SpO2 pre esfuerzo
                <input class="fc-input mt-1" type="number" formControlName="preSpo2" />
              </label>
              <label class="text-sm text-slate-700">
                PA post esfuerzo
                <input class="fc-input mt-1" type="text" formControlName="postPa" placeholder="128/82" />
              </label>
              <label class="text-sm text-slate-700">
                FC post esfuerzo
                <input class="fc-input mt-1" type="number" formControlName="postFc" />
              </label>
              <label class="text-sm text-slate-700">
                SpO2 post esfuerzo
                <input class="fc-input mt-1" type="number" formControlName="postSpo2" />
              </label>
            </div>
          }

          <button type="button" class="fc-btn fc-btn-ghost w-full text-left" (click)="showEvaluations.update((v) => !v)">
            {{ showEvaluations() ? 'Ocultar' : 'Mostrar' }} evaluaciones periodicas
          </button>

          @if (showEvaluations()) {
            <div class="grid gap-2 sm:grid-cols-3">
              <label class="text-sm text-slate-700">
                RPE
                <input class="fc-input mt-1" type="number" formControlName="rpe" />
              </label>
              <label class="text-sm text-slate-700">
                RIR
                <input class="fc-input mt-1" type="number" formControlName="rir" />
              </label>
              <label class="text-sm text-slate-700">
                RM
                <input class="fc-input mt-1" type="number" formControlName="rm" />
              </label>
            </div>
          }
        } @else {
          <article class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Escalas clinicas, signos vitales y evaluaciones periodicas estan disponibles en Premium.
          </article>
        }

        <div class="sticky bottom-18 rounded-xl bg-white/90 p-2 backdrop-blur md:static md:bg-transparent md:p-0">
          <fc-button type="submit" [block]="true" [disabled]="form.invalid || activityControls.length === 0">Guardar sesion (mock)</fc-button>
        </div>

        @if (saved()) {
          <p class="rounded-lg bg-teal-50 p-3 text-sm text-teal-900">Sesion mock guardada correctamente.</p>
        }
      </form>
    </section>
  `
})
export class SessionEditorPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly sessionsRepository = inject(SessionsRepository);
  private readonly patientsRepository = inject(PatientsRepository);
  private readonly templatesRepository = inject(TemplatesRepository);

  protected readonly planService = inject(PlanService);
  protected readonly showScales = signal(false);
  protected readonly showVitals = signal(false);
  protected readonly showEvaluations = signal(false);
  protected readonly saved = signal(false);
  protected readonly selectedTemplateId = signal('');

  protected readonly form = this.fb.group({
    sessionAt: [this.today(), Validators.required],
    type: ['physical' as SessionType, Validators.required],
    generalNotes: [''],
    activities: this.fb.array([this.createActivity()]),
    borgScale: [null as number | null],
    wongBakerScale: [null as number | null],
    prePa: [''],
    preFc: [null as number | null],
    preSpo2: [null as number | null],
    postPa: [''],
    postFc: [null as number | null],
    postSpo2: [null as number | null],
    rpe: [null as number | null],
    rir: [null as number | null],
    rm: [null as number | null]
  });

  protected readonly activityControls = this.form.controls.activities as FormArray;

  protected readonly title = computed(() =>
    this.route.snapshot.paramMap.get('sessionId') ? 'Editar sesion' : 'Nueva sesion'
  );

  private readonly patientId = this.route.snapshot.paramMap.get('id');
  private readonly sessionId = this.route.snapshot.paramMap.get('sessionId');

  protected readonly templates = computed(() => this.templatesRepository.templates());

  protected readonly latestSession = computed(() => {
    if (!this.patientId) {
      return undefined;
    }
    return this.sessionsRepository.findByPatientId(this.patientId)[0];
  });

  constructor() {
    const sessionId = this.sessionId;
    if (!sessionId) {
      return;
    }

    const existingSession = this.sessionsRepository.findById(sessionId);
    if (!existingSession) {
      return;
    }

    this.form.patchValue({
      sessionAt: existingSession.sessionAt,
      type: existingSession.type,
      generalNotes: existingSession.generalNotes ?? '',
      borgScale: existingSession.borgScale ?? null,
      wongBakerScale: existingSession.wongBakerScale ?? null,
      prePa: existingSession.preEffort?.pa ?? '',
      preFc: existingSession.preEffort?.fc ?? null,
      preSpo2: existingSession.preEffort?.spo2 ?? null,
      postPa: existingSession.postEffort?.pa ?? '',
      postFc: existingSession.postEffort?.fc ?? null,
      postSpo2: existingSession.postEffort?.spo2 ?? null,
      rpe: existingSession.evaluations?.rpe ?? null,
      rir: existingSession.evaluations?.rir ?? null,
      rm: existingSession.evaluations?.rm ?? null
    });

    this.replaceActivitiesFromSession(existingSession);
  }

  protected onTemplateChange(event: Event): void {
    this.selectedTemplateId.set((event.target as HTMLSelectElement).value);
  }

  protected applyTemplate(): void {
    if (!this.planService.canUseTemplates()) {
      this.toastService.warning(TOAST_COPY.plan.premiumOnly);
      return;
    }

    const template = this.templatesRepository.findById(this.selectedTemplateId());
    if (!template) {
      return;
    }

    this.form.patchValue({
      type: template.defaultSessionType,
      generalNotes: template.notesStructure ?? this.form.controls.generalNotes.value,
      borgScale: template.includeBorg ? this.form.controls.borgScale.value ?? 0 : null,
      wongBakerScale: template.includeWongBaker ? this.form.controls.wongBakerScale.value ?? 0 : null
    });

    this.showScales.set(!!template.includeBorg || !!template.includeWongBaker);
    this.showVitals.set(!!template.includeVitals);

    this.activityControls.clear();
    for (const activity of template.suggestedActivities) {
      this.activityControls.push(
        this.fb.group({
          name: [activity.name, Validators.required],
          type: [activity.type, Validators.required],
          sets: [activity.sets ?? null],
          reps: [activity.reps ?? null],
          durationMinutes: [null as number | null],
          description: [activity.description ?? '']
        })
      );
    }

    if (this.activityControls.length === 0) {
      this.activityControls.push(this.createActivity());
    }

    this.toastService.info('Plantilla aplicada a la sesion.');
  }

  protected duplicateLastSession(): void {
    const session = this.latestSession();
    if (!session) {
      return;
    }

    this.form.patchValue({
      type: session.type,
      generalNotes: session.generalNotes ?? '',
      borgScale: session.borgScale ?? null,
      wongBakerScale: session.wongBakerScale ?? null,
      prePa: session.preEffort?.pa ?? '',
      preFc: session.preEffort?.fc ?? null,
      preSpo2: session.preEffort?.spo2 ?? null,
      postPa: session.postEffort?.pa ?? '',
      postFc: session.postEffort?.fc ?? null,
      postSpo2: session.postEffort?.spo2 ?? null,
      rpe: session.evaluations?.rpe ?? null,
      rir: session.evaluations?.rir ?? null,
      rm: session.evaluations?.rm ?? null
    });

    this.showScales.set(!!session.borgScale || !!session.wongBakerScale);
    this.showVitals.set(!!session.preEffort || !!session.postEffort);
    this.showEvaluations.set(!!session.evaluations);
    this.replaceActivitiesFromSession(session);
    this.toastService.info('Se cargo la ultima sesion para editar rapido.');
  }

  protected addActivity(): void {
    this.activityControls.push(this.createActivity());
  }

  protected moveActivityUp(index: number): void {
    if (index <= 0) {
      return;
    }

    const control = this.activityControls.at(index);
    this.activityControls.removeAt(index);
    this.activityControls.insert(index - 1, control);
  }

  protected moveActivityDown(index: number): void {
    if (index >= this.activityControls.length - 1) {
      return;
    }

    const control = this.activityControls.at(index);
    this.activityControls.removeAt(index);
    this.activityControls.insert(index + 1, control);
  }

  protected removeActivity(index: number): void {
    if (this.activityControls.length === 1) {
      return;
    }

    this.activityControls.removeAt(index);
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.activityControls.length === 0 || !this.patientId) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const includeAdvanced = this.planService.canUseAdvancedSessionFields();

    const payload = {
      patientId: this.patientId,
      sessionAt: value.sessionAt ?? this.today(),
      type: value.type ?? ('physical' as SessionType),
      generalNotes: value.generalNotes || undefined,
      activities: this.activityControls.controls.map((activity, index) => ({
        id: `a-${Date.now()}-${index}`,
        name: activity.value.name?.trim() || 'Actividad sin nombre',
        type: activity.value.type ?? 'physical',
        sets: activity.value.sets ?? undefined,
        reps: activity.value.reps ?? undefined,
        durationMinutes: activity.value.durationMinutes ?? undefined,
        description: activity.value.description?.trim() || undefined
      })),
      borgScale: includeAdvanced ? value.borgScale ?? undefined : undefined,
      wongBakerScale: includeAdvanced ? value.wongBakerScale ?? undefined : undefined,
      preEffort:
        includeAdvanced && (value.prePa || value.preFc || value.preSpo2)
          ? {
              pa: value.prePa || undefined,
              fc: value.preFc ?? undefined,
              spo2: value.preSpo2 ?? undefined
            }
          : undefined,
      postEffort:
        includeAdvanced && (value.postPa || value.postFc || value.postSpo2)
          ? {
              pa: value.postPa || undefined,
              fc: value.postFc ?? undefined,
              spo2: value.postSpo2 ?? undefined
            }
          : undefined,
      evaluations:
        includeAdvanced && (value.rpe || value.rir || value.rm)
          ? {
              rpe: value.rpe ?? undefined,
              rir: value.rir ?? undefined,
              rm: value.rm ?? undefined
            }
          : undefined
    };

    if (this.sessionId) {
      this.sessionsRepository.update(this.sessionId, payload);
      this.toastService.success(TOAST_COPY.session.updated);
    } else {
      this.sessionsRepository.create({
        id: this.sessionsRepository.nextId(),
        ...payload
      });
      this.toastService.success(TOAST_COPY.session.created);
    }

    this.patientsRepository.touchLastSession(this.patientId, payload.sessionAt);

    this.saved.set(true);

    setTimeout(() => {
      this.router.navigate(['/app/patients', this.patientId], {
        queryParams: { tab: 'sessions' }
      });
    }, 350);
  }

  protected hasError(controlName: string, errorKey: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorKey);
  }

  private createActivity() {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['physical', Validators.required],
      sets: [null as number | null],
      reps: [null as number | null],
      durationMinutes: [null as number | null],
      description: ['']
    });
  }

  private replaceActivitiesFromSession(session: SessionRecord): void {
    this.activityControls.clear();
    for (const activity of session.activities) {
      this.activityControls.push(
        this.fb.group({
          name: [activity.name, Validators.required],
          type: [activity.type, Validators.required],
          sets: [activity.sets ?? null],
          reps: [activity.reps ?? null],
          durationMinutes: [activity.durationMinutes ?? null],
          description: [activity.description ?? '']
        })
      );
    }

    if (this.activityControls.length === 0) {
      this.activityControls.push(this.createActivity());
    }
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
