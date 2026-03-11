import { ContactLog } from '../../core/models/contact-log.model';

export const MOCK_CONTACT_LOGS: ContactLog[] = [
  {
    id: 'c-001',
    patientId: 'p-001',
    occurredAt: '2026-03-08',
    type: 'confirmed',
    description: 'Confirmo sesion por WhatsApp para el lunes 9:00 am.'
  },
  {
    id: 'c-002',
    patientId: 'p-001',
    occurredAt: '2026-03-01',
    type: 'family-update',
    description: 'Familiar reporta mejor tolerancia para subir escaleras.'
  },
  {
    id: 'c-003',
    patientId: 'p-002',
    occurredAt: '2026-03-07',
    type: 'rescheduled',
    description: 'Se reprograma sesion de sabado para domingo por viaje del paciente.'
  }
];
