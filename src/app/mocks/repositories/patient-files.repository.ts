import { Injectable, signal } from '@angular/core';
import { PatientFile, PatientFileType } from '../../core/models/patient-file.model';
import { MOCK_PATIENT_FILES } from '../data/patient-files.mock';

@Injectable({ providedIn: 'root' })
export class PatientFilesRepository {
  private readonly filesSignal = signal<PatientFile[]>(MOCK_PATIENT_FILES);

  readonly files = this.filesSignal.asReadonly();

  findByPatientId(patientId: string): PatientFile[] {
    return this.filesSignal()
      .filter((file) => file.patientId === patientId)
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }

  create(payload: Omit<PatientFile, 'id' | 'uploadedAt'>): void {
    this.filesSignal.update((files) => [
      {
        id: this.nextId(),
        uploadedAt: new Date().toISOString().slice(0, 10),
        ...payload
      },
      ...files
    ]);
  }

  remove(fileId: string): void {
    this.filesSignal.update((files) => files.filter((file) => file.id !== fileId));
  }

  private nextId(): string {
    const total = this.filesSignal().length + 1;
    return `f-${String(total).padStart(3, '0')}`;
  }
}
