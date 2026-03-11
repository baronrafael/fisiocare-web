import { Injectable, signal } from '@angular/core';
import { Patient } from '../../core/models/patient.model';
import { MOCK_PATIENTS } from '../data/patients.mock';

@Injectable({ providedIn: 'root' })
export class PatientsRepository {
  private readonly patientsSignal = signal<Patient[]>(MOCK_PATIENTS);

  readonly patients = this.patientsSignal.asReadonly();

  findById(id: string): Patient | undefined {
    return this.patientsSignal().find((item) => item.id === id);
  }

  create(patient: Patient): void {
    this.patientsSignal.update((patients) => [patient, ...patients]);
  }

  update(patientId: string, payload: Omit<Patient, 'id'>): void {
    this.patientsSignal.update((patients) =>
      patients.map((patient) => (patient.id === patientId ? { id: patientId, ...payload } : patient))
    );
  }

  nextId(): string {
    const total = this.patientsSignal().length + 1;
    return `p-${String(total).padStart(3, '0')}`;
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
}
