import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SessionTemplate } from '../../../core/models/template.model';
import { ToastService } from '../../../core/notifications/toast.service';
import { PlanService } from '../../../core/subscription/plan.service';
import { TemplatesRepository } from '../../../mocks/repositories/templates.repository';

@Component({
  selector: 'fc-templates-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="space-y-4">
      <header class="flex items-end justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold">Plantillas</h1>
          <p class="mt-1 text-sm text-slate-600">Estructuras reutilizables para acelerar el registro.</p>
        </div>
        <button
          class="fc-btn fc-btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          [disabled]="!planService.canUseTemplates()"
          (click)="startCreate()"
        >
          Nueva plantilla
        </button>
      </header>

      @if (!planService.canUseTemplates()) {
        <article class="fc-alert-warning-compact text-xs">
          Las plantillas son una funcionalidad Pro. Actualiza tu plan para crear y reutilizar estructuras de sesion.
          <a routerLink="/app/account" class="fc-link ml-2 font-semibold">Ver planes</a>
        </article>
      }

      @if (planService.canUseTemplates() && editorOpen()) {
        <form class="fc-card space-y-3 p-4" [formGroup]="form" (ngSubmit)="saveTemplate()">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-semibold">{{ editingTemplateId() ? 'Editar plantilla' : 'Nueva plantilla' }}</p>
            <button type="button" class="text-xs font-semibold text-slate-600 hover:underline" (click)="cancelEdit()">Cancelar</button>
          </div>

          <label class="block text-sm text-slate-700">
            Nombre
            <input class="fc-input mt-1" type="text" formControlName="name" placeholder="Ej. Seguimiento estandar" />
          </label>

          <label class="block text-sm text-slate-700">
            Tipo de sesion por defecto
            <select class="fc-input mt-1" formControlName="defaultSessionType">
              <option value="physical">Fisica</option>
              <option value="cognitive">Cognitiva</option>
              <option value="mixed">Mixta</option>
            </select>
          </label>

          <label class="block text-sm text-slate-700">
            Estructura de observaciones
            <textarea class="fc-input mt-1 min-h-20" formControlName="notesStructure"></textarea>
          </label>

          <label class="block text-sm text-slate-700">
            Actividades sugeridas
            <textarea class="fc-input mt-1 min-h-20" formControlName="activitiesText" placeholder="Una por linea. Ej: Marcha asistida | physical | 3 | 8"></textarea>
          </label>

          <div class="grid gap-2 sm:grid-cols-3 text-sm text-slate-700">
            <label class="inline-flex items-center gap-2"><input type="checkbox" formControlName="includeBorg" /> Borg</label>
            <label class="inline-flex items-center gap-2"><input type="checkbox" formControlName="includeWongBaker" /> Wong-Baker</label>
            <label class="inline-flex items-center gap-2"><input type="checkbox" formControlName="includeVitals" /> Signos vitales</label>
          </div>

          <button type="submit" class="fc-btn fc-btn-primary w-full" [disabled]="form.invalid">Guardar plantilla</button>
        </form>
      }

      <div class="grid gap-3">
        @for (template of templates(); track template.id) {
          <article class="fc-card p-4" [class.opacity-60]="!planService.canUseTemplates()">
            <h2 class="font-semibold">{{ template.name }}</h2>
            <p class="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{{ template.defaultSessionType }}</p>
            <p class="mt-1 text-sm text-slate-600">{{ template.description }}</p>

            @if (planService.canUseTemplates()) {
              <div class="mt-3 flex gap-2">
                <button type="button" class="fc-btn fc-btn-ghost text-sm" (click)="startEdit(template.id)">Editar</button>
                <button type="button" class="fc-btn text-sm bg-red-50 text-red-700" (click)="deleteTemplate(template.id)">Eliminar</button>
              </div>
            }
          </article>
        }
      </div>
    </section>
  `
})
export class TemplatesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly templatesRepository = inject(TemplatesRepository);
  private readonly toastService = inject(ToastService);
  protected readonly planService = inject(PlanService);

  protected readonly editorOpen = signal(false);
  protected readonly editingTemplateId = signal<string | null>(null);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    defaultSessionType: ['physical', Validators.required],
    notesStructure: [''],
    activitiesText: [''],
    includeBorg: [false],
    includeWongBaker: [false],
    includeVitals: [false]
  });

  protected readonly templates = computed(() =>
    this.templatesRepository.templates().map((template) => ({
      ...template,
      description: template.notesStructure || 'Sin estructura definida.'
    }))
  );

  protected startCreate(): void {
    if (!this.planService.canUseTemplates()) {
      return;
    }

    this.editorOpen.set(true);
    this.editingTemplateId.set(null);
    this.form.reset({
      name: '',
      defaultSessionType: 'physical',
      notesStructure: '',
      activitiesText: '',
      includeBorg: false,
      includeWongBaker: false,
      includeVitals: false
    });
  }

  protected startEdit(templateId: string): void {
    const template = this.templatesRepository.findById(templateId);
    if (!template) {
      return;
    }

    this.editorOpen.set(true);
    this.editingTemplateId.set(templateId);
    this.form.patchValue({
      name: template.name,
      defaultSessionType: template.defaultSessionType,
      notesStructure: template.notesStructure ?? '',
      activitiesText: template.suggestedActivities.map((activity) => this.stringifyActivity(activity)).join('\n'),
      includeBorg: !!template.includeBorg,
      includeWongBaker: !!template.includeWongBaker,
      includeVitals: !!template.includeVitals
    });
  }

  protected saveTemplate(): void {
    if (this.form.invalid || !this.planService.canUseTemplates()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: Omit<SessionTemplate, 'id'> = {
      name: value.name?.trim() || 'Plantilla sin nombre',
      defaultSessionType: (value.defaultSessionType as SessionTemplate['defaultSessionType']) ?? 'physical',
      notesStructure: value.notesStructure?.trim() || undefined,
      suggestedActivities: this.parseActivities(value.activitiesText),
      includeBorg: !!value.includeBorg,
      includeWongBaker: !!value.includeWongBaker,
      includeVitals: !!value.includeVitals
    };

    const templateId = this.editingTemplateId();
    if (templateId) {
      this.templatesRepository.update(templateId, payload);
      this.toastService.success('Plantilla actualizada.');
    } else {
      this.templatesRepository.create(payload);
      this.toastService.success('Plantilla creada.');
    }

    this.cancelEdit();
  }

  protected deleteTemplate(templateId: string): void {
    this.templatesRepository.remove(templateId);
    this.toastService.info('Plantilla eliminada.');
    if (this.editingTemplateId() === templateId) {
      this.cancelEdit();
    }
  }

  protected cancelEdit(): void {
    this.editorOpen.set(false);
    this.editingTemplateId.set(null);
  }

  private parseActivities(text: string | null | undefined): SessionTemplate['suggestedActivities'] {
    const lines = (text ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.map((line) => {
      const [nameRaw, typeRaw, setsRaw, repsRaw] = line.split('|').map((item) => item?.trim());
      return {
        name: nameRaw || 'Actividad sugerida',
        type: typeRaw === 'cognitive' ? 'cognitive' : 'physical',
        sets: setsRaw ? Number(setsRaw) : undefined,
        reps: repsRaw ? Number(repsRaw) : undefined
      };
    });
  }

  private stringifyActivity(activity: SessionTemplate['suggestedActivities'][number]): string {
    return [activity.name, activity.type, activity.sets ?? '', activity.reps ?? ''].join(' | ');
  }
}
