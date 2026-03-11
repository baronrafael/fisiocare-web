import { Component, input } from '@angular/core';
import { SessionRecord } from '../../../core/models/session.model';

@Component({
  selector: 'fc-session-timeline',
  template: `
    <div class="space-y-3">
      @for (session of sessions(); track session.id) {
        <article class="fc-card p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold">{{ session.sessionAt }}</p>
              <p class="text-xs uppercase tracking-[0.12em] text-slate-500">{{ session.type }}</p>
            </div>
            <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {{ session.activities.length }} actividades
            </span>
          </div>

          @if (session.generalNotes) {
            <p class="mt-3 text-sm text-slate-700">{{ session.generalNotes }}</p>
          }

          <div class="mt-3 flex flex-wrap gap-2 text-xs">
            @if (session.borgScale !== undefined) {
              <span class="rounded-full bg-teal-50 px-2 py-1 font-semibold text-teal-800">Borg: {{ session.borgScale }}</span>
            }
            @if (session.wongBakerScale !== undefined) {
              <span class="rounded-full bg-teal-50 px-2 py-1 font-semibold text-teal-800">Wong-Baker: {{ session.wongBakerScale }}</span>
            }
            @if (session.evaluations?.rpe !== undefined) {
              <span class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">RPE: {{ session.evaluations?.rpe }}</span>
            }
            @if (session.evaluations?.rir !== undefined) {
              <span class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">RIR: {{ session.evaluations?.rir }}</span>
            }
            @if (session.evaluations?.rm !== undefined) {
              <span class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">RM: {{ session.evaluations?.rm }}</span>
            }
          </div>

          @if (session.preEffort || session.postEffort) {
            <div class="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
              <div class="rounded-lg bg-slate-50 p-2">
                <p class="font-semibold">Pre esfuerzo</p>
                <p>PA: {{ session.preEffort?.pa || '-' }}</p>
                <p>FC: {{ session.preEffort?.fc ?? '-' }}</p>
                <p>SpO2: {{ session.preEffort?.spo2 ?? '-' }}</p>
              </div>
              <div class="rounded-lg bg-slate-50 p-2">
                <p class="font-semibold">Post esfuerzo</p>
                <p>PA: {{ session.postEffort?.pa || '-' }}</p>
                <p>FC: {{ session.postEffort?.fc ?? '-' }}</p>
                <p>SpO2: {{ session.postEffort?.spo2 ?? '-' }}</p>
              </div>
            </div>
          }

          <ul class="mt-3 space-y-1 text-sm text-slate-600">
            @for (activity of session.activities; track activity.id) {
              <li>
                - {{ activity.name }}
                @if (activity.sets && activity.reps) {
                  <span> · {{ activity.sets }}x{{ activity.reps }}</span>
                }
                @if (activity.durationMinutes) {
                  <span> · {{ activity.durationMinutes }} min</span>
                }
                @if (activity.description) {
                  <span> · {{ activity.description }}</span>
                }
              </li>
            }
          </ul>
        </article>
      } @empty {
        <article class="fc-card p-6 text-center text-sm text-slate-600">
          Aun no hay sesiones registradas para este paciente.
        </article>
      }
    </div>
  `
})
export class SessionTimelineComponent {
  readonly sessions = input.required<SessionRecord[]>();
}
