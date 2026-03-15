import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { API_BASE_URL } from '../../core/config/api.config';
import { Patient } from '../../core/models/patient.model';

interface ApiPatient {
  id: number;
  full_name: string;
  age: number;
  main_phone?: string;
  secondary_phone?: string;
  address?: string;
  reference?: string;
  attention_type?: string;
  medical_diagnosis: string;
  initial_observations?: string;
  informed_consent?: boolean;
  companion?: boolean;
  companion_description?: string;
  pets?: boolean;
  pets_description?: string;
  session_space?: string;
  patient_status?: string;
  payment_type?: string;
  payment_notes?: string;
  permanent_notes?: string;
}

interface ApiPatientsListResponse {
  results?: ApiPatient[];
}

type ApiPatientPayload = {
  full_name: string;
  age: number;
  main_phone: string;
  secondary_phone?: string;
  address?: string;
  reference?: string;
  attention_type: 'domicile' | 'clinic';
  medical_diagnosis: string;
  initial_observations?: string;
  informed_consent?: boolean;
  companion?: boolean;
  companion_description?: string;
  pets?: boolean;
  pets_description?: string;
  session_space?: string;
  patient_status: 'active' | 'paused' | 'discharged';
  payment_type?: 'per_session' | 'weekly' | 'biweekly' | 'insurance';
  payment_notes?: string;
  permanent_notes?: string;
  user?: number;
};

@Injectable({ providedIn: 'root' })
export class PatientsRepository {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly patientsSignal = signal<Patient[]>([]);
  private readonly loadedSignal = signal(false);

  readonly patients = this.patientsSignal.asReadonly();
  readonly isLoaded = this.loadedSignal.asReadonly();
  readonly total = computed(() => this.patientsSignal().length);

  loadAll(force = false): Observable<Patient[]> {
    if (this.loadedSignal() && !force) {
      return of(this.patientsSignal());
    }

    return this.http.get<ApiPatient[] | ApiPatientsListResponse>(`${API_BASE_URL}/patients/`).pipe(
      map((response) => this.extractPatientsList(response).map((item) => this.mapApiPatient(item))),
      tap((patients) => {
        this.patientsSignal.set(patients);
        this.loadedSignal.set(true);
      })
    );
  }

  loadById(id: string): Observable<Patient> {
    return this.http.get<ApiPatient>(`${API_BASE_URL}/patients/${id}/`).pipe(
      map((apiPatient) => this.mapApiPatient(apiPatient)),
      tap((patient) => this.upsertPatient(patient))
    );
  }

  findById(id: string): Patient | undefined {
    return this.patientsSignal().find((item) => item.id === id);
  }

  create(payload: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<ApiPatient>(`${API_BASE_URL}/patients/`, this.mapPatientPayload(payload)).pipe(
      map((apiPatient) => this.mapApiPatient(apiPatient)),
      tap((patient) => {
        this.patientsSignal.update((patients) => [patient, ...patients]);
      })
    );
  }

  update(patientId: string, payload: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.patch<ApiPatient>(`${API_BASE_URL}/patients/${patientId}/`, this.mapPatientPayload(payload)).pipe(
      map((apiPatient) => this.mapApiPatient(apiPatient)),
      tap((patient) => this.upsertPatient(patient))
    );
  }

  delete(patientId: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/patients/${patientId}/`).pipe(
      map(() => void 0),
      tap(() => {
        this.patientsSignal.update((patients) => patients.filter((patient) => patient.id !== patientId));
      })
    );
  }

  touchLastSession(patientId: string, sessionAt: string): void {
    this.patientsSignal.update((patients) =>
      patients.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              lastSessionAt: sessionAt
            }
          : patient
      )
    );
  }

  private extractPatientsList(response: ApiPatient[] | ApiPatientsListResponse): ApiPatient[] {
    if (Array.isArray(response)) {
      return response;
    }

    return response.results ?? [];
  }

  private mapApiPatient(apiPatient: ApiPatient): Patient {
    return {
      id: String(apiPatient.id),
      fullName: apiPatient.full_name,
      age: apiPatient.age,
      primaryPhone: this.optional(apiPatient.main_phone),
      secondaryPhone: this.optional(apiPatient.secondary_phone),
      address: this.optional(apiPatient.address),
      reference: this.optional(apiPatient.reference),
      careMode: this.mapCareMode(apiPatient.attention_type),
      status: this.mapStatus(apiPatient.patient_status),
      diagnosis: apiPatient.medical_diagnosis,
      initialClinicalNotes: this.optional(apiPatient.initial_observations),
      consentGiven: apiPatient.informed_consent,
      companion:
        apiPatient.companion !== undefined
          ? {
              present: !!apiPatient.companion,
              description: this.optional(apiPatient.companion_description)
            }
          : undefined,
      pets:
        apiPatient.pets !== undefined
          ? {
              present: !!apiPatient.pets,
              description: this.optional(apiPatient.pets_description)
            }
          : undefined,
      availableSpace: this.optional(apiPatient.session_space),
      paymentMode: this.mapPaymentMode(apiPatient.payment_type),
      paymentNotes: this.optional(apiPatient.payment_notes),
      persistentNotes: this.optional(apiPatient.permanent_notes),
      // TODO(backend): expose patient last session date to replace this placeholder value.
      lastSessionAt: 'Sin sesiones'
      // TODO(backend): add fields for studiesNotes/contextualNotes/intakeChecklist in Patient API.
    };
  }

  private mapPatientPayload(payload: Omit<Patient, 'id'>): ApiPatientPayload {
    const userIdRaw = this.authService.user()?.id;
    const userId = userIdRaw ? Number(userIdRaw) : Number.NaN;

    return {
      full_name: payload.fullName,
      age: payload.age,
      main_phone: payload.primaryPhone?.trim() || '',
      secondary_phone: this.optional(payload.secondaryPhone),
      address: this.optional(payload.address),
      reference: this.optional(payload.reference),
      attention_type: payload.careMode === 'home' ? 'domicile' : 'clinic',
      medical_diagnosis: payload.diagnosis,
      initial_observations: this.optional(payload.initialClinicalNotes),
      informed_consent: payload.consentGiven,
      companion: payload.companion?.present,
      companion_description: this.optional(payload.companion?.description),
      pets: payload.pets?.present,
      pets_description: this.optional(payload.pets?.description),
      session_space: this.optional(payload.availableSpace),
      patient_status: payload.status,
      payment_type: this.mapPaymentModeToApi(payload.paymentMode),
      payment_notes: this.optional(payload.paymentNotes),
      permanent_notes: this.optional(payload.persistentNotes),
      // TODO(backend): make user assignment implicit from auth token so frontend does not need to send user id.
      user: Number.isFinite(userId) ? userId : undefined
    };
  }

  private upsertPatient(patient: Patient): void {
    const current = this.patientsSignal();
    const index = current.findIndex((item) => item.id === patient.id);
    if (index === -1) {
      this.patientsSignal.set([patient, ...current]);
      return;
    }

    const next = [...current];
    next[index] = patient;
    this.patientsSignal.set(next);
  }

  private mapCareMode(value: string | undefined): Patient['careMode'] {
    return value === 'domicile' ? 'home' : 'clinic';
  }

  private mapStatus(value: string | undefined): Patient['status'] {
    if (value === 'paused' || value === 'discharged') {
      return value;
    }
    return 'active';
  }

  private mapPaymentMode(value: string | undefined): Patient['paymentMode'] {
    if (value === 'weekly' || value === 'biweekly' || value === 'insurance') {
      return value;
    }

    if (value === 'per_session') {
      return 'per-session';
    }

    return undefined;
  }

  private mapPaymentModeToApi(value: Patient['paymentMode']): ApiPatientPayload['payment_type'] {
    if (value === 'per-session') {
      return 'per_session';
    }

    if (value === 'weekly' || value === 'biweekly' || value === 'insurance') {
      return value;
    }

    return undefined;
  }

  private optional(value: string | undefined | null): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }
}
