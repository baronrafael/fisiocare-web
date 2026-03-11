import { TestBed } from '@angular/core/testing';
import { SessionsRepository } from './sessions.repository';

describe('SessionsRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create and update sessions', () => {
    const repository = TestBed.inject(SessionsRepository);
    const sessionId = repository.nextId();

    repository.create({
      id: sessionId,
      patientId: 'p-001',
      sessionAt: '2026-03-11',
      type: 'mixed',
      generalNotes: 'Sesion de prueba',
      activities: [
        {
          id: 'a-test-1',
          name: 'Coordinacion manual',
          type: 'cognitive',
          durationMinutes: 12,
          description: 'Bloques cortos de precision'
        }
      ]
    });

    const created = repository.findById(sessionId);
    expect(created).toBeTruthy();
    expect(created?.activities[0]?.durationMinutes).toBe(12);

    repository.update(sessionId, {
      patientId: 'p-001',
      sessionAt: '2026-03-12',
      type: 'physical',
      generalNotes: 'Sesion actualizada',
      activities: [
        {
          id: 'a-test-1',
          name: 'Marcha asistida',
          type: 'physical',
          sets: 3,
          reps: 8
        }
      ]
    });

    const updated = repository.findById(sessionId);
    expect(updated?.sessionAt).toBe('2026-03-12');
    expect(updated?.type).toBe('physical');
    expect(updated?.activities[0]?.sets).toBe(3);
  });
});
