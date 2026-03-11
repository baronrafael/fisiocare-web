import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/notifications/toast.service';
import { PlanService } from '../../../core/subscription/plan.service';
import { ContactLogsRepository } from '../../../mocks/repositories/contact-logs.repository';
import { PatientsRepository } from '../../../mocks/repositories/patients.repository';
import { SessionsRepository } from '../../../mocks/repositories/sessions.repository';

@Component({
  selector: 'fc-pdf-preview-page',
  imports: [RouterLink],
  template: `
    <section class="space-y-4">
      <header>
        <h1 class="text-xl font-semibold">Preview PDF</h1>
        <p class="mt-1 text-sm text-slate-600">Informe clinico profesional, listo para compartir con medico, familiar o seguro.</p>
      </header>

      @if (!planService.canUsePdfExport()) {
        <article class="fc-card border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          La exportacion en PDF es una funcionalidad Premium.
          <a routerLink="/app/account" class="ml-2 font-semibold underline">Actualizar plan</a>
        </article>
      } @else if (patient(); as item) {
        <div class="fc-print-hide mx-auto flex w-full max-w-[920px] justify-end gap-2">
          <button class="fc-btn fc-btn-ghost text-sm" type="button" (click)="printDocument()">Imprimir</button>
          <button class="fc-btn fc-btn-primary text-sm" type="button" (click)="downloadMockPdf()">Descargar PDF (mock)</button>
        </div>

        <article class="fc-a4-document mx-auto w-full max-w-[920px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl">
          <div class="border-b border-slate-200 bg-slate-50 px-8 py-6">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FisioCare</p>
            <h2 class="mt-2 text-xl font-semibold">Informe de evolucion fisioterapeutica</h2>
            <p class="mt-1 text-sm text-slate-600">Paciente: {{ item.fullName }}</p>
            <p class="mt-1 text-sm text-slate-600">Diagnostico principal: {{ item.diagnosis }}</p>
            <p class="mt-1 text-xs text-slate-500">Fecha de emision: {{ today }}</p>
          </div>

          <div class="space-y-6 px-8 py-6">
            <section class="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <p><strong>Estado actual:</strong> {{ item.status }}</p>
                <p><strong>Modalidad de atencion:</strong> {{ item.careMode === 'home' ? 'Domicilio' : 'Consultorio' }}</p>
                <p><strong>Ultima sesion registrada:</strong> {{ item.lastSessionAt }}</p>
              </div>
              <div>
                <p><strong>Telefono principal:</strong> {{ item.primaryPhone || 'No registrado' }}</p>
                <p><strong>Direccion:</strong> {{ item.address || 'No registrada' }}</p>
                <p><strong>Observacion permanente:</strong> {{ item.persistentNotes || 'Sin registro' }}</p>
              </div>
            </section>

            <section class="space-y-2 border-t border-slate-200 pt-4">
              <h3 class="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Historial de sesiones</h3>
              @for (session of sessions(); track session.id) {
                <div class="rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                  <div class="flex items-center justify-between gap-2">
                    <p class="font-semibold">{{ session.sessionAt }} · {{ session.type }}</p>
                    <span class="text-xs text-slate-500">{{ session.activities.length }} actividades</span>
                  </div>

                  @if (session.generalNotes) {
                    <p class="mt-1">Respuesta observada: {{ session.generalNotes }}</p>
                  }

                  <ul class="mt-2 list-disc pl-5 text-xs">
                    @for (activity of session.activities; track activity.id) {
                      <li>
                        {{ activity.name }}
                        @if (activity.sets && activity.reps) {
                          <span> ({{ activity.sets }}x{{ activity.reps }})</span>
                        }
                        @if (activity.description) {
                          <span> - {{ activity.description }}</span>
                        }
                      </li>
                    }
                  </ul>

                  <p class="mt-2 text-xs text-slate-600">
                    Escalas - Borg: {{ session.borgScale ?? '-' }} | Wong-Baker: {{ session.wongBakerScale ?? '-' }}
                  </p>
                  <p class="text-xs text-slate-600">
                    Signos - Pre (PA {{ session.preEffort?.pa || '-' }}, FC {{ session.preEffort?.fc ?? '-' }}, SpO2 {{ session.preEffort?.spo2 ?? '-' }})
                    | Post (PA {{ session.postEffort?.pa || '-' }}, FC {{ session.postEffort?.fc ?? '-' }}, SpO2 {{ session.postEffort?.spo2 ?? '-' }})
                  </p>
                </div>
              } @empty {
                <p class="text-sm text-slate-500">No hay sesiones registradas.</p>
              }
            </section>

            <section class="space-y-2 border-t border-slate-200 pt-4">
              <h3 class="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Eventos administrativos y de contacto</h3>
              @for (log of contactLogs(); track log.id) {
                <p class="text-sm text-slate-700">{{ log.occurredAt }} - {{ log.description }}</p>
              } @empty {
                <p class="text-sm text-slate-500">Sin eventos administrativos registrados.</p>
              }
            </section>

            <section class="border-t border-slate-200 pt-4 text-xs text-slate-500">
              <p>Documento generado desde FisioCare (version mock).</p>
              <p>Este formato ilustra la estructura final de exportacion PDF del MVP.</p>
            </section>
          </div>

          <div class="border-t border-slate-200 bg-slate-50 px-8 py-3 text-xs text-slate-500">
            Informe de uso clinico interno y comunicacion profesional.
          </div>
        </article>

        <div class="fc-print-hide mx-auto mt-2 max-w-[920px] rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">
          Preview estructurado mock. La siguiente etapa conecta la exportacion PDF real desde backend.
        </div>
      } @else {
        <article class="fc-card p-6 text-center text-sm text-slate-600">Paciente no encontrado.</article>
      }
    </section>
  `
})
export class PdfPreviewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly patientsRepository = inject(PatientsRepository);
  private readonly sessionsRepository = inject(SessionsRepository);
  private readonly contactLogsRepository = inject(ContactLogsRepository);
  private readonly toastService = inject(ToastService);
  protected readonly planService = inject(PlanService);
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected readonly patient = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.patientsRepository.findById(id) : undefined;
  });

  protected readonly sessions = computed(() => {
    const patient = this.patient();
    return patient ? this.sessionsRepository.findByPatientId(patient.id) : [];
  });

  protected readonly contactLogs = computed(() => {
    const patient = this.patient();
    return patient ? this.contactLogsRepository.findByPatientId(patient.id) : [];
  });

  protected downloadMockPdf(): void {
    this.toastService.info('Descarga PDF mock disponible al conectar backend.');
  }

  protected printDocument(): void {
    window.print();
  }
}
