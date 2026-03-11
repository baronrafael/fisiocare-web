import { SessionRecord } from '../../core/models/session.model';

export const MOCK_SESSIONS: SessionRecord[] = [
  {
    id: 's-001',
    patientId: 'p-001',
    sessionAt: '2026-03-09',
    type: 'physical',
    generalNotes: 'Tolero mejor los cambios de posicion y reporto menos dolor nocturno.',
    borgScale: 3,
    wongBakerScale: 2,
    preEffort: { pa: '120/78', fc: 74, spo2: 96 },
    postEffort: { pa: '128/80', fc: 88, spo2: 95 },
    activities: [
      { id: 'a-001', name: 'Marcha asistida', type: 'physical', sets: 3, reps: 8 },
      { id: 'a-002', name: 'Puente de gluteo', type: 'physical', sets: 2, reps: 10 }
    ]
  },
  {
    id: 's-002',
    patientId: 'p-001',
    sessionAt: '2026-03-05',
    type: 'mixed',
    generalNotes: 'Requiere pausas cortas entre bloques. Mantiene buena disposicion.',
    activities: [
      { id: 'a-003', name: 'Transferencias cama-silla', type: 'physical', sets: 2, reps: 6 },
      { id: 'a-004', name: 'Memoria visual con cartas', type: 'cognitive', description: '4 rondas de 90 segundos.' }
    ]
  },
  {
    id: 's-003',
    patientId: 'p-002',
    sessionAt: '2026-03-10',
    type: 'physical',
    generalNotes: 'Disminuye dolor post sesion. Mejor control de respiracion durante esfuerzo.',
    evaluations: { rpe: 6, rir: 3 },
    activities: [
      { id: 'a-005', name: 'Movilidad lumbar activa', type: 'physical', sets: 3, reps: 12 },
      { id: 'a-006', name: 'Bird-dog', type: 'physical', sets: 3, reps: 8 }
    ]
  }
];
