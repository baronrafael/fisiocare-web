export type PatientFileType = 'study' | 'consent' | 'report' | 'other';

export interface PatientFile {
  id: string;
  patientId: string;
  type: PatientFileType;
  fileName: string;
  uploadedAt: string;
}
