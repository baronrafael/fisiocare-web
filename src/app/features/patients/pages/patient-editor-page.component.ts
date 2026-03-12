import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CareMode, Patient, PatientStatus } from '../../../core/models/patient.model';
import { TOAST_COPY } from '../../../core/notifications/toast-copy';
import { ToastService } from '../../../core/notifications/toast.service';
import { PlanService } from '../../../core/subscription/plan.service';
import { PatientsRepository } from '../../../mocks/repositories/patients.repository';

@Component({
  selector: 'fc-patient-editor-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="space-y-4">
      <header>
        <h1 class="text-xl font-semibold">{{ title() }}</h1>
        <p class="mt-1 text-sm text-slate-600">Formulario por bloques para mantener carga rapida en movil.</p>
      </header>

      <a routerLink="/app/patients" class="fc-link fc-link-sm inline-block">Volver a pacientes</a>

      <form class="fc-card space-y-4 p-4" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="space-y-2">
          <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Resumen</h2>
          <label class="block text-sm font-medium text-slate-700">
            Nombre completo
            <input class="fc-input mt-1" type="text" placeholder="Nombre y apellido" formControlName="fullName" />
          </label>
          @if (hasError('fullName', 'required')) {
            <p class="text-xs text-red-700">El nombre completo es obligatorio.</p>
          }

          <div class="grid gap-2 sm:grid-cols-2">
            <label class="text-sm font-medium text-slate-700">
              Edad
              <input class="fc-input mt-1" type="number" min="0" formControlName="age" />
            </label>
            @if (hasError('age', 'required') || hasError('age', 'min')) {
              <p class="text-xs text-red-700 sm:col-span-2">La edad debe ser un valor valido.</p>
            }
            <label class="text-sm font-medium text-slate-700">
              Estado
              <select class="fc-input mt-1" formControlName="status">
                <option value="active">Activo</option>
                <option value="paused">En pausa</option>
                <option value="discharged">Alta</option>
              </select>
            </label>
          </div>

          <label class="block text-sm font-medium text-slate-700">
            Diagnostico medico
            <textarea class="fc-input mt-1 min-h-20" placeholder="Describe el diagnostico" formControlName="diagnosis"></textarea>
          </label>
          @if (hasError('diagnosis', 'required')) {
            <p class="text-xs text-red-700">El diagnostico medico es obligatorio.</p>
          }

          <label class="block text-sm font-medium text-slate-700">
            Modalidad de atencion
            <select class="fc-input mt-1" formControlName="careMode">
              <option value="home">Domicilio</option>
              <option value="clinic">Consultorio</option>
            </select>
          </label>
        </div>

        @if (planService.canUseAdvancedPatientProfile()) {
          <button type="button" class="fc-btn fc-btn-ghost w-full text-left" (click)="showClinical.update((v) => !v)">
            {{ showClinical() ? 'Ocultar' : 'Mostrar' }} bloque clinico
          </button>

          @if (showClinical()) {
            <div class="space-y-2 rounded-xl border border-slate-200 p-3">
              <label class="block text-sm font-medium text-slate-700">
                Observaciones clinicas iniciales
                <textarea class="fc-input mt-1 min-h-20" formControlName="initialClinicalNotes"></textarea>
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Estudios complementarios
                <textarea class="fc-input mt-1 min-h-20" formControlName="studiesNotes"></textarea>
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="consentGiven" /> Consentimiento informado
              </label>
            </div>
          }

          <button type="button" class="fc-btn fc-btn-ghost w-full text-left" (click)="showContext.update((v) => !v)">
            {{ showContext() ? 'Ocultar' : 'Mostrar' }} bloque de contexto
          </button>

          @if (showContext()) {
            <div class="space-y-2 rounded-xl border border-slate-200 p-3">
              <label class="block text-sm font-medium text-slate-700">
                Telefono principal
                <input class="fc-input mt-1" type="text" formControlName="primaryPhone" />
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Telefono secundario
                <input class="fc-input mt-1" type="text" formControlName="secondaryPhone" />
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Direccion
                <input class="fc-input mt-1" type="text" formControlName="address" />
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Referencia
                <input class="fc-input mt-1" type="text" formControlName="reference" />
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="companionPresent" /> Acompanante presente
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Detalle acompanante
                <input class="fc-input mt-1" type="text" formControlName="companionDescription" />
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="petsPresent" /> Mascotas presentes
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Detalle mascotas
                <input class="fc-input mt-1" type="text" formControlName="petsDescription" />
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Espacio disponible para sesion
                <input class="fc-input mt-1" type="text" formControlName="availableSpace" />
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Observaciones contextuales
                <textarea class="fc-input mt-1 min-h-20" formControlName="contextualNotes"></textarea>
              </label>
            </div>
          }

          <button type="button" class="fc-btn fc-btn-ghost w-full text-left" (click)="showAdministrative.update((v) => !v)">
            {{ showAdministrative() ? 'Ocultar' : 'Mostrar' }} bloque administrativo
          </button>

          @if (showAdministrative()) {
            <div class="space-y-2 rounded-xl border border-slate-200 p-3">
              <label class="block text-sm font-medium text-slate-700">
                Modalidad de pago
                <select class="fc-input mt-1" formControlName="paymentMode">
                  <option value="">Seleccionar</option>
                  <option value="per-session">Por sesion</option>
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quincenal</option>
                  <option value="insurance">Seguro</option>
                </select>
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Observaciones de pago
                <textarea class="fc-input mt-1 min-h-20" formControlName="paymentNotes"></textarea>
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Nota rapida permanente
                <textarea class="fc-input mt-1 min-h-20" formControlName="persistentNotes"></textarea>
              </label>
            </div>
          }

          <button type="button" class="fc-btn fc-btn-ghost w-full text-left" (click)="showChecklist.update((v) => !v)">
            {{ showChecklist() ? 'Ocultar' : 'Mostrar' }} checklist de ingreso
          </button>

          @if (showChecklist()) {
            <div class="space-y-2 rounded-xl border border-slate-200 p-3">
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="checklistAddressConfirmed" /> Direccion confirmada
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="checklistAdequateSpace" /> Espacio adecuado para sesion
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="checklistCompanionPresent" /> Acompanante presente
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="checklistPetsPresent" /> Mascotas presentes
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" formControlName="checklistStudiesLoaded" /> Estudios cargados
              </label>
              <label class="block text-sm font-medium text-slate-700">
                Condiciones especiales del domicilio
                <textarea class="fc-input mt-1 min-h-20" formControlName="checklistSpecialConditions"></textarea>
              </label>
            </div>
          }
        } @else {
          <article class="fc-alert-warning text-sm">
            La ficha avanzada (clinico, contexto, administrativo y checklist) esta disponible en Pro.
          </article>
        }

        <div class="sticky bottom-18 rounded-xl bg-white/90 p-2 backdrop-blur md:static md:bg-transparent md:p-0">
          <button type="submit" class="fc-btn fc-btn-primary w-full" [disabled]="form.invalid">Guardar paciente (mock)</button>
        </div>

        @if (limitError()) {
          <p class="fc-alert-warning text-sm">
            Alcanzaste el limite del plan Free. Actualiza a Pro para crear mas pacientes.
          </p>
        }

        @if (saved()) {
          <p class="fc-alert-success text-sm">Paciente guardado correctamente.</p>
        }
      </form>
    </section>
  `
})
export class PatientEditorPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  protected readonly planService = inject(PlanService);
  private readonly patientsRepository = inject(PatientsRepository);

  protected readonly showClinical = signal(false);
  protected readonly showContext = signal(false);
  protected readonly showChecklist = signal(false);
  protected readonly showAdministrative = signal(false);
  protected readonly saved = signal(false);
  protected readonly limitError = signal(false);

  private readonly patientId = this.route.snapshot.paramMap.get('id');

  protected readonly form = this.fb.group({
    fullName: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(0)]],
    status: ['active' as PatientStatus, Validators.required],
    diagnosis: ['', Validators.required],
    careMode: ['home' as CareMode, Validators.required],
    primaryPhone: [''],
    secondaryPhone: [''],
    address: [''],
    reference: [''],
    initialClinicalNotes: [''],
    studiesNotes: [''],
    consentGiven: [false],
    companionPresent: [false],
    companionDescription: [''],
    petsPresent: [false],
    petsDescription: [''],
    availableSpace: [''],
    contextualNotes: [''],
    checklistAddressConfirmed: [false],
    checklistAdequateSpace: [false],
    checklistCompanionPresent: [false],
    checklistPetsPresent: [false],
    checklistStudiesLoaded: [false],
    checklistSpecialConditions: [''],
    paymentMode: [''],
    paymentNotes: [''],
    persistentNotes: ['']
  });

  protected readonly title = computed(() =>
    this.route.snapshot.paramMap.get('id') ? 'Editar paciente' : 'Crear paciente'
  );

  constructor() {
    if (!this.patientId) {
      return;
    }

    const patient = this.patientsRepository.findById(this.patientId);
    if (!patient) {
      return;
    }

    this.form.patchValue({
      fullName: patient.fullName,
      age: patient.age,
      status: patient.status,
      diagnosis: patient.diagnosis,
      careMode: patient.careMode,
      primaryPhone: patient.primaryPhone ?? '',
      secondaryPhone: patient.secondaryPhone ?? '',
      address: patient.address ?? '',
      reference: patient.reference ?? '',
      initialClinicalNotes: patient.initialClinicalNotes ?? '',
      studiesNotes: patient.studiesNotes ?? '',
      consentGiven: !!patient.consentGiven,
      companionPresent: !!patient.companion?.present,
      companionDescription: patient.companion?.description ?? '',
      petsPresent: !!patient.pets?.present,
      petsDescription: patient.pets?.description ?? '',
      availableSpace: patient.availableSpace ?? '',
      contextualNotes: patient.contextualNotes ?? '',
      checklistAddressConfirmed: !!patient.intakeChecklist?.addressConfirmed,
      checklistAdequateSpace: !!patient.intakeChecklist?.adequateSpace,
      checklistCompanionPresent: !!patient.intakeChecklist?.companionPresent,
      checklistPetsPresent: !!patient.intakeChecklist?.petsPresent,
      checklistStudiesLoaded: !!patient.intakeChecklist?.studiesLoaded,
      checklistSpecialConditions: patient.intakeChecklist?.specialHomeConditions ?? '',
      paymentMode: patient.paymentMode ?? '',
      paymentNotes: patient.paymentNotes ?? '',
      persistentNotes: patient.persistentNotes ?? ''
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (!this.patientId && this.planService.isPatientLimitReached(this.patientsRepository.patients().length)) {
      this.limitError.set(true);
      this.toastService.warning(TOAST_COPY.patient.limitReached);
      return;
    }

    this.limitError.set(false);
    const includeAdvancedProfile = this.planService.canUseAdvancedPatientProfile();

    const payload: Omit<Patient, 'id'> = {
      fullName: value.fullName?.trim() || 'Paciente sin nombre',
      age: value.age ?? 0,
      status: value.status ?? 'active',
      diagnosis: value.diagnosis?.trim() || 'Sin diagnostico',
      careMode: value.careMode ?? 'home',
      primaryPhone: includeAdvancedProfile ? this.optional(value.primaryPhone) : undefined,
      secondaryPhone: includeAdvancedProfile ? this.optional(value.secondaryPhone) : undefined,
      address: includeAdvancedProfile ? this.optional(value.address) : undefined,
      reference: includeAdvancedProfile ? this.optional(value.reference) : undefined,
      initialClinicalNotes: includeAdvancedProfile ? this.optional(value.initialClinicalNotes) : undefined,
      studiesNotes: includeAdvancedProfile ? this.optional(value.studiesNotes) : undefined,
      consentGiven: includeAdvancedProfile ? !!value.consentGiven : undefined,
      companion: includeAdvancedProfile
        ? {
            present: !!value.companionPresent,
            description: this.optional(value.companionDescription)
          }
        : undefined,
      pets: includeAdvancedProfile
        ? {
            present: !!value.petsPresent,
            description: this.optional(value.petsDescription)
          }
        : undefined,
      availableSpace: includeAdvancedProfile ? this.optional(value.availableSpace) : undefined,
      contextualNotes: includeAdvancedProfile ? this.optional(value.contextualNotes) : undefined,
      intakeChecklist: includeAdvancedProfile
        ? {
            addressConfirmed: !!value.checklistAddressConfirmed,
            adequateSpace: !!value.checklistAdequateSpace,
            companionPresent: !!value.checklistCompanionPresent,
            petsPresent: !!value.checklistPetsPresent,
            studiesLoaded: !!value.checklistStudiesLoaded,
            specialHomeConditions: this.optional(value.checklistSpecialConditions)
          }
        : undefined,
      paymentMode: includeAdvancedProfile ? (value.paymentMode as Patient['paymentMode']) || undefined : undefined,
      paymentNotes: includeAdvancedProfile ? this.optional(value.paymentNotes) : undefined,
      persistentNotes: includeAdvancedProfile ? this.optional(value.persistentNotes) : undefined,
      lastSessionAt: this.patientId
        ? this.patientsRepository.findById(this.patientId)?.lastSessionAt || 'Sin sesiones'
        : 'Sin sesiones'
    };

    if (this.patientId) {
      this.patientsRepository.update(this.patientId, payload);
      this.toastService.success(TOAST_COPY.patient.updated);
    } else {
      const newId = this.patientsRepository.nextId();
      this.patientsRepository.create({
        id: newId,
        ...payload
      });
      this.toastService.success(TOAST_COPY.patient.created);
      this.goToDetail(newId);
      return;
    }

    this.goToDetail(this.patientId);
  }

  private goToDetail(patientId: string): void {
    this.saved.set(true);
    setTimeout(() => {
      this.router.navigate(['/app/patients', patientId]);
    }, 350);
  }

  private optional(value: string | null | undefined): string | undefined {
    const sanitized = value?.trim();
    return sanitized ? sanitized : undefined;
  }

  protected hasError(controlName: string, errorKey: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorKey);
  }
}
