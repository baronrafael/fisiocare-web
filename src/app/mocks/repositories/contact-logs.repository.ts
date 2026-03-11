import { Injectable, signal } from '@angular/core';
import { ContactLog } from '../../core/models/contact-log.model';
import { MOCK_CONTACT_LOGS } from '../data/contact-logs.mock';

@Injectable({ providedIn: 'root' })
export class ContactLogsRepository {
  private readonly logsSignal = signal<ContactLog[]>(MOCK_CONTACT_LOGS);

  readonly logs = this.logsSignal.asReadonly();

  findByPatientId(patientId: string): ContactLog[] {
    return this.logsSignal()
      .filter((log) => log.patientId === patientId)
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }

  create(payload: Omit<ContactLog, 'id'>): void {
    this.logsSignal.update((logs) => [
      {
        id: this.nextId(),
        ...payload
      },
      ...logs
    ]);
  }

  remove(contactLogId: string): void {
    this.logsSignal.update((logs) => logs.filter((log) => log.id !== contactLogId));
  }

  private nextId(): string {
    const total = this.logsSignal().length + 1;
    return `c-${String(total).padStart(3, '0')}`;
  }
}
