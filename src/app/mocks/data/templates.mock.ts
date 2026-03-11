import { SessionTemplate } from '../../core/models/template.model';

export const MOCK_TEMPLATES: SessionTemplate[] = [
  {
    id: 't-001',
    name: 'Primera sesion',
    defaultSessionType: 'mixed',
    notesStructure: 'Evaluacion inicial, tolerancia al esfuerzo y plan de seguimiento.',
    includeBorg: true,
    includeWongBaker: true,
    suggestedActivities: [
      { name: 'Transferencias cama-silla', type: 'physical', sets: 2, reps: 6 },
      { name: 'Memoria visual con tarjetas', type: 'cognitive', description: '4 rondas de 90 segundos.' }
    ]
  },
  {
    id: 't-002',
    name: 'Seguimiento estandar',
    defaultSessionType: 'physical',
    notesStructure: 'Dolor percibido, respuesta funcional y ajustes de carga.',
    includeBorg: true,
    suggestedActivities: [
      { name: 'Marcha asistida', type: 'physical', sets: 3, reps: 8 },
      { name: 'Puente de gluteo', type: 'physical', sets: 2, reps: 10 }
    ]
  },
  {
    id: 't-003',
    name: 'Seguimiento cardio',
    defaultSessionType: 'physical',
    notesStructure: 'Respuesta hemodinamica pre y post esfuerzo.',
    includeBorg: true,
    includeVitals: true,
    suggestedActivities: [
      { name: 'Bicicleta estatica suave', type: 'physical', sets: 3, reps: 1, description: 'Bloques de 4 minutos.' }
    ]
  }
];
