import { PatientFile } from '../../core/models/patient-file.model';

export const MOCK_PATIENT_FILES: PatientFile[] = [
  {
    id: 'f-001',
    patientId: 'p-001',
    type: 'study',
    fileName: 'rx-cadera-febrero-2026.pdf',
    uploadedAt: '2026-02-20'
  },
  {
    id: 'f-002',
    patientId: 'p-001',
    type: 'consent',
    fileName: 'consentimiento-firmado.pdf',
    uploadedAt: '2026-02-18'
  },
  {
    id: 'f-003',
    patientId: 'p-002',
    type: 'study',
    fileName: 'resonancia-lumbar.pdf',
    uploadedAt: '2026-03-02'
  }
];
