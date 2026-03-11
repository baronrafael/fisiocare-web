export type ContactLogType = 'cancelled' | 'rescheduled' | 'confirmed' | 'family-update' | 'note';

export interface ContactLog {
  id: string;
  patientId: string;
  occurredAt: string;
  type: ContactLogType;
  description: string;
}
