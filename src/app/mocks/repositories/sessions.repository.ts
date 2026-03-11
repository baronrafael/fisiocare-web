import { Injectable, signal } from '@angular/core';
import { SessionRecord } from '../../core/models/session.model';
import { MOCK_SESSIONS } from '../data/sessions.mock';

@Injectable({ providedIn: 'root' })
export class SessionsRepository {
  private readonly sessionsSignal = signal<SessionRecord[]>(MOCK_SESSIONS);

  readonly sessions = this.sessionsSignal.asReadonly();

  findByPatientId(patientId: string): SessionRecord[] {
    return this.sessionsSignal()
      .filter((session) => session.patientId === patientId)
      .sort((a, b) => b.sessionAt.localeCompare(a.sessionAt));
  }

  findById(sessionId: string): SessionRecord | undefined {
    return this.sessionsSignal().find((session) => session.id === sessionId);
  }

  create(session: SessionRecord): void {
    this.sessionsSignal.update((sessions) => [session, ...sessions]);
  }

  update(sessionId: string, payload: Omit<SessionRecord, 'id'>): void {
    this.sessionsSignal.update((sessions) =>
      sessions.map((session) => (session.id === sessionId ? { id: sessionId, ...payload } : session))
    );
  }

  nextId(): string {
    const total = this.sessionsSignal().length + 1;
    return `s-${String(total).padStart(3, '0')}`;
  }
}
